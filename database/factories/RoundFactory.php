<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Room;
use App\Models\Round;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Round>
 */
class RoundFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'round_number' => $this->faker->numberBetween(1, 10),
            'topic' => $this->faker->word(),
            'is_active' => false,
        ];
    }
}
