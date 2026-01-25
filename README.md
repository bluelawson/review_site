## 起動方法

Docker Compose を使って Next.js の開発サーバーと MySQL を同時に起動し、ライフサイクルを同期できます。

1. Docker Desktop（または任意の Docker Engine）がローカルで動作していることを確認します。
2. プロジェクトのルートから次を実行します。

   ```bash
   docker compose up -d
   ```

   - Dockerfile や依存関係を変更した場合は `docker compose up -d --build` を実行してイメージを再ビルドしてください。

   - アプリは `http://localhost:3000` で配信されます。
   - MySQL は `localhost:3306` で `review_user` / `review_pass` により待ち受け、Prisma は `mysql://review_user:review_pass@db:3306/review_site` で接続できます。

3. 必要に応じて Prisma のマイグレーションを実行します。

   ```bash
   docker compose exec app npx prisma migrate dev
   ```

4. `docker compose down` で Next.js と MySQL を停止します。

## バックエンド構成

GraphQL のバックエンドは以下の責務分離で構成します。

```
src/backend/
  review/
    resolver/        # GraphQL の入出力・認可・例外整形
    application/     # ユースケース（Service）と DTO
    domain/          # ドメインモデル・ドメインロジック
    repository/      # Prisma などデータアクセスの具体実装
  user/
    domain/
    repository/
  shared/            # 共通インフラ（Prisma client など）
```

### ルール

- Resolver は Application を経由して呼び出す（Domain を直接呼ばない）
- Application は DTO を受け取り、Domain モデルに変換して処理する
- Domain 配下にドメイン知識を集中させ、それ以外には書かない
- Repository にデータアクセスの実装を置く
- 共通インフラは `shared` に置く

## ログの確認方法

- アプリ（Next.js）ログ: `docker compose logs -f app`
- DB（MySQL）ログ: `docker compose logs -f db`
- 直近のみ確認: `docker compose logs --tail=200 app`
- 起動状態の確認: `docker compose ps`

## 実装作業で使うコマンド

### Prisma（マイグレーション／生成／操作）

- マイグレーション作成＋適用: `docker compose exec app npx prisma migrate dev --name <change-name>`
- 既存マイグレーション適用（開発時）: `docker compose exec app npx prisma migrate dev`
- Prisma Client 生成: `docker compose exec app npx prisma generate`
- Prisma Studio 起動: `docker compose exec app npx prisma studio`
- DBを初期化して再作成: `docker compose exec app npx prisma migrate reset`
- マイグレーションを作らず反映（試作向け）: `docker compose exec app npx prisma db push`
- 初期データ投入: `docker compose exec app npx prisma db seed`

### 品質チェック

- Lint: `docker compose exec app npm run lint`
- Format: `docker compose exec app npm run format`

## テーブル変更の方法

1. `prisma/schema.prisma` を更新します。
2. マイグレーションを作成＋適用します。

   ```bash
   docker compose exec app npx prisma migrate dev --name <change-name>
   ```

3. 生成された SQL を確認します。`prisma/migrations/*/migration.sql`
4. Prisma Client が自動生成されていることを確認します。
   - `npm run dev` は `predev` で `prisma generate` が走るため、通常は追加操作不要です。
   - 明示的に生成したい場合は `docker compose exec app npx prisma generate`

## 手順の確認元

本 README の手順は、以下の設定・スクリプトに基づいて確認しています。

- `docker-compose.yml`（サービス名 app/db, 起動コマンド, ポート）
- `package.json`（scripts の定義）
- `.env`（DATABASE_URL / MYSQL_DATABASE_URL）
- `prisma/schema.prisma`（モデル定義）
