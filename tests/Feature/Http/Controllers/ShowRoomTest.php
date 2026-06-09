<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Models\Player;
use App\Models\Room;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
class ShowRoomTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_returns_room_with_players(): void
    {
        $room = Room::factory()->create();
        $player = Player::factory()->for($room)->create();

        $response = $this->getJson(
            route('rooms.show', $room),
            ['X-Player-Token' => $player->secret_token],
        );

        $response->assertOk();
        $response->assertJson([
            'data' => [
                'code' => $room->code,
                'status' => $room->status->value,
                'players' => [
                    [
                        'id' => $player->id,
                        'name' => $player->name,
                    ],
                ],
            ],
        ]);
    }

    public function test_requires_player_token(): void
    {
        $room = Room::factory()->create();

        $response = $this->getJson(route('rooms.show', $room));

        $response->assertUnauthorized();
    }

    public function test_rejects_invalid_token(): void
    {
        $room = Room::factory()->create();

        $response = $this->getJson(
            route('rooms.show', $room),
            ['X-Player-Token' => 'invalid-token'],
        );

        $response->assertUnauthorized();
    }

    public function test_rejects_player_from_different_room(): void
    {
        $room = Room::factory()->create();
        $otherRoom = Room::factory()->create();
        $otherPlayer = Player::factory()->for($otherRoom)->create();

        $response = $this->getJson(
            route('rooms.show', $room),
            ['X-Player-Token' => $otherPlayer->secret_token],
        );

        $response->assertForbidden();
    }

    public function test_returns_not_found_for_unknown_room(): void
    {
        $player = Player::factory()->for(Room::factory()->create())->create();

        $response = $this->getJson(
            route('rooms.show', ['room' => 'XXXXXX']),
            ['X-Player-Token' => $player->secret_token],
        );

        $response->assertNotFound();
    }
}
