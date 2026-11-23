#!/usr/bin/env bash
# Test manuel de l'API. Le serveur doit tourner (php artisan serve).
# Utilisation, depuis backend/ : bash smoke-test.sh

BASE=http://127.0.0.1:8000/api
EMAIL_A="smoke-a@example.com"
EMAIL_B="smoke-b@example.com"

# Affiche seulement le code HTTP d'une requête
code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

# Supprime les utilisateurs de test, leurs biens (en cascade) et leurs fichiers de photos
cleanup() {
  php artisan tinker --execute='
    $users = App\Models\User::whereIn("email", ["smoke-a@example.com", "smoke-b@example.com"])->get();
    foreach ($users as $u) {
      foreach (App\Models\Property::withTrashed()->where("user_id", $u->id)->pluck("id") as $pid) {
        Illuminate\Support\Facades\Storage::disk("public")->deleteDirectory("properties/".$pid);
      }
      $u->tokens()->delete();
      $u->delete();
    }
  ' > /dev/null 2>&1
}

# Nettoyage préalable, au cas où un test précédent se serait arrêté en route
cleanup

# Fabrique des images de test : une grande (2400x1600, pour vérifier la réduction),
# deux petites, et un faux fichier image (du texte) pour vérifier le refus
python3 - << 'PY'
import struct, zlib

def png(path, w, h, rgb):
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n"
                + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                + chunk(b"IDAT", zlib.compress(raw))
                + chunk(b"IEND", b""))

png("/tmp/smoke-img-1.png", 2400, 1600, (200, 80, 60))
png("/tmp/smoke-img-2.png", 800, 600, (60, 120, 200))
png("/tmp/smoke-img-3.png", 800, 600, (60, 180, 100))
open("/tmp/smoke-fake.png", "w").write("ceci n'est pas une image")
PY

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

# Affiche les photos d'une réponse JSON : id, position, principale
show_images() {
  python3 -c "
import sys, json
d = json.load(sys.stdin)['data']
print('   photos :', d['photos_count'])
for i in d['images']:
    print('   ', 'id', i['id'], '| position', i['position'], '| principale' if i['is_primary'] else '|', '| légende :', i['caption'])
"
}

echo "== 1. Création d'un brouillon =="
REF=$(curl -s -X POST $BASE/my/properties \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"category_id":1,"transaction_type":"sale","draft_step":1}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['reference'])")
echo "Référence : $REF"
echo "Fiche publique d'un brouillon (attendu 404) : $(code -H 'Accept: application/json' $BASE/properties/$REF)"

echo
echo "== 2. Remplissage et envoi sans photo =="
curl -s -X PUT $BASE/my/properties/$REF \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"title":"Villa Duplex Bastos","description":"Belle villa avec piscine et forage.","price":380000000,"city":"Yaoundé","neighborhood":"Bastos","built_area":380,"land_area":1200,"rooms":6,"bedrooms":5,"bathrooms":4,"land_status":"title_available","land_title_number":"14820","amenities":[1,2,5],"draft_step":3}' \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('statut :', p['status'], '| prix/m2 :', p['price_per_sqm'])"
echo "Envoi en validation sans photo (attendu 422) : $(code -X POST $BASE/my/properties/$REF/submit -H 'Accept: application/json' -H "$AUTH_A")"

echo
echo "== 3. Photos =="
echo "Envoi de 3 photos (la première est la plus grande) :"
UPLOAD=$(curl -s -X POST $BASE/my/properties/$REF/images -H "Accept: application/json" -H "$AUTH_A" \
  -F "images[]=@/tmp/smoke-img-1.png" -F "images[]=@/tmp/smoke-img-2.png" -F "images[]=@/tmp/smoke-img-3.png")
echo "$UPLOAD" | show_images

set -- $(echo "$UPLOAD" | python3 -c "import sys,json; print(' '.join(str(i['id']) for i in json.load(sys.stdin)['data']['images']))")
ID1=$1; ID2=$2; ID3=$3

URL1=$(echo "$UPLOAD" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['images'][0]['url'])")
echo "URL de la première photo : $URL1"
echo "Accès à la photo (attendu 200) : $(code $URL1)"
echo "Format et taille réels du fichier stocké (attendu WebP, 2000 px de large au maximum) :"
curl -s $URL1 | file - | sed 's/^/   /'

echo "Refus d'un faux fichier image (attendu 422) : $(code -X POST $BASE/my/properties/$REF/images -H 'Accept: application/json' -H "$AUTH_A" -F 'images[]=@/tmp/smoke-fake.png;type=image/png')"

echo "Ajout d'une légende à la photo $ID1 :"
curl -s -X PATCH $BASE/my/properties/$REF/images/$ID1 \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"caption":"Salon réception"}' | show_images

echo "Réordonnancement : la photo $ID3 passe en premier (elle doit devenir la principale) :"
curl -s -X PUT $BASE/my/properties/$REF/images/order \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d "{\"order\":[$ID3,$ID1,$ID2]}" | show_images

echo "Réordonnancement incomplet (attendu 422) : $(code -X PUT $BASE/my/properties/$REF/images/order -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_A" -d "{\"order\":[$ID3,$ID1]}")"

echo "Suppression de la photo principale $ID3 (la suivante doit la remplacer) :"
curl -s -X DELETE $BASE/my/properties/$REF/images/$ID3 -H "Accept: application/json" -H "$AUTH_A" | show_images

echo "Envoi en validation avec seulement 2 photos (attendu 422) : $(code -X POST $BASE/my/properties/$REF/submit -H 'Accept: application/json' -H "$AUTH_A")"

echo "Ajout d'une photo pour revenir à 3 :"
curl -s -X POST $BASE/my/properties/$REF/images -H "Accept: application/json" -H "$AUTH_A" \
  -F "images[]=@/tmp/smoke-img-3.png" | show_images

echo
echo "== 4. Envoi en validation puis publication manuelle =="
curl -s -X POST $BASE/my/properties/$REF/submit \
  -H "Accept: application/json" -H "$AUTH_A" \
  | python3 -c "import sys,json; print('après envoi, statut :', json.load(sys.stdin)['data']['status'])"
php artisan tinker --execute="App\Models\Property::where('reference','$REF')->first()->forceFill(['status'=>'published','published_at'=>now()])->save();" > /dev/null

echo
echo "== 5. API publique =="
echo "Catégories (nom : nombre de biens publiés) :"
curl -s $BASE/categories | python3 -c "import sys,json; [print('  ', c['name'], ':', c['properties_count']) for c in json.load(sys.stdin)['data']]"

echo "Liste filtrée (Yaoundé, forage, plus de 100 M, prix décroissant) :"
curl -s -G $BASE/properties -H "Accept: application/json" \
  --data-urlencode "city=Yaoundé" --data-urlencode "min_price=100000000" \
  --data-urlencode "amenities[]=forage" --data-urlencode "sort=price_desc" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('   total :', d['meta']['total']); [print('  ', p['reference'], p['title'], p['price'], '| photos :', p['photos_count']) for p in d['data']]"

echo "Liste filtrée sans résultat attendu (Douala) :"
curl -s -G $BASE/properties -H "Accept: application/json" --data-urlencode "city=Douala" \
  | python3 -c "import sys,json; print('   total :', json.load(sys.stdin)['meta']['total'])"

echo "Filtre invalide (attendu 422) : $(code -G $BASE/properties -H 'Accept: application/json' --data-urlencode 'sort=nimporte')"

echo "Fiche du bien :"
curl -s $BASE/properties/$REF -H "Accept: application/json" \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('  ', p['reference'], '| vues :', p['views_count'], '| photos :', len(p['images']), '| contact :', p['contact']); print('   adresse exposée au public ? ', 'address' in p)"

echo "Biens similaires (un seul bien : liste vide attendue) :"
curl -s $BASE/properties/$REF/similar -H "Accept: application/json" \
  | python3 -c "import sys,json; print('   nombre :', len(json.load(sys.stdin)['data']))"

echo
echo "== 6. Espace connecté =="
curl -s $BASE/my/properties -H "Accept: application/json" -H "$AUTH_A" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('  stats :', d['stats']); [print('  ', p['reference'], p['status']) for p in d['data']]"

echo
echo "== 7. Sécurité =="
echo "Sans jeton sur /my/properties (attendu 401) : $(code -H 'Accept: application/json' $BASE/my/properties)"
echo "Modification par un autre utilisateur (attendu 403) : $(code -X PUT $BASE/my/properties/$REF -H 'Accept: application/json' -H 'Content-Type: application/json' -H "$AUTH_B" -d '{"title":"Piratage"}')"
echo "Suppression du bien par un autre utilisateur (attendu 403) : $(code -X DELETE $BASE/my/properties/$REF -H 'Accept: application/json' -H "$AUTH_B")"
echo "Lecture par un autre utilisateur (attendu 403) : $(code $BASE/my/properties/$REF -H 'Accept: application/json' -H "$AUTH_B")"
echo "Envoi de photos par un autre utilisateur (attendu 403) : $(code -X POST $BASE/my/properties/$REF/images -H 'Accept: application/json' -H "$AUTH_B" -F 'images[]=@/tmp/smoke-img-2.png')"
echo "Suppression d'une photo par un autre utilisateur (attendu 403) : $(code -X DELETE $BASE/my/properties/$REF/images/$ID1 -H 'Accept: application/json' -H "$AUTH_B")"
echo "Tentative de s'auto-publier (attendu : statut inchangé, c'est-à-dire pending) :"
curl -s -X PUT $BASE/my/properties/$REF \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "$AUTH_A" \
  -d '{"status":"published","is_exclusive":true}' \
  | python3 -c "import sys,json; p=json.load(sys.stdin)['data']; print('   statut :', p['status'], '| exclusif :', p['is_exclusive'])"

echo
cleanup
rm -f /tmp/smoke-img-*.png /tmp/smoke-fake.png
echo "Nettoyage terminé."