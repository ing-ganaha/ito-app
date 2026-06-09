<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\StartRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Player;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class StartRoomController extends Controller
{
    /**
     * ゲーム開始.
     */
    public function __invoke(StartRoomRequest $_request, Room $room): JsonResource
    {
        DB::transaction(function () use ($room): void {
            $freshRoom = Room::query()->lockForUpdate()->find($room->id);

            abort_if($freshRoom->status !== RoomStatus::Waiting, 409, 'ゲームはすでに開始されています');

            $players = $freshRoom->players()->lockForUpdate()->get();

            abort_if($players->count() < 2, 422, 'ゲームを開始するには2人以上のプレイヤーが必要です');

            $numbers = collect(range(1, 100))->shuffle()->take($players->count())->values();

            $freshRoom->status = RoomStatus::Playing;
            $freshRoom->save();

            $players->each(function (Player $player, int $index) use ($numbers): void {
                $player->number = $numbers->get($index);
                $player->is_ready = false;
                $player->save();
            });
        });

        $room->refresh()->load('players');

        return RoomResource::make($room);
    }
}
