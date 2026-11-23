#!/usr/bin/env bash
# Test manuel : favoris et demandes de contact. Le serveur doit tourner (php artisan serve).
# Utilisation, depuis backend/ : bash smoke-test-2.sh

BASE=http://127.0.0.1:8000/api
EMAIL_A="smoke-owner@example.com"
EMAIL_B="smoke-visitor@example.com"

# Affiche seulement le code HTTP d'une requête
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

# Extrait une valeur d'une réponse JSON : ... | jget "d['data']['reference']"
jget() { python3 -c "import sys,json; d=json.load(sys.stdin); print($1)"; }

cleanup() {
  php artisan tinker --execute='
    $users = App\Models\User::whereIn("email", ["smoke-owner@example.com", "smoke-visitor@example.com"])->get();
    foreach ($users as $u) { $u->tokens()->delete(); $u->delete(); }
  ' > /dev/null 2>&1
}

cleanup

register() {
  curl -s -X POST $BASE/auth/register \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    -d "{\"name\":\"$3\",\"email\":\"$1\",\"phone\":\"$2\",\"password\":\"motdepasse123\",\"password_confirmation\":\"motdepasse123\"}" \
    | jget "d['token']"
}

TOKEN_A=$(register $EMAIL_A +237688000011 "Propriétaire Test")
TOKEN_B=$(register $EMAIL_B +237688000012 "Visiteur Test")
AUTH_A="Authorization: Bearer $TOKEN_A"
AUTH_B="Authorization: Bearer $TOKEN_B"

create_property() {
  curl -s -X POST $BASE/my/properties \
    -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
    -d "$1" | jget "d['data']['reference']"
}

# Une annonce complète (qu'on publie à la main) et un brouillon
REF=$(create_property '{"category_id":1,"transaction_type":"sale","title":"Villa test","description":"Description de test.","price":150000000,"city":"Yaoundé","neighborhood":"Bastos","built_area":200,"land_status":"title_available","address":"Rue secrète 12"}')
DRAFT=$(create_property '{"category_id":1,"transaction_type":"sale","title":"Brouillon"}')
php artisan tinker --execute="App\Models\Property::where('reference','$REF')->first()->forceFill(['status'=>'published','published_at'=>now()])->save();" > /dev/null
echo "Bien publié : $REF | brouillon : $DRAFT"

echo
echo "== 1. Favoris =="
echo "Favoris au départ :"
curl -s $BASE/favorites -H "Accept: application/json" -H "$AUTH_B" | jget "'   total : ' + str(d['meta']['total'])"

echo "Ajout du bien en favori :"
curl -s -X PUT $BASE/properties/$REF/favorite -H "Accept: application/json" -H "$AUTH_B" | jget "'   is_favorite : ' + str(d['is_favorite'])"
echo "Ajout répété (attendu : aucune erreur, toujours 1 seul favori) :"
curl -s -X PUT $BASE/properties/$REF/favorite -H "Accept: application/json" -H "$AUTH_B" | jget "'   is_favorite : ' + str(d['is_favorite'])"
curl -s $BASE/favorites -H "Accept: application/json" -H "$AUTH_B" | jget "'   total : ' + str(d['meta']['total']) + ' | adresse exposée à un tiers ? ' + str('address' in d['data'][0])"

echo "Liste publique avec jeton (is_favorite attendu True) :"
curl -s $BASE/properties -H "Accept: application/json" -H "$AUTH_B" | jget "'   ' + str(d['data'][0].get('is_favorite'))"
echo "Liste publique sans jeton (champ absent, donc None) :"
curl -s $BASE/properties -H "Accept: application/json" | jget "'   ' + str(d['data'][0].get('is_favorite'))"
echo "Fiche avec jeton du propriétaire (pas favori : False) :"
curl -s $BASE/properties/$REF -H "Accept: application/json" -H "$AUTH_A" | jget "'   ' + str(d['data'].get('is_favorite'))"

echo "Favori sans jeton (attendu 401) : $(code -X PUT $BASE/properties/$REF/favorite -H 'Accept: application/json')"
echo "Favori sur un brouillon (attendu 404) : $(code -X PUT $BASE/properties/$DRAFT/favorite -H 'Accept: application/json' -H "$AUTH_B")"

echo "Retrait du favori :"
curl -s -X DELETE $BASE/properties/$REF/favorite -H "Accept: application/json" -H "$AUTH_B" | jget "'   is_favorite : ' + str(d['is_favorite'])"
curl -s $BASE/favorites -H "Accept: application/json" -H "$AUTH_B" | jget "'   total : ' + str(d['meta']['total'])"

