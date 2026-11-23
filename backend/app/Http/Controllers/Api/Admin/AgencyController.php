<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminAgencyResource;
use App\Http\Resources\AdminUserResource;
use App\Models\Agency;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AgencyController extends Controller
{
    // GET /api/admin/agencies
    public function index(Request $request)
    {
        $filters = $request->validate([
            'q' => ['sometimes', 'string', 'max:100'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);

        $agencies = Agency::withCount(['members', 'properties'])
            ->when($filters['q'] ?? null, fn ($q, $v) => $q->where(function ($w) use ($v) {
                $w->where('name', 'like', "%{$v}%")
                    ->orWhere('rccm', 'like', "%{$v}%")
                    ->orWhere('city', 'like', "%{$v}%");
            }))
            ->orderBy('name')
            ->paginate($filters['per_page'] ?? 20)
            ->withQueryString();

        return AdminAgencyResource::collection($agencies);
    }

    // GET /api/admin/agencies/{id}
    public function show(Agency $agency)
    {
        return new AdminAgencyResource(
            $agency->loadCount(['members', 'properties'])->load('members:id,name,email,agency_id,is_agency_admin')
        );
    }

    // POST /api/admin/agencies
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'rccm' => ['nullable', 'string', 'max:50', 'unique:agencies,rccm'],
            'phone' => ['nullable', 'regex:/^\+?[0-9]{8,15}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_certified' => ['sometimes', 'boolean'],
        ]);

        // is_certified n'est pas dans $fillable de Agency : on l'attribue explicitement
        $agency = new Agency($data);
        $agency->is_certified = $request->boolean('is_certified');
        $agency->save();

        return (new AdminAgencyResource($agency))->response()->setStatusCode(201);
    }

    // PATCH /api/admin/agencies/{id} : modifie la fiche, ou certifie / retire la certification
    public function update(Request $request, Agency $agency)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'rccm' => ['sometimes', 'nullable', 'string', 'max:50', Rule::unique('agencies', 'rccm')->ignore($agency->id)],
            'phone' => ['sometimes', 'nullable', 'regex:/^\+?[0-9]{8,15}$/'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_certified' => ['sometimes', 'boolean'],
        ]);

        $agency->fill($data);
        if (array_key_exists('is_certified', $data)) {
            $agency->is_certified = (bool) $data['is_certified'];
        }
        $agency->save();

        return new AdminAgencyResource($agency->loadCount(['members', 'properties']));
    }

    // POST /api/admin/agencies/{id}/members : rattache un compte existant à l'agence
    public function addMember(Request $request, Agency $agency)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'is_agency_admin' => ['sometimes', 'boolean'],
        ]);

        $user = User::where('email', $data['email'])->firstOrFail();

        if ($user->agency_id && $user->agency_id !== $agency->id) {
            return response()->json([
                'message' => 'Ce compte est déjà rattaché à une autre agence.',
            ], 409);
        }

        // Ces champs ne sont pas dans $fillable de User : seul l'administrateur peut les changer
        $user->forceFill([
            'agency_id' => $agency->id,
            'account_type' => 'agence',
            'is_agency_admin' => $request->boolean('is_agency_admin'),
        ])->save();

        return new AdminUserResource($user->load('agency:id,name'));
    }

    // DELETE /api/admin/agencies/{agency}/members/{user} : détache un membre
    public function removeMember(Agency $agency, User $user)
    {
        abort_unless($user->agency_id === $agency->id, 404);

        $user->forceFill([
            'agency_id' => null,
            'is_agency_admin' => false,
            'account_type' => 'independant',
        ])->save();

        return new AdminUserResource($user->load('agency:id,name'));
    }
}