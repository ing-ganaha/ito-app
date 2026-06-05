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
    protected $model = Player::class;

    public function definition(): array
    {
        return [
            'room_id' => Room::factory(),
            'name' => fake()->userName(),
            'secret_token' => bin2hex(random_bytes(32)),
            'number' => null,
            'is_host' => false,
            'is_ready' => false,
        ];
    }

    public function host(): static
    {
        return $this->state(['is_host' => true]);
    }

    public function ready(): static
    {
        return $this->state(['is_ready' => true]);
    }
}
