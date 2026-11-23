<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Inscription : crée le compte et renvoie directement un jeton
    public function register(Request $request): JsonResponse
    {
        // validate() arrête la requête avec une erreur 422 si une règle n'est pas respectée
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            // Numéro avec ou sans « + », 8 à 15 chiffres (ex. +237699000000)
            'phone' => ['required', 'regex:/^\+?[0-9]{8,15}$/', 'unique:users,phone'],
            // « confirmed » exige un champ password_confirmation identique
            'password' => ['required', 'confirmed', Password::min(8)],
            // Un compte « agence » sera créé plus tard par un autre processus
            'account_type' => ['sometimes', Rule::in(['particulier', 'independant'])],
        ]);

        // refresh() recharge les valeurs par défaut de la base (ex. account_type, role)
        $user = User::create($data)->refresh();

        $token = $user->createToken($request->input('device_name', 'app'))->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    // Connexion avec l'email OU le téléphone
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
            'device_name' => ['sometimes', 'string', 'max:100'],
        ]);

        $field = filter_var($data['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $data['login'])->first();

        // Même message si l'utilisateur n'existe pas ou si le mot de passe est faux :
        // on ne révèle pas quels comptes existent.
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken($data['device_name'] ?? 'app')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user->load('agency')),
            'token' => $token,
        ]);
    }

    // Déconnexion : supprime uniquement le jeton utilisé pour cette requête
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    // Profil de l'utilisateur connecté
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('agency')),
        ]);
    }
}