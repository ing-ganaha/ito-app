<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Enums\RoomStatus;
use App\Models\Player;
use App\Models\Room;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class StartRoomTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_host_can_start_game(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true]);
        Player::factory()->for($room)->create();
        Player::factory()->for($room)->create();

        $response = $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        );

        $response->assertOk();
        $this->assertSame(RoomStatus::Playing, $room->fresh()->status);
    }

    public function test_assigns_unique_numbers_to_all_players(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true]);
        Player::factory()->for($room)->create();
        Player::factory()->for($room)->create();

        $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        );

        $numbers = $room->players()->pluck('number');

        $this->assertCount(3, $numbers);
        $this->assertCount(3, $numbers->unique());
        $numbers->each(function (int $n): void {
            $this->assertGreaterThanOrEqual(1, $n);
            $this->assertLessThanOrEqual(100, $n);
        });
    }

    public function test_resets_is_ready_for_all_players(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true, 'is_ready' => true]);
        Player::factory()->for($room)->create(['is_ready' => true]);
        Player::factory()->for($room)->create(['is_ready' => true]);

        $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        );

        $room->players()->each(
            fn (Player $player) => $this->assertFalse($player->fresh()->is_ready),
        );
    }

    public function test_non_host_cannot_start_game(): void
    {
        $room = Room::factory()->create();
        Player::factory()->for($room)->create(['is_host' => true]);
        $guest = Player::factory()->for($room)->create();

        $response = $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $guest->rawToken],
        );

        $response->assertForbidden();
    }

    public function test_cannot_start_game_that_is_not_waiting(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Playing]);
        $host = Player::factory()->for($room)->create(['is_host' => true]);

        $response = $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        );

        $response->assertConflict();
    }

    public function test_cannot_start_game_with_less_than_three_players(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true]);
        Player::factory()->for($room)->create();

        $response = $this->postJson(
            route('rooms.start', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        );

        $response->assertUnprocessable();
    }

    public function test_requires_player_token(): void
    {
        $room = Room::factory()->create();

        $response = $this->postJson(route('rooms.start', $room));

        $response->assertUnauthorized();
    }
}
