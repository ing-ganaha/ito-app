<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Enums\RoomStatus;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreRoomControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_room_and_host_player(): void
    {
        $response = $this->postJson('/api/rooms', ['name' => 'たろう']);

        $response->assertOk();

        $room = Room::query()->sole();
        $player = $room->players()->sole();

        $this->assertSame(RoomStatus::Waiting, $room->status);
        $this->assertSame('たろう', $player->name);
        $this->assertTrue($player->is_host);
        $this->assertNotEmpty($player->secret_token);

        $response->assertJson([
            'data' => [
                'code' => $room->code,
                'status' => RoomStatus::Waiting->value,
            ],
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->secret_token,
            ],
        ]);
    }

    public function test_room_code_is_six_uppercase_characters(): void
    {
        $response = $this->postJson('/api/rooms', ['name' => 'たろう']);

        $code = $response->json('data.code');

        $this->assertMatchesRegularExpression('/\A[A-Z0-9]{6}\z/', $code);
    }

    public function test_requires_name(): void
    {
        $response = $this->postJson('/api/rooms', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('name');

        $this->assertSame(0, Room::query()->count());
    }

    public function test_rejects_name_longer_than_twenty_characters(): void
    {
        $response = $this->postJson('/api/rooms', ['name' => str_repeat('a', 21)]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('name');
    }
}
