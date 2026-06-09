<?php

declare(strict_types=1);

use App\Http\Controllers\ShowRoomController;
use App\Http\Controllers\StorePlayerController;
use App\Http\Controllers\StoreRoomController;
use Illuminate\Support\Facades\Route;

Route::post('/rooms', StoreRoomController::class)->name('rooms.store');
Route::post('/rooms/{room}/players', StorePlayerController::class)->name('rooms.players.store');

Route::middleware('player.token')->group(function (): void {
    Route::get('/rooms/{room}', ShowRoomController::class)->name('rooms.show');
});
