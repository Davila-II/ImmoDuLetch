#!/usr/bin/env bash
# Test manuel de l'API. Le serveur doit tourner (php artisan serve).
# Utilisation, depuis backend/ : bash smoke-test.sh

BASE=http://127.0.0.1:8000/api
EMAIL_A="smoke-a@example.com"
EMAIL_B="smoke-b@example.com"

# Affiche seulement le code HTTP d'une requête
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

cleanup() {
  php artisan tinker --execute="App\Models\User::whereIn('email',['$EMAIL_A','$EMAIL_B'])->get()->each(function (\$u) { \$u->tokens()->delete(); \$u->delete(); });" > /dev/null 2>&1
}

# Nettoyage préalable, au cas où un test précédent se serait arrêté en route
cleanup

register() {
  curl -s -X POST $BASE/auth/register \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    -d "{\"name\":\"Smoke Test\",\"email\":\"$1\",\"phone\":\"$2\",\"password\":\"motdepasse123\",\"password_confirmation\":\"motdepasse123\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])"
}

TOKEN_A=$(register $EMAIL_A +237688000001)
TOKEN_B=$(register $EMAIL_B +237688000002)
AUTH_A="Authorization: Bearer $TOKEN_A"
AUTH_B="Authorization: Bearer $TOKEN_B"

echo "== 1. Création d'un brouillon =="
REF=$(curl -s -X POST $BASE/my/properties \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"category_id":1,"transaction_type":"sale","draft_step":1}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['reference'])")
echo "Référence : $REF"
echo "Fiche publique d'un brouillon (attendu 404) : $(code -H 'Accept: application/json' $BASE/properties/$REF)"

echo
echo "== 2. Remplissage puis envoi en validation =="
curl -s -X PUT $BASE/my/properties/$REF \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"title":"Villa Duplex Bastos","description":"Belle villa avec piscine et forage.","price":380000000,"city":"Yaoundé","neighborhood":"Bastos","built_area":380,"land_area":1200,"rooms":6,"bedrooms":5,"bathrooms":4,"land_status":"title_available","land_title_number":"14820","amenities":[1,2,5],"draft_step":3}' \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('statut :', p['status'], '| prix/m2 :', p['price_per_sqm'])"
curl -s -X POST $BASE/my/properties/$REF/submit \
  -H "Accept: application/json" -H "$AUTH_A" \
  | python3 -c "import sys,json; print('après envoi, statut :', json.load(sys.stdin)['data']['status'])"

echo
echo "== 3. Publication manuelle (il n'y a pas encore d'écran admin) =="
php artisan tinker --execute="App\Models\Property::where('reference','$REF')->first()->forceFill(['status'=>'published','published_at'=>now()])->save();" > /dev/null

echo
echo "== 4. API publique =="
echo "Catégories (nom : nombre de biens publiés) :"
curl -s $BASE/categories | python3 -c "import sys,json; [print('  ', c['name'], ':', c['properties_count']) for c in json.load(sys.stdin)['data']]"

echo "Liste filtrée (Yaoundé, forage, plus de 100 M, prix décroissant) :"
curl -s -G $BASE/properties -H "Accept: application/json" \
  --data-urlencode "city=Yaoundé" --data-urlencode "min_price=100000000" \
  --data-urlencode "amenities[]=forage" --data-urlencode "sort=price_desc" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('   total :', d['meta']['total']); [print('  ', p['reference'], p['title'], p['price']) for p in d['data']]"

echo "Liste filtrée sans résultat attendu (Douala) :"
curl -s -G $BASE/properties -H "Accept: application/json" --data-urlencode "city=Douala" \
  | python3 -c "import sys,json; print('   total :', json.load(sys.stdin)['meta']['total'])"

echo "Filtre invalide (attendu 422) : $(code -G $BASE/properties -H 'Accept: application/json' --data-urlencode 'sort=nimporte')"

echo "Fiche du bien :"
curl -s $BASE/properties/$REF -H "Accept: application/json" \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('  ', p['reference'], '| vues :', p['views_count'], '| contact :', p['contact']); print('   adresse exposée au public ? ', 'address' in p)"

echo "Biens similaires (un seul bien : liste vide attendue) :"
curl -s $BASE/properties/$REF/similar -H "Accept: application/json" \
  | python3 -c "import sys,json; print('   nombre :', len(json.load(sys.stdin)['data']))"

echo
echo "== 5. Espace connecté =="
curl -s $BASE/my/properties -H "Accept: application/json" -H "$AUTH_A" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('  stats :', d['stats']); [print('  ', p['reference'], p['status']) for p in d['data']]"

echo
echo "== 6. Sécurité =="
echo "Sans jeton sur /my/properties (attendu 401) : $(code -H 'Accept: application/json' $BASE/my/properties)"
echo "Modification par un autre utilisateur (attendu 403) : $(code -X PUT $BASE/my/properties/$REF -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_B" -d '{"title":"Piratage"}')"
echo "Suppression par un autre utilisateur (attendu 403) : $(code -X DELETE $BASE/my/properties/$REF -H 'Accept: application/json' -H "$AUTH_B")"
echo "Lecture par un autre utilisateur (attendu 403) : $(code $BASE/my/properties/$REF -H 'Accept: application/json' -H "$AUTH_B")"
echo "Tentative de s'auto-publier (attendu : statut inchangé) :"
curl -s -X PUT $BASE/my/properties/$REF \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"status":"published","is_exclusive":true}' \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('   statut :', p['status'], '| exclusif :', p['is_exclusive'])"

echo
cleanup
echo "Nettoyage terminé."