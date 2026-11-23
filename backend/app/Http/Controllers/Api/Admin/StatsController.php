<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    // GET /api/admin/stats : compteurs du tableau de bord
    public function __invoke(): JsonResponse
    {
        $byStatus = Property::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json(['data' => [
            // Nombre d'annonces pour chaque statut, y compris ceux à zéro
            'properties' => collect(Property::STATUSES)
                ->mapWithKeys(fn ($status) => [$status => (int) ($byStatus[$status] ?? 0)]),
            'pending_review' => (int) ($byStatus[Property::STATUS_PENDING] ?? 0),
            'users' => User::count(),
            'agencies' => Agency::count(),
            'inquiries_new' => Inquiry::where('status', 'new')->count(),
            'views_total' => (int) Property::sum('views_count'),
        ]]);
    }
}