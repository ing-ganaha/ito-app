<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(Str::random(6)),
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
