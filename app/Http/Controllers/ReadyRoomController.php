<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\ReadyRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Player;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class ReadyRoomController extends Controller
{
    /**
     * 準備完了.
     */
    public function __invoke(ReadyRoomRequest $request, Room $room): JsonResource
    {
        abort_if($room->status === RoomStatus::Finished, 409, 'ゲームはすでに終了しています');

        /** @var Player $player */
        $player = $request->attributes->get('player');

        DB::transaction(function () use ($room, $player): void {
            $player->is_ready = true;
            $player->save();

            $freshRoom = Room::query()->lockForUpdate()->find($room->id);

            if ($freshRoom->status === RoomStatus::Playing &&
                $freshRoom->players()->where('is_ready', false)->doesntExist()) {
                $freshRoom->status = RoomStatus::Finished;
                $freshRoom->save();
                $room->status = RoomStatus::Finished;
            }
        });

        $room->load('players');

        return RoomResource::make($room);
    }
}
