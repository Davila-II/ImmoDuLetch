<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class MakeAdmin extends Command
{
    protected $signature = 'app:make-admin
                            {email : Email du compte à promouvoir}
                            {--revoke : Retire les droits d\'administrateur au lieu de les donner}';

    protected $description = "Donne (ou retire) les droits d'administrateur à un compte existant";

    public function handle(): int
    {
        $user = User::where('email', $this->argument('email'))->first();

        if (! $user) {
            $this->error('Aucun compte avec cet email.');

            return self::FAILURE;
        }

        // forceFill : le champ « role » n'est volontairement pas dans $fillable,
        // aucune requête ne peut donc le modifier. Seul ce code peut le faire.
        $user->forceFill([
            'role' => $this->option('revoke') ? User::ROLE_USER : User::ROLE_ADMIN,
        ])->save();

        $this->info(
            $this->option('revoke')
                ? "{$user->email} n'est plus administrateur."
                : "{$user->email} est maintenant administrateur."
        );

        return self::SUCCESS;
    }
}