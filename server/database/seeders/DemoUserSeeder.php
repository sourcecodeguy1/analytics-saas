<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'free@demo.com'],
            [
                'name' => 'Free Demo User',
                'password' => Hash::make('password'),
                'subscription_status' => 'free',
            ]
        );

        User::updateOrCreate(
            ['email' => 'pro@demo.com'],
            [
                'name' => 'Pro Demo User',
                'password' => Hash::make('password'),
                'subscription_status' => 'active',
                'subscription_plan' => 'monthly',
            ]
        );
    }
}
