<p align="center">
  <h1 align="center">ito Web App</h1>
</p>

<p align="center">
<a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-FF2D20.svg?logo=laravel&logoColor=white" alt="Laravel"></a>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB.svg?logo=react&logoColor=black" alt="React"></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-success.svg" alt="License"></a>
</p>

## About

カードゲーム「ito」のWebアプリです。URLを共有するだけでどこでも遊べます。アカウント登録は不要です。

## Tech Stack

- **Backend**: Laravel (PHP)
- **Frontend**: React + TypeScript (Vite)
- **Database**: MySQL
- **Real-time**: Laravel Reverb (WebSocket)
- **AI**: Anthropic API (Claude)

## Game Flow

1. ルームを作成してURLを参加者に共有
2. 各プレイヤーは名前とアイコンを設定して入室
3. ライフ数・数字の範囲・お題の難易度・ラウンド数を設定してゲーム開始
4. 各自にランダムな数字が配られ、お題が表示される（AI生成 or 手動入力）
5. お題に沿った例えをテキストで入力して全員に開示
6. 相談しながら各自のタイミングで「カードを出す」
7. 全員出し終えたら結果発表。順番を間違えるとライフが減少

## Getting Started

```bash
# リポジトリのクローン
git clone <repository-url>
cd <project-name>

# 環境変数のセットアップ
cp .env.example .env

# コンテナの起動
./vendor/bin/sail up -d

# パッケージのインストール
./vendor/bin/sail composer install
./vendor/bin/sail npm install

# アプリケーションキーの生成
./vendor/bin/sail artisan key:generate

# データベースのマイグレーション
./vendor/bin/sail artisan migrate

# フロントエンドのビルド（開発）
./vendor/bin/sail npm run dev

# WebSocketサーバーの起動
./vendor/bin/sail artisan reverb:start
```

## Environment Variables

`.env.example` をコピーして `.env` を作成し、以下の項目を設定してください。

```env
# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ito
DB_USERNAME=sail
DB_PASSWORD=password
```

## Commands

```bash
# Lint (PHP)
./vendor/bin/sail pint

# Lint (Frontend)
./vendor/bin/sail npm run lint

# Format (Frontend)
./vendor/bin/sail npm run format

# Test (PHP)
./vendor/bin/sail artisan test

# Test (Frontend)
./vendor/bin/sail npm run test
```
