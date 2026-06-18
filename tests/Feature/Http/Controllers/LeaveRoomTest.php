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
class LeaveRoomTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_player_can_leave_and_is_removed(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true]);
        $player = Player::factory()->for($room)->create();

        $response = $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $response->assertOk();
        $this->assertModelMissing($player);
        $this->assertModelExists($room);
    }

    public function test_host_leaving_promotes_oldest_remaining_player(): void
    {
        $room = Room::factory()->create();
        $host = Player::factory()->for($room)->create(['is_host' => true]);
        $second = Player::factory()->for($room)->create();
        $third = Player::factory()->for($room)->create();

        $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $host->rawToken],
        )->assertOk();

        $this->assertTrue($second->fresh()->is_host);
        $this->assertFalse($third->fresh()->is_host);
    }

    public function test_last_player_leaving_deletes_the_room(): void
    {
        $room = Room::factory()->create();
        $player = Player::factory()->for($room)->create(['is_host' => true]);

        $response = $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $player->rawToken],
        );

        $response->assertOk();
        $response->assertJson(['data' => null]);
        $this->assertModelMissing($room);
    }

    public function test_leaving_playing_room_finishes_when_rest_are_ready(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Playing]);
        Player::factory()->for($room)->create(['number' => 10, 'is_ready' => true, 'is_host' => true]);
        Player::factory()->for($room)->create(['number' => 20, 'is_ready' => true]);
        $leaver = Player::factory()->for($room)->create(['number' => 30, 'is_ready' => false]);

        $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $leaver->rawToken],
        )->assertOk();

        $this->assertSame(RoomStatus::Finished, $room->fresh()->status);
    }

    public function test_leaving_playing_room_stays_playing_when_rest_not_ready(): void
    {
        $room = Room::factory()->create(['status' => RoomStatus::Playing]);
        Player::factory()->for($room)->create(['number' => 10, 'is_ready' => true, 'is_host' => true]);
        Player::factory()->for($room)->create(['number' => 20, 'is_ready' => false]);
        $leaver = Player::factory()->for($room)->create(['number' => 30, 'is_ready' => false]);

        $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $leaver->rawToken],
        )->assertOk();

        $this->assertSame(RoomStatus::Playing, $room->fresh()->status);
    }

    public function test_rejects_player_from_different_room(): void
    {
        $room = Room::factory()->create();
        $otherPlayer = Player::factory()->for(Room::factory()->create())->create();

        $response = $this->deleteJson(
            route('rooms.leave', $room),
            [],
            ['X-Player-Token' => $otherPlayer->rawToken],
        );

        $response->assertForbidden();
    }

    public function test_requires_player_token(): void
    {
        $room = Room::factory()->create();

        $response = $this->deleteJson(route('rooms.leave', $room));

        $response->assertUnauthorized();
    }
}
