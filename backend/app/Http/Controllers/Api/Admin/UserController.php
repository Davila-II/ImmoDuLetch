<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // GET /api/admin/users : lecture seule pour l'instant
    public function index(Request $request)
    {
        $filters = $request->validate([
            'q' => ['sometimes', 'string', 'max:100'],
            'role' => ['sometimes', Rule::in([User::ROLE_USER, User::ROLE_ADMIN])],
            'account_type' => ['sometimes', Rule::in(User::ACCOUNT_TYPES)],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);

        $users = User::with('agency:id,name')
            ->withCount('properties')
            ->when($filters['q'] ?? null, fn ($q, $v) => $q->where(function ($w) use ($v) {
                $w->where('name', 'like', "%{$v}%")
                    ->orWhere('email', 'like', "%{$v}%")
                    ->orWhere('phone', 'like', "%{$v}%");
            }))
            ->when($filters['role'] ?? null, fn ($q, $v) => $q->where('role', $v))
            ->when($filters['account_type'] ?? null, fn ($q, $v) => $q->where('account_type', $v))
            ->latest()
            ->paginate($filters['per_page'] ?? 20)
            ->withQueryString();

        return AdminUserResource::collection($users);
    }

    // GET /api/admin/users/{id}
    public function show(User $user)
    {
        return new AdminUserResource($user->load('agency:id,name')->loadCount('properties'));
    }
}