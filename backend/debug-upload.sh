#!/usr/bin/env bash
# Envoie une seule photo et affiche la réponse brute du serveur.
# Le serveur doit tourner (php artisan serve). Utilisation, depuis backend/ : bash debug-upload.sh

BASE=http://127.0.0.1:8000/api

cleanup() {
  php artisan tinker --execute='
    $u = App\Models\User::where("email", "debug@example.com")->first();
    if ($u) {
      foreach (App\Models\Property::withTrashed()->where("user_id", $u->id)->pluck("id") as $pid) {
        Illuminate\Support\Facades\Storage::disk("public")->deleteDirectory("properties/".$pid);
      }
      $u->tokens()->delete();
      $u->delete();
    }
  ' > /dev/null 2>&1
}

cleanup

# Fabrique une image PNG de 800x600
python3 - << 'PY'
import struct, zlib
w, h = 800, 600
raw = b"".join(b"\x00" + bytes((200, 80, 60)) * w for _ in range(h))
def chunk(t, d):
    c = struct.pack(">I", len(d)) + t + d
    return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
with open("/tmp/debug-img.png", "wb") as f:
    f.write(b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw))
            + chunk(b"IEND", b""))
PY

TOKEN=$(curl -s -X POST $BASE/auth/register \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{"name":"Debug","email":"debug@example.com","phone":"+237688000009","password":"motdepasse123","password_confirmation":"motdepasse123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

REF=$(curl -s -X POST $BASE/my/properties \
  -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"category_id":1,"transaction_type":"sale"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['reference'])")
echo "Référence : $REF"

echo
echo "--- Réponse brute de l'envoi (en-têtes puis corps) ---"
curl -s -i -X POST $BASE/my/properties/$REF/images \
  -H "Accept: application/json" -H "Authorization: Bearer $TOKEN" \
  -F "images[]=@/tmp/debug-img.png" | head -c 1500
echo
echo
echo "--- Dernière erreur du journal Laravel ---"
grep "local.ERROR" storage/logs/laravel.log | tail -1 | cut -c1-600

cleanup
rm -f /tmp/debug-img.png