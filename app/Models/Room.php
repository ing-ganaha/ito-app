<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\RoomStatus;
use Database\Factories\RoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'status', 'topic'])]
#[UseFactory(RoomFactory::class)]
class Room extends Model
{
    /** @use HasFactory<RoomFactory> */
    use HasFactory;

    /** @return HasMany<Player, $this> */
    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    protected function casts(): array
    {
        return [
            'status' => RoomStatus::class,
        ];
    }
}
