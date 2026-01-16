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
