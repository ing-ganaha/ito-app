<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreRoomController extends Controller
{
    /**
     * ルーム作成.
     */
    public function __invoke(StoreRoomRequest $request): JsonResource
    {
        [$room, $player] = DB::transaction(function () use ($request) {
            $room = new Room;
            $room->code = $this->generateUniqueCode();
            $room->save();

            /** @var string $name */
            $name = $request->validated('name');

            $player = $room->players()->make(['name' => $name]);
            $player->is_host = true;
            $player->save();

            return [$room, $player];
        });

        $room->load('players');

        return RoomResource::make($room)->additional([
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->secret_token,
            ],
        ]);
    }

    private function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (Room::query()->where('code', $code)->exists());

        return $code;
    }
}
