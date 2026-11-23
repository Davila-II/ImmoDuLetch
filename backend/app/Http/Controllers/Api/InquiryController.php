<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InquiryResource;
use App\Models\Inquiry;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    // POST /api/properties/{reference}/inquiries (public) : message, demande de visite,
    // ou simple clic sur « WhatsApp » / « Appeler » (pour compter les contacts)
    public function store(Request $request, Property $property)
    {
        abort_unless($property->status === Property::STATUS_PUBLISHED, 404);

        $user = $request->user('sanctum'); // peut être vide : un visiteur non connecté peut écrire

        $data = $request->validate([
            'type' => ['sometimes', Rule::in(Inquiry::TYPES)],
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'regex:/^\+?[0-9]{8,15}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'message' => ['nullable', 'string', 'max:1000'],
            // Obligatoire pour une demande de visite, et forcément dans le futur
            'visit_at' => ['nullable', 'date', 'after:now', 'required_if:type,visit'],
        ]);

        $type = $data['type'] ?? 'contact';

        // Pour un utilisateur connecté, on complète avec les informations de son profil
        $name = $data['name'] ?? $user?->name;
        $phone = $data['phone'] ?? $user?->phone;
        $email = $data['email'] ?? $user?->email;

        // Un message ou une visite doit pouvoir être suivi d'une réponse
        if (in_array($type, ['contact', 'visit'], true)) {
            if (! $name) {
                throw ValidationException::withMessages(['name' => ['Indiquez votre nom.']]);
            }
            if (! $phone && ! $email) {
                throw ValidationException::withMessages([
                    'phone' => ['Indiquez un téléphone ou un email pour être recontacté.'],
                ]);
            }
        }

        DB::transaction(function () use ($property, $user, $type, $name, $phone, $email, $data) {
            $inquiry = new Inquiry([
                'name' => $name ?: 'Visiteur',
                'phone' => $phone,
                'email' => $email,
                'message' => $data['message'] ?? null,
                'type' => $type,
                'visit_at' => $data['visit_at'] ?? null,
            ]);
            // Attribués par le code, jamais par la requête
            $inquiry->property_id = $property->id;
            $inquiry->user_id = $user?->id;
            $inquiry->status = 'new';
            $inquiry->save();

            $property->increment('contacts_count');
        });

        // Le visiteur ne reçoit qu'une confirmation, aucune donnée du bien ni du propriétaire
        return response()->json(['message' => 'Votre demande a bien été envoyée.'], 201);
    }

    // GET /api/my/inquiries : demandes reçues sur MES biens
    public function index(Request $request)
    {
        $request->validate([
            'status' => ['sometimes', Rule::in(Inquiry::STATUSES)],
            'type' => ['sometimes', Rule::in(Inquiry::TYPES)],
            'property' => ['sometimes', 'string', 'max:30'], // référence d'un bien
        ]);

        $userId = $request->user()->id;

        // whereHas : on ne garde que les demandes dont le bien appartient à l'utilisateur
        $base = Inquiry::whereHas('property', fn ($q) => $q->where('user_id', $userId));

        // Pastille « 3 nouveaux » de la messagerie
        $newCount = (clone $base)->where('status', 'new')->count();

        $inquiries = $base
            ->with('property:id,reference,title')
            ->when($request->query('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->query('type'), fn ($q, $v) => $q->where('type', $v))
            ->when($request->query('property'), fn ($q, $ref) => $q->whereHas('property', fn ($p) => $p->where('reference', $ref)))
            ->latest()
            ->paginate(20);

        return InquiryResource::collection($inquiries)
            ->additional(['stats' => ['new' => $newCount]]);
    }

    // PATCH /api/my/inquiries/{id} : marque une demande comme lue ou traitée
    public function update(Request $request, Inquiry $inquiry)
    {
        // withTrashed : même si le bien a été supprimé, on retrouve son propriétaire
        $property = Property::withTrashed()->findOrFail($inquiry->property_id);
        Gate::authorize('manage', $property);

        $data = $request->validate([
            'status' => ['required', Rule::in(['read', 'handled'])],
        ]);

        $inquiry->status = $data['status'];
        $inquiry->save();

        return new InquiryResource($inquiry->load('property:id,reference,title'));
    }
}