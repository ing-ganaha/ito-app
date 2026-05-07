<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Difficulty;
use App\Enums\RoomStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'remaining_lives',
    'lives',
    'number_min',
    'number_max',
    'difficulty',
    'status',
    'total_rounds',
])]
class Room extends Model
{
    use HasFactory;

    /**
     * @return HasMany<Player, $this>
     */
    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    /**
     * @return HasMany<Round, $this>
     */
    public function rounds(): HasMany
    {
        return $this->hasMany(Round::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'difficulty' => Difficulty::class,
            'status' => RoomStatus::class,
        ];
    }
}
