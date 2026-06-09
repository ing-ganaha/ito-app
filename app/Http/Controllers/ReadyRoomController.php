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

            if ($room->status === RoomStatus::Playing &&
                $room->players()->where('is_ready', false)->doesntExist()) {
                $room->status = RoomStatus::Finished;
                $room->save();
            }
        });

        $room->load('players');

        return RoomResource::make($room);
    }
}
