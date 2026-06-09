<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;

class StorePlayerController extends Controller
{
    /**
     * ルーム参加.
     */
    public function __invoke(StorePlayerRequest $request, Room $room): JsonResponse
    {
        abort_if($room->status !== RoomStatus::Waiting, 409, 'このルームには参加できません');
        abort_if($room->players()->count() >= 8, 422, 'このルームは満員です');

        /** @var string $name */
        $name = $request->validated('name');

        $player = $room->players()->create(['name' => $name]);

        $room->load('players');

        return RoomResource::make($room)->additional([
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->secret_token,
            ],
        ])->response()->setStatusCode(201);
    }
}
