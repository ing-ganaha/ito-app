<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\RoomStatus;
use App\Http\Requests\StartRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Player;
use App\Models\Room;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class StartRoomController extends Controller
{
    /**
     * ゲーム開始.
     */
    /**
     * Claude での生成に失敗したときに使うお題候補.
     *
     * @var list<string>
     */
    private const FALLBACK_TOPICS = [
        '盛り上がる遊び',
        '人気の食べ物',
        '危険な生き物',
        '欲しいプレゼント',
        '行ってみたい場所',
        '懐かしいもの',
        '集中できる場所',
        'テンションが上がる音楽',
        '記憶に残る映画',
        'リラックスできる時間',
    ];

    public function __invoke(StartRoomRequest $_request, Room $room): JsonResource
    {
        $topic = $this->generateTopic() ?? $this->fallbackTopic();

        DB::transaction(function () use ($room, $topic): void {
            $freshRoom = Room::query()->lockForUpdate()->find($room->id);

            abort_if($freshRoom->status !== RoomStatus::Waiting, 409, 'ゲームはすでに開始されています');

            $players = $freshRoom->players()->lockForUpdate()->get();

            abort_if($players->count() < 3, 422, 'ゲームを開始するには3人以上のプレイヤーが必要です');

            $numbers = collect(range(1, 100))->shuffle()->take($players->count())->values();

            $freshRoom->topic = $topic;
            $freshRoom->status = RoomStatus::Playing;
            $freshRoom->save();

            $players->each(function (Player $player, int $index) use ($numbers): void {
                $player->number = $numbers->get($index);
                $player->is_ready = false;
                $player->save();
            });
        });

        $room->refresh()->load('players');

        return RoomResource::make($room);
    }

    private function generateTopic(): ?string
    {
        $apiKey = config('services.anthropic.api_key');
        if (! $apiKey) {
            return null;
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' => 'Bearer '.$apiKey,
                    'anthropic-version' => '2023-06-01',
                ])
                ->post('https://api.anthropic.com/v1/messages', [
                    'model' => 'claude-haiku-4-5-20251001',
                    'max_tokens' => 50,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => 'パーティーゲーム「ito」のお題を1つ生成してください。

お題とは、プレイヤーが1〜100の数字を「名詞」で例えて表現するための、短いカテゴリ名です。形容詞と名詞の組み合わせで、その形容詞が示す尺度に沿って、プレイヤーが名詞を挙げて順位づけできるものにしてください。

条件:
- 主観や感覚で答えられること(客観的な知識を問わない)
- 多くの人がいくつもの名詞を連想できる広さがあること
- 形容詞も名詞のジャンルも、毎回違うものから選ぶこと

出力は短い日本語の名詞句のみ。前置き・解説・引用符・記号は不要です。',
                        ],
                    ],
                ]);

            $topic = trim((string) $response->json('content.0.text'), "「」\n\r\t ");

            return $response->ok() && $topic !== '' ? $topic : null;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * フォールバック用のお題をランダムに1つ返す.
     */
    private function fallbackTopic(): string
    {
        return Arr::random(self::FALLBACK_TOPICS);
    }
}
