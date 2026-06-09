<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ShowRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowRoomController extends Controller
{
    /**
     * ルーム状態取得.
     */
    public function __invoke(ShowRoomRequest $request, Room $room): JsonResource
    {
        $room->load('players');

        return RoomResource::make($room);
    }
}
