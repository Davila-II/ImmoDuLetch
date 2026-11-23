#!/usr/bin/env bash
# Test manuel : panneau admin. Le serveur doit tourner (php artisan serve).
# Utilisation, depuis backend/ : bash smoke-test-3.sh

BASE=http://127.0.0.1:8000/api
EMAIL_O="smoke-owner3@example.com"
EMAIL_ADM="smoke-admin3@example.com"

# Affiche seulement le code HTTP d'une requête
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

# Extrait une valeur d'une réponse JSON : ... | jget "d['data']['reference']"
jget() { python3 -c "import sys,json; d=json.load(sys.stdin); print($1)"; }

cleanup() {
  php artisan tinker --execute='
    $users = App\Models\User::whereIn("email", ["smoke-owner3@example.com", "smoke-admin3@example.com"])->get();
    foreach ($users as $u) { $u->tokens()->delete(); $u->delete(); }
    App\Models\Agency::where("name", "like", "Agence Smoke%")->delete();
  ' > /dev/null 2>&1
}

cleanup

# Inscription. Le propriétaire tente de s'attribuer le rôle admin (champ « role ») : il doit être ignoré.
register() {
  curl -s -X POST $BASE/auth/register \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    -d "{\"name\":\"$3\",\"email\":\"$1\",\"phone\":\"$2\",\"password\":\"motdepasse123\",\"password_confirmation\":\"motdepasse123\",\"role\":\"admin\"}" \
    | jget "d['token']"
}

TOKEN_O=$(register $EMAIL_O +237688000021 "Propriétaire Smoke")
TOKEN_ADM=$(register $EMAIL_ADM +237688000022 "Administrateur Smoke")
AUTH_O="Authorization: Bearer $TOKEN_O"
AUTH_ADM="Authorization: Bearer $TOKEN_ADM"
OWNER_ID=$(curl -s $BASE/auth/me -H "Accept: application/json" -H "$AUTH_O" | jget "d['user']['id']")

echo "== 0. Rôle à l'inscription =="
echo "Rôle du propriétaire malgré « role: admin » dans la requête (attendu : user) :"
curl -s $BASE/auth/me -H "Accept: application/json" -H "$AUTH_O" | jget "'   ' + d['user']['role']"

echo
echo "== 1. Accès refusé aux non-administrateurs =="
echo "Stats d'admin sans jeton (attendu 401) : $(code -H 'Accept: application/json' $BASE/admin/stats)"
echo "Stats d'admin par un simple utilisateur (attendu 403) : $(code -H 'Accept: application/json' -H "$AUTH_O" $BASE/admin/stats)"

echo
echo "== 2. Commande make-admin =="
php artisan app:make-admin inconnu-smoke@example.com | sed 's/^/   /'
php artisan app:make-admin $EMAIL_ADM | sed 's/^/   /'
echo "Stats d'admin par l'administrateur (attendu 200) : $(code -H 'Accept: application/json' -H "$AUTH_ADM" $BASE/admin/stats)"

echo
echo "== 3. Préparation : deux annonces en attente et un brouillon =="
create_property() {
  curl -s -X POST $BASE/my/properties \
    -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_O" \
    -d "$1" | jget "d['data']['reference']"
}
P1=$(create_property '{"category_id":1,"transaction_type":"sale","title":"Bien A","description":"Description A.","price":150000000,"city":"Yaoundé","neighborhood":"Bastos","built_area":200,"land_status":"title_available","address":"Rue secrète 12"}')
P2=$(create_property '{"category_id":1,"transaction_type":"sale","title":"Bien B","description":"Description B.","price":90000000,"city":"Douala","neighborhood":"Bonapriso","built_area":150,"land_status":"to_verify"}')
D=$(create_property '{"category_id":1,"transaction_type":"sale","title":"Brouillon privé"}')
echo "Biens : $P1, $P2 | brouillon : $D"
# On simule l'envoi en validation (le minimum de 3 photos est déjà testé ailleurs)
php artisan tinker --execute="foreach (App\Models\Property::whereIn('reference',['$P1','$P2'])->get() as \$p) { \$p->forceFill(['status'=>'pending'])->save(); }" > /dev/null

echo
echo "== 4. Statistiques et file de modération =="
curl -s $BASE/admin/stats -H "Accept: application/json" -H "$AUTH_ADM" \
  | jget "'   en attente : ' + str(d['data']['pending_review']) + ' | brouillons : ' + str(d['data']['properties']['draft']) + ' | publiées : ' + str(d['data']['properties']['published'])"
echo "File par défaut, sans les brouillons (attendu : 2 annonces, en attente) :"
curl -s -G $BASE/admin/properties -H "Accept: application/json" -H "$AUTH_ADM" --data-urlencode "q=Propriétaire Smoke" \
  | jget "'   total : ' + str(d['meta']['total']) + ' | ' + ', '.join(p['reference'] + ':' + p['status'] for p in d['data'])"
echo "Filtre sur les brouillons (attendu : 1) :"
curl -s -G $BASE/admin/properties -H "Accept: application/json" -H "$AUTH_ADM" --data-urlencode "status=draft" --data-urlencode "q=Propriétaire Smoke" \
  | jget "'   total : ' + str(d['meta']['total'])"
echo "Détail d'une annonce : email du propriétaire et adresse exacte visibles de l'admin :"
curl -s $BASE/admin/properties/$P1 -H "Accept: application/json" -H "$AUTH_ADM" \
  | jget "'   ' + d['data']['owner']['email'] + ' | adresse : ' + str(d['data'].get('address'))"
echo "Modération par un simple utilisateur (attendu 403) : $(code -X POST -H 'Accept: application/json' -H "$AUTH_O" $BASE/admin/properties/$P1/approve)"

echo
echo "== 5. Approbation, refus, suspension =="
echo "Approbation de $P1 :"
curl -s -X POST $BASE/admin/properties/$P1/approve -H "Accept: application/json" -H "$AUTH_ADM" \
  | jget "'   statut : ' + d['data']['status'] + ' | publiée le renseigné : ' + str(d['data']['published_at'] is not None) + ' | expiration renseignée : ' + str(d['data']['expires_at'] is not None)"
echo "Fiche publique de $P1 (attendu 200) : $(code -H 'Accept: application/json' $BASE/properties/$P1)"
echo "Seconde approbation (attendu 409) : $(code -X POST -H 'Accept: application/json' -H "$AUTH_ADM" $BASE/admin/properties/$P1/approve)"

echo "Refus de $P2 sans motif (attendu 422) : $(code -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_ADM" $BASE/admin/properties/$P2/reject -d '{}')"
echo "Refus de $P2 avec motif :"
curl -s -X POST $BASE/admin/properties/$P2/reject -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d '{"reason":"Photos de mauvaise qualité, merci de les remplacer."}' | jget "'   statut : ' + d['data']['status']"
echo "Fiche publique de $P2 (attendu 404) : $(code -H 'Accept: application/json' $BASE/properties/$P2)"
echo "Le propriétaire voit le motif dans « Mes annonces » :"
curl -s $BASE/my/properties/$P2 -H "Accept: application/json" -H "$AUTH_O" | jget "'   ' + d['data']['status'] + ' | ' + str(d['data']['rejection_reason'])"
echo "Le propriétaire corrige : l'annonce redevient un brouillon et le motif disparaît :"
curl -s -X PUT $BASE/my/properties/$P2 -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_O" \
  -d '{"title":"Bien B corrigé"}' | jget "'   ' + d['data']['status'] + ' | ' + str(d['data']['rejection_reason'])"
echo "Refus d'un brouillon (attendu 409) : $(code -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_ADM" $BASE/admin/properties/$P2/reject -d '{"reason":"Test de refus"}')"

echo "Suspension de $P1 :"
curl -s -X POST $BASE/admin/properties/$P1/suspend -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d '{"reason":"Signalement en cours de vérification."}' | jget "'   statut : ' + d['data']['status']"
echo "Fiche publique suspendue (attendu 404) : $(code -H 'Accept: application/json' $BASE/properties/$P1)"
echo "Rétablissement :"
curl -s -X POST $BASE/admin/properties/$P1/reinstate -H "Accept: application/json" -H "$AUTH_ADM" | jget "'   statut : ' + d['data']['status']"
echo "Fiche publique rétablie (attendu 200) : $(code -H 'Accept: application/json' $BASE/properties/$P1)"

echo
echo "== 6. Mises en avant =="
echo "Marquer $P1 comme exclusif :"
curl -s -X PATCH $BASE/admin/properties/$P1/flags -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d '{"is_exclusive":true,"is_featured":true}' | jget "'   exclusif : ' + str(d['data']['is_exclusive']) + ' | coup de coeur : ' + str(d['data']['is_featured'])"
echo "Visible sur la fiche publique :"
curl -s $BASE/properties/$P1 -H "Accept: application/json" | jget "'   exclusif : ' + str(d['data']['is_exclusive'])"

echo
echo "== 7. Agences =="
AGENCY_JSON='{"name":"Agence Smoke Test","rccm":"RC/DLA/2026/B/9999","phone":"+237677000099","email":"agence-smoke@example.com","city":"Douala","is_certified":true}'
echo "Création par un simple utilisateur (attendu 403) : $(code -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_O" $BASE/admin/agencies -d "$AGENCY_JSON")"
AG=$(curl -s -X POST $BASE/admin/agencies -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" -d "$AGENCY_JSON" | jget "d['data']['id']")
echo "Agence créée : $AG"
echo "RCCM déjà utilisé (attendu 422) : $(code -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_ADM" $BASE/admin/agencies -d "$AGENCY_JSON")"

echo "Rattachement du propriétaire comme administrateur de l'agence :"
curl -s -X POST $BASE/admin/agencies/$AG/members -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d "{\"email\":\"$EMAIL_O\",\"is_agency_admin\":true}" | jget "'   type : ' + d['data']['account_type'] + ' | agence : ' + d['data']['agency']['name']"
echo "Vu par l'utilisateur lui-même :"
curl -s $BASE/auth/me -H "Accept: application/json" -H "$AUTH_O" | jget "'   type : ' + d['user']['account_type'] + ' | admin d\'agence : ' + str(d['user']['is_agency_admin']) + ' | agence : ' + str(d['user']['agency']['name'])"

AG2=$(curl -s -X POST $BASE/admin/agencies -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d '{"name":"Agence Smoke Test 2","rccm":"RC/YDE/2026/B/8888"}' | jget "d['data']['id']")
echo "Rattachement à une seconde agence (attendu 409) : $(code -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_ADM" $BASE/admin/agencies/$AG2/members -d "{\"email\":\"$EMAIL_O\"}")"

echo "Retrait de la certification :"
curl -s -X PATCH $BASE/admin/agencies/$AG -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_ADM" \
  -d '{"is_certified":false}' | jget "'   certifiée : ' + str(d['data']['is_certified']) + ' | membres : ' + str(d['data']['members_count'])"

echo "Détachement du membre :"
curl -s -X DELETE $BASE/admin/agencies/$AG/members/$OWNER_ID -H "Accept: application/json" -H "$AUTH_ADM" \
  | jget "'   type : ' + d['data']['account_type'] + ' | agence : ' + str(d['data']['agency'])"
echo "Détachement d'un non-membre (attendu 404) : $(code -X DELETE -H 'Accept: application/json' -H "$AUTH_ADM" $BASE/admin/agencies/$AG/members/$OWNER_ID)"

echo
echo "== 8. Utilisateurs =="
curl -s -G $BASE/admin/users -H "Accept: application/json" -H "$AUTH_ADM" --data-urlencode "q=smoke-owner3" \
  | jget "'   total : ' + str(d['meta']['total']) + ' | biens du propriétaire : ' + str(d['data'][0]['properties_count'])"
echo "Liste des utilisateurs par un simple utilisateur (attendu 403) : $(code -H 'Accept: application/json' -H "$AUTH_O" $BASE/admin/users)"

echo
echo "== 9. Retrait des droits =="
php artisan app:make-admin $EMAIL_ADM --revoke | sed 's/^/   /'
echo "Stats d'admin après retrait des droits (attendu 403) : $(code -H 'Accept: application/json' -H "$AUTH_ADM" $BASE/admin/stats)"

echo
cleanup
echo "Nettoyage terminé."