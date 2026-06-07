<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->lexify('??????')),
            'status' => RoomStatus::Waiting,
            'topic' => null,
        ];
    }

    public function playing(): static
    {
        return $this->state(['status' => RoomStatus::Playing]);
    }

    public function finished(): static
    {
        return $this->state(['status' => RoomStatus::Finished]);
    }
}
