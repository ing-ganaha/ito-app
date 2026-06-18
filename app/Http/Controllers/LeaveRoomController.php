<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\LeaveRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Player;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LeaveRoomController extends Controller
{
    /**
     * ルーム退室.
     */
    public function __invoke(LeaveRoomRequest $request, Room $room): JsonResponse
    {
        /** @var Player $player */
        $player = $request->attributes->get('player');

        $room = DB::transaction(function () use ($room, $player): ?Room {
            // 部屋行をロックして開始処理など他の更新と直列化する
            $freshRoom = Room::query()->lockForUpdate()->find($room->id);

            $wasHost = $player->is_host;
            $player->delete();

            $remaining = $freshRoom->players()->orderBy('id')->get();

            // 全員退室したら部屋ごと片付ける
            if ($remaining->isEmpty()) {
                $freshRoom->delete();

                return null;
            }

            // ホストが抜けたら最古参に引き継ぐ
            if ($wasHost) {
                $newHost = $remaining->first();
                $newHost->is_host = true;
                $newHost->save();
            }

            // ゲーム中なら、残った全員が準備完了かを再判定して詰みを防ぐ
            if ($freshRoom->status === RoomStatus::Playing
                && $remaining->every(fn (Player $p): bool => $p->is_ready)) {
                $freshRoom->status = RoomStatus::Finished;
                $freshRoom->save();
            }

            return $freshRoom;
        });

        if (! $room instanceof Room) {
            return response()->json(['data' => null]);
        }

        return RoomResource::make($room->load('players'))->response();
    }
}
