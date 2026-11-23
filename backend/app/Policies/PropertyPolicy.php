<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    // Le propriétaire du bien ou un administrateur peut le gérer
    public function manage(User $user, Property $property): bool
    {
        return $user->isAdmin() || $user->id === $property->user_id;
    }
}