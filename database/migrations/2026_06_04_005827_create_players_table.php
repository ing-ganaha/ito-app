<?php

declare(strict_types=1);

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
        Schema::create('players', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->string('name', 20)->comment('ルーム内でユニーク');
            $table->string('secret_token', 64)->unique()->comment('bin2hex(random_bytes(32))');
            $table->smallInteger('number')->nullable()->comment('1〜100・ゲーム開始時にセット');
            $table->boolean('is_host')->default(false)->comment('ルーム作成者のみ true');
            $table->boolean('is_ready')->default(false)->comment('待機室: 準備OK押下で true / ゲーム開始時にリセット / ゲーム中: 結果を見る押下で true');
            $table->timestamps();
            $table->unique(['room_id', 'name'], 'players_room_id_name_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
