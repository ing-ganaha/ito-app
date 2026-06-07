<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Player */
class PlayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_host' => $this->is_host,
            'is_ready' => $this->is_ready,
            'number' => $this->number,
        ];
    }
}
