<?php

declare(strict_types=1);

use App\Http\Controllers\ReadyRoomController;
use App\Http\Controllers\ShowRoomController;
use App\Http\Controllers\StartRoomController;
use App\Http\Controllers\StorePlayerController;
use App\Http\Controllers\StoreRoomController;
use Illuminate\Support\Facades\Route;

Route::post('/rooms', StoreRoomController::class)->name('rooms.store');
Route::post('/rooms/{room}/players', StorePlayerController::class)->name('rooms.players.store');

Route::middleware('player.token')->group(function (): void {
    Route::get('/rooms/{room}', ShowRoomController::class)->name('rooms.show');
    Route::post('/rooms/{room}/start', StartRoomController::class)->name('rooms.start');
    Route::post('/rooms/{room}/ready', ReadyRoomController::class)->name('rooms.ready');
});
