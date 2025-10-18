<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory{
    public function definition()
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone_number'=> $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'image' => $this->faker->imageUrl(200, 200),
            'password' => bcrypt('password'),
            'remember_token' => Str::random(10)
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
      //  return $this->state(fn (array $attributes) => [
    //        'email_verified_at' => null,
       // ]);
    }
}
