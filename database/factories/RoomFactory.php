<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Difficulty;
use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lives = $this->faker->numberBetween(1, 5);

        return [
            'remaining_lives' => $lives,
            'lives' => $lives,
            'number_min' => 1,
            'number_max' => 100,
            'difficulty' => Difficulty::Normal,
            'status' => RoomStatus::Waiting,
            'total_rounds' => $this->faker->numberBetween(1, 10),
        ];
    }
}
