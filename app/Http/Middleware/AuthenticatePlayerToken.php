<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Player;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatePlayerToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Player-Token');

        if (! $token) {
            abort(401);
        }

        $player = Player::query()->where('secret_token', $token)->first();

        if (! $player) {
            abort(401);
        }

        $request->attributes->set('player', $player);

        return $next($request);
    }
}