echo
echo "== 2. Demandes de contact et de visite =="
FUTURE=$(date -d '+3 days' '+%Y-%m-%d 10:00:00')

# $1 = référence, $2 = corps JSON, autres arguments = en-têtes supplémentaires
inq() {
  curl -s -o /dev/null -w "%{http_code}" -X POST $BASE/properties/$1/inquiries \
    -H "Accept: application/json" -H "Content-Type: application/json" "${@:3}" -d "$2"
}

echo "Message sans nom (attendu 422) : $(inq $REF '{"type":"contact","message":"Bonjour"}')"
echo "Message d'un visiteur anonyme (attendu 201) : $(inq $REF '{"type":"contact","name":"Marie","phone":"+237677000000","message":"Bonjour, le bien est-il disponible ?"}')"
echo "Visite sans date (attendu 422) : $(inq $REF '{"type":"visit","name":"Marie","phone":"+237677000000"}')"
echo "Visite à une date passée (attendu 422) : $(inq $REF '{"type":"visit","name":"Marie","phone":"+237677000000","visit_at":"2020-01-01 10:00:00"}')"
echo "Visite d'un utilisateur connecté, nom et téléphone repris du profil (attendu 201) : $(inq $REF "{\"type\":\"visit\",\"visit_at\":\"$FUTURE\"}" -H "$AUTH_B")"
echo "Clic WhatsApp anonyme (attendu 201) : $(inq $REF '{"type":"whatsapp"}')"
echo "Type inconnu (attendu 422) : $(inq $REF '{"type":"piratage"}')"
echo "Demande sur un brouillon (attendu 404) : $(inq $DRAFT '{"type":"whatsapp"}')"

echo
echo "== 3. Boîte de réception du propriétaire =="
show_inbox() {
  python3 -c "
import sys, json
d = json.load(sys.stdin)
print('   total :', d['meta']['total'], '| nouveaux :', d['stats']['new'])
for i in d['data']:
    print('   ', i['id'], i['type'], '|', i['name'], '|', i['status'], '|', i['property']['reference'])
"
}
curl -s $BASE/my/inquiries -H "Accept: application/json" -H "$AUTH_A" | show_inbox
echo "Compteur de contacts du bien (attendu 3) :"
curl -s $BASE/my/properties/$REF -H "Accept: application/json" -H "$AUTH_A" | jget "'   ' + str(d['data']['contacts_count'])"
echo "Compteur visible par le public ? (attendu False) :"
curl -s $BASE/properties/$REF -H "Accept: application/json" | jget "'   ' + str('contacts_count' in d['data'])"

INQ=$(curl -s $BASE/my/inquiries -H "Accept: application/json" -H "$AUTH_A" | jget "d['data'][0]['id']")

echo "Marquer la demande $INQ comme lue :"
curl -s -X PATCH $BASE/my/inquiries/$INQ -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"status":"read"}' | jget "'   statut : ' + d['data']['status']"
curl -s $BASE/my/inquiries -H "Accept: application/json" -H "$AUTH_A" | jget "'   nouveaux : ' + str(d['stats']['new'])"
echo "Filtre par statut « new » :"
curl -s -G $BASE/my/inquiries -H "Accept: application/json" -H "$AUTH_A" --data-urlencode "status=new" | show_inbox
echo "Statut invalide (attendu 422) : $(code -X PATCH $BASE/my/inquiries/$INQ -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_A" -d '{"status":"archived"}')"

echo
echo "== 4. Sécurité =="
echo "Boîte de réception sans jeton (attendu 401) : $(code -H 'Accept: application/json' $BASE/my/inquiries)"
echo "Boîte d'un autre utilisateur (attendu : total 0) :"
curl -s $BASE/my/inquiries -H "Accept: application/json" -H "$AUTH_B" | show_inbox
echo "Modification d'une demande par un autre utilisateur (attendu 403) : $(code -X PATCH $BASE/my/inquiries/$INQ -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_B" -d '{"status":"handled"}')"
echo "Adresse exacte vue par le visiteur sur la fiche publique (attendu False) :"
curl -s $BASE/properties/$REF -H "Accept: application/json" -H "$AUTH_B" | jget "'   ' + str('address' in d['data'])"
echo "Adresse exacte vue par le propriétaire sur la fiche publique (attendu True) :"
curl -s $BASE/properties/$REF -H "Accept: application/json" -H "$AUTH_A" | jget "'   ' + str('address' in d['data'])"

echo
cleanup
echo "Nettoyage terminé."