<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\PlayerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['name', 'is_ready'])]
#[Hidden(['secret_token'])]
#[UseFactory(PlayerFactory::class)]
class Player extends Model
{
    /** @use HasFactory<PlayerFactory> */
    use HasFactory;

    /** @return BelongsTo<Room, $this> */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    protected function casts(): array
    {
        return [
            'number' => 'integer',
            'is_host' => 'boolean',
            'is_ready' => 'boolean',
        ];
    }

    public string $rawToken = '';

    protected static function booted(): void
    {
        static::creating(function (self $player): void {
            if (empty($player->secret_token)) {
                $raw = bin2hex(random_bytes(32));
                $player->rawToken = $raw;
                $player->secret_token = hash('sha256', $raw);
            }
        });
    }
}
