<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Player;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Player>
 */
class PlayerFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'name' => $this->faker->name(),
            'number' => $this->faker->numberBetween(1, 100),
            'example' => null,
            'is_submitted' => false,
        ];
    }
}
