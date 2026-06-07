<?php

declare(strict_types=1);

use App\Http\Controllers\StoreRoomController;
use Illuminate\Support\Facades\Route;

Route::post('/rooms', StoreRoomController::class);
