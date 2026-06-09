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
class ReadyRoomTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_player_can_set_ready_in_waiting_room(): void
    {
        $room = Room::factory()->create();
        $player = Player::factory()->for($room)->create();

        $response = $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $response->assertOk();
        $this->assertTrue($player->fresh()->is_ready);
    }

    public function test_player_can_set_ready_in_playing_room(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Playing]);
        $player = Player::factory()->for($room)->create(['number' => 42]);

        $response = $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $response->assertOk();
        $this->assertTrue($player->fresh()->is_ready);
    }

    public function test_all_ready_in_playing_transitions_to_finished(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Playing]);
        $player1 = Player::factory()->for($room)->create(['number' => 10, 'is_ready' => true]);
        $player2 = Player::factory()->for($room)->create(['number' => 20]);

        $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $player2->rawToken],
        );

        $this->assertSame(RoomStatus::Finished, $room->fresh()->status);
    }

    public function test_all_ready_in_waiting_does_not_change_status(): void
    {
        $room = Room::factory()->create();
        $player = Player::factory()->for($room)->create();

        $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $this->assertSame(RoomStatus::Waiting, $room->fresh()->status);
    }

    public function test_cannot_ready_in_finished_room(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Finished]);
        $player = Player::factory()->for($room)->create();

        $response = $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $response->assertConflict();
    }

    public function test_rejects_player_from_different_room(): void
    {
        $room = Room::factory()->create();
        $otherPlayer = Player::factory()->for(Room::factory()->create())->create();

        $response = $this->postJson(
            route('rooms.ready', $room),
            [],
            ['X-Player-Token' => $otherPlayer->rawToken],
        );

        $response->assertForbidden();
    }

    public function test_requires_player_token(): void
    {
        $room = Room::factory()->create();

        $response = $this->postJson(route('rooms.ready', $room));

        $response->assertUnauthorized();
    }
}
