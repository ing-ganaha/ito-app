<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StoreRoomController extends Controller
{
    /**
     * ルーム作成.
     */
    public function __invoke(StoreRoomRequest $request): JsonResponse
    {
        [$room, $player] = retry(
            5,
            fn () => DB::transaction(function () use ($request) {
                $room = new Room;
                $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                $room->code = implode('', array_map(
                    fn () => $chars[random_int(0, strlen($chars) - 1)],
                    range(1, 6),
                ));
                $room->save();

                /** @var string $name */
                $name = $request->validated('name');

                $player = $room->players()->make(['name' => $name]);
                $player->is_host = true;
                $player->save();

                return [$room, $player];
            }),
            0,
            fn ($e) => $e instanceof UniqueConstraintViolationException,
        );

        $room->load('players');

        return RoomResource::make($room)->additional([
            'player' => [
                'id' => $player->id,
                'secret_token' => $player->rawToken,
            ],
        ])->response()->setStatusCode(201);
    }
}
