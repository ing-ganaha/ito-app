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
class StorePlayerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_joins_room_as_non_host_player(): void
    {
        $room = Room::factory()->has(Player::factory()->host())->create();

        $response = $this->postJson(route('rooms.players.store', $room), ['name' => 'じろう']);

        $response->assertCreated();

        $player = $room->players()->where('name', 'じろう')->sole();

        $this->assertFalse($player->is_host);
        $this->assertNotEmpty($player->secret_token);

        $response->assertJson([
            'data' => [
                'code' => $room->code,
            ],
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->secret_token,
            ],
        ]);
    }

    public function test_requires_name(): void
    {
        $room = Room::factory()->create();

        $response = $this->postJson(route('rooms.players.store', $room), []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('name');
    }

    public function test_rejects_name_already_used_in_room(): void
    {
        $room = Room::factory()->has(Player::factory()->state(['name' => 'たろう']))->create();

        $response = $this->postJson(route('rooms.players.store', $room), ['name' => 'たろう']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('name');
    }

    public function test_allows_same_name_in_different_rooms(): void
    {
        Room::factory()->has(Player::factory()->state(['name' => 'たろう']))->create();
        $room = Room::factory()->create();

        $response = $this->postJson(route('rooms.players.store', $room), ['name' => 'たろう']);

        $response->assertCreated();
    }

    public function test_cannot_join_room_that_is_not_waiting(): void
    {
        $room = Room::factory()->playing()->create();

        $response = $this->postJson(route('rooms.players.store', $room), ['name' => 'じろう']);

        $response->assertConflict();
        $this->assertSame(0, $room->players()->count());
    }

    public function test_returns_not_found_for_unknown_room_code(): void
    {
        $response = $this->postJson(route('rooms.players.store', ['room' => 'UNKNOWN']), ['name' => 'じろう']);

        $response->assertNotFound();
    }
}
