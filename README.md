これは [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) で作成した [Next.js](https://nextjs.org) プロジェクトです。

## はじめに

まずは開発サーバーを起動します。

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと結果を確認できます。

`app/page.tsx` を編集するとページの変更を始められます。ファイルを保存すると自動で更新されます。

このプロジェクトは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を利用して、Vercel の新しいフォントファミリーである [Geist](https://vercel.com/font) を自動的に最適化・読み込みします。

## さらに詳しく

Next.js について詳しく知りたい場合は、以下のリソースをご覧ください。

- [Next.js Documentation](https://nextjs.org/docs) - Next.js の機能や API を解説しています。
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブな Next.js チュートリアルです。

[Next.js の GitHub リポジトリ](https://github.com/vercel/next.js) も確認できます。フィードバックやコントリビューションも歓迎です。

## Vercel へのデプロイ

Next.js アプリをデプロイする最も簡単な方法は、Next.js の開発元が提供する [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使うことです。

詳細は [Next.js のデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。

## Docker での実行

Docker Compose を使って Next.js の開発サーバーと MySQL を同時に起動し、ライフサイクルを同期できます。

1. Docker Desktop（または任意の Docker Engine）がローカルで動作していることを確認します。
2. プロジェクトのルートから次を実行します。

   ```bash
   docker compose up --build
   ```

   - アプリは `http://localhost:3000` で配信されます。
   - MySQL は `localhost:3306` で `review_user` / `review_pass` により待ち受け、Prisma は `mysql://review_user:review_pass@db:3306/review_site` で接続できます。

3. 必要に応じて Prisma のマイグレーションを実行します。

   ```bash
   docker compose exec app npx prisma migrate dev
   ```

4. `docker compose down` で Next.js と MySQL を停止します。
