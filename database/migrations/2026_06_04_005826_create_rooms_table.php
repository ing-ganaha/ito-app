<?php

declare(strict_types=1);

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
        Schema::create('rooms', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique()->comment('参加用コード');
            $table->string('status')->default(RoomStatus::Waiting->value)->comment('waiting / playing / finished');
            $table->text('topic')->nullable()->comment('Claude が生成するお題');
            $table->unsignedBigInteger('host_player_id')->nullable()->comment('ホストの players.id（FK制約なし・循環参照回避）');
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
