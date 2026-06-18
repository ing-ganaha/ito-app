<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Player;
use App\Models\Room;
use Illuminate\Foundation\Http\FormRequest;

class LeaveRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Player $player */
        $player = $this->attributes->get('player');

        /** @var Room $room */
        $room = $this->route('room');

        return $player->room_id === $room->id;
    }

    public function rules(): array
    {
        return [];
    }
}
