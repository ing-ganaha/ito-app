# ito アプリ 設計ドキュメント

## ゲームの流れ

```
1. ホームページ
   ├── 「ルームを作る」→ 名前入力 → ルーム作成 → 待機室へ
   └── 「ルームに参加」→ 6桁コード + 名前入力 → 待機室へ

2. 待機室 (status: waiting)
   - 参加者一覧をリアルタイムで表示
   - ルームコードを大きく表示 (コピー可)
   - 非ホスト: 「ゲームに参加する」ボタンを押す (is_ready = true)
   - ホスト: 全員が ready になったら「ゲームを開始する」ボタンが有効化

3. ゲーム中 (status: playing)
   - Claude API でお題を生成
   - 各プレイヤーに 1〜100 の重複なしランダム数字を配布
   - 自分の数字とお題だけ表示 (会話は現実世界で)
   - 数字の順番を決めたら「結果を見る」ボタンを押す
   - 全員が押したら自動で結果ページへ遷移

4. 結果 (status: finished)
   - 全員の名前と数字を昇順で表示
   - ゲームクリア判定はなし
```

### 状態遷移

```
waiting ──start──▶ playing ──全員ready──▶ finished
```

---

## 画面遷移

```
/              → HomePage
/lobby/:code   → LobbyPage  (status: waiting)
/game/:code    → GamePage   (status: playing)
/result/:code  → ResultPage (status: finished)
```

ページ遷移は `GET /api/rooms/{code}` のポーリング（3秒間隔）で `status` の変化を検知して自動で行う。

---

## DBスキーマ

### rooms

| カラム                  | 型              | 備考                               |
| ----------------------- | --------------- | ---------------------------------- |
| id                      | BIGSERIAL PK    |                                    |
| code                    | CHAR(6) UNIQUE  | 参加用6桁コード                    |
| status                  | VARCHAR         | `waiting` / `playing` / `finished` |
| topic                   | TEXT nullable   | Claude が生成するお題              |
| created_at / updated_at | TIMESTAMP       |                                    |

### players

| カラム                  | 型                | 備考                                                                                         |
| ----------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| id                      | BIGSERIAL PK      |                                                                                              |
| room_id                 | BIGINT FK         | → rooms.id ON DELETE CASCADE                                                                 |
| name                    | VARCHAR(20)       | UNIQUE per room                                                                              |
| secret_token            | CHAR(64)          | bin2hex(random_bytes(32))                                                                    |
| number                  | SMALLINT nullable | 1〜100、ゲーム開始時にセット                                                                 |
| is_host                 | BOOLEAN           | ルーム作成者のみ true                                                                        |
| is_ready                | BOOLEAN           | 待機室: 「準備OK」押下で true / ゲーム開始時にリセット / ゲーム中: 「結果を見る」押下で true |
| created_at / updated_at | TIMESTAMP         |                                                                                              |

---

## API エンドポイント

| メソッド | パス                      | 概要                                               | 認証                    |
| -------- | ------------------------- | -------------------------------------------------- | ----------------------- |
| POST     | `/api/rooms`              | ルーム作成 (ホスト名も受け取り player 同時作成)    | 不要                    |
| POST     | `/api/rooms/{code}/join`  | ルーム参加                                         | 不要                    |
| GET      | `/api/rooms/{code}`       | ルーム状態取得                                     | X-Player-Token          |
| POST     | `/api/rooms/{code}/start` | ゲーム開始                                         | X-Player-Token (ホスト) |
| POST     | `/api/rooms/{code}/ready` | 準備完了 (待機室: 参加する / ゲーム中: 結果を見る) | X-Player-Token          |
