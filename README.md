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
