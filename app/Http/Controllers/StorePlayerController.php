<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\StorePlayerRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StorePlayerController extends Controller
{
    /**
     * ルーム参加.
     */
    public function __invoke(StorePlayerRequest $request, Room $room): JsonResponse
    {
        [$room, $player] = DB::transaction(function () use ($request, $room) {
            $lockedRoom = Room::query()->lockForUpdate()->find($room->id);

            abort_if($lockedRoom->status !== RoomStatus::Waiting, 409, 'このルームには参加できません');
            abort_if($lockedRoom->players()->count() >= 8, 422, 'このルームは満員です');

            /** @var string $name */
            $name = $request->validated('name');

            $player = $lockedRoom->players()->create(['name' => $name]);
            $lockedRoom->load('players');

            return [$lockedRoom, $player];
        });

        return RoomResource::make($room)->additional([
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->rawToken,
            ],
        ])->response()->setStatusCode(201);
    }
}
