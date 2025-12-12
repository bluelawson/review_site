/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleUsers = [
  {
    name: 'ゲストレビュアー',
    email: 'guest@seren.jp',
    password: 'seren123',
    plan: 'guest',
    reviewsSubmitted: 2,
  },
  {
    name: '未投稿ユーザー',
    email: 'member@seren.jp',
    password: 'member123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
];

const sampleReviews = [
  {
    shopName: '水色りぼん',
    workerName: 'らら',
    estimatedAge: '23-25',
    bodyType: 'スレンダー',
    bustSize: 'D',
    heightCm: 158,
    personality: '癒やし系',
    headline: 'しっとり系で丁寧な接客、余韻が残る時間',
    detail:
      '受付からお風呂の段取りまでとにかく丁寧。会話のテンポも落ち着いていて居心地が良かった。マットは余計な力がなく、体重移動がかなり滑らか。恋人感を重視する人に刺さりそう。',
    serviceHighlights: ['マット', '共浴', 'キス◎'],
    rating: 4.8,
    damage: '90分 38,000円+オプ2,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'fantasy',
    workerName: 'リノ',
    estimatedAge: '26-28',
    bodyType: 'グラマラス',
    bustSize: 'F',
    heightCm: 165,
    personality: '積極的',
    headline: '圧倒的な密着とリード。玄人向けの濃密コース',
    detail:
      '入室直後からスキンシップ多め。ディープキスも申し訳程度ではなく、距離の詰め方が速い。マットもスピードがあってスパっと抜いてくるタイプ。支配されたい人には最高。体感価値は料金以上。',
    serviceHighlights: ['即密着', 'ディープキス', '攻め強'],
    rating: 4.6,
    damage: '100分 42,000円 指名料込み',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '女帝',
    workerName: 'マリア',
    estimatedAge: '30-32',
    bodyType: 'メリハリ',
    bustSize: 'E',
    heightCm: 170,
    personality: '明るい',
    headline: 'トーク力高め、ビギナーにも優しい王道サービス',
    detail:
      'ルームは広めで清潔。序盤から終盤までテンポが一定で、安心して身を任せられる。トークで場を温めてからマットも丁寧で初心者に優しい。ハードさは控えめ。',
    serviceHighlights: ['会話巧者', 'ビギナー向け', '安心感'],
    rating: 4.3,
    damage: '80分 32,000円',
    authorEmail: 'guest@seren.jp',
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.user.deleteMany();

  for (const user of sampleUsers) {
    await prisma.user.create({ data: user });
  }

  for (const review of sampleReviews) {
    const { authorEmail, ...rest } = review;
    await prisma.review.create({
      data: {
        ...rest,
        serviceHighlights: rest.serviceHighlights ?? [],
        author: {
          connect: { email: authorEmail },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
