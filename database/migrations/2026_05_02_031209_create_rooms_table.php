<?php

declare(strict_types=1);

use App\Enums\Difficulty;
use App\Enums\RoomStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->integer('remaining_lives')->comment('残りのライフ');
            $table->integer('lives')->comment('ライフ');
            $table->integer('number_min')->comment('数字の範囲・最小値');
            $table->integer('number_max')->comment('数字の範囲・最大値');
            $table->string('difficulty')->default(Difficulty::Normal->value)->comment('お題の難易度');
            $table->string('status')->default(RoomStatus::Waiting->value)->comment('進行状態');
            $table->integer('total_rounds')->comment('総ラウンド数');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
