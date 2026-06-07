<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;

class StorePlayerController extends Controller
{
    /**
     * ルーム参加.
     */
    public function __invoke(StorePlayerRequest $request, Room $room): JsonResource
    {
        abort_if($room->status !== RoomStatus::Waiting, 409, 'このルームには参加できません');

        /** @var string $name */
        $name = $request->validated('name');

        $player = $room->players()->create(['name' => $name]);

        $room->load('players');

        return RoomResource::make($room)->additional([
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->secret_token,
            ],
        ]);
    }
}
