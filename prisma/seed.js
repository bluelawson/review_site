#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

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
  {
    name: '管理者',
    email: 'admin@seren.jp',
    password: 'admin123',
    plan: 'admin',
    reviewsSubmitted: 0,
  },
];

const baseDate = new Date('2025-12-01T00:00:00.000Z');

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
    reviewRating: 4.8,
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
    reviewRating: 4.6,
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
    reviewRating: 4.3,
    damage: '80分 32,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Velvet Garden',
    workerName: 'ユイ',
    estimatedAge: '24-26',
    bodyType: '標準',
    bustSize: 'C',
    heightCm: 162,
    personality: '明るい',
    headline: '距離感が上手い、初回でも安心できるタイプ',
    detail:
      '清潔感があり、会話のテンポが良い。初回でも不安なく入れた。マットは優しめで、雰囲気重視。安心感が強く、初回向け。',
    serviceHighlights: ['初回向け', '会話◎', '清潔感'],
    rating: 4.1,
    reviewRating: 4.1,
    damage: '90分 34,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Secret Lagoon',
    workerName: 'サラ',
    estimatedAge: '27-29',
    bodyType: 'スレンダー',
    bustSize: 'B',
    heightCm: 160,
    personality: 'おとなしい',
    headline: '静かな空気感でゆっくり過ごせる',
    detail:
      '会話は控えめだが、手数は多い。落ち着いた空気でゆったり過ごしたい人向け。マットはスローだが丁寧。',
    serviceHighlights: ['静かな空気', '丁寧', '落ち着き'],
    rating: 4.0,
    reviewRating: 4.0,
    damage: '80分 30,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '水色りぼん',
    workerName: 'ミオ',
    estimatedAge: '22-24',
    bodyType: '小柄',
    bustSize: 'E',
    heightCm: 150,
    personality: '積極的',
    headline: 'テンポ良く盛り上げてくれるエネルギー型',
    detail:
      '会話もサービスもテンポ良い。終始リードしてくれるので任せたい人に良い。体感時間が短く感じた。',
    serviceHighlights: ['テンポ◎', 'リード上手', '密着'],
    rating: 4.4,
    reviewRating: 4.4,
    damage: '70分 28,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'fantasy',
    workerName: 'アヤ',
    estimatedAge: '25-27',
    bodyType: '長身',
    bustSize: 'D',
    heightCm: 172,
    personality: '癒やし系',
    headline: '包み込むような雰囲気でリラックスできる',
    detail:
      '落ち着いた空気で、こちらのペースに合わせてくれる。マットはゆっくり、丁寧。疲れている日に向いている。',
    serviceHighlights: ['リラックス', '丁寧', '癒やし'],
    rating: 4.2,
    reviewRating: 4.2,
    damage: '100分 40,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '女帝',
    workerName: 'カレン',
    estimatedAge: '28-30',
    bodyType: 'メリハリ',
    bustSize: 'G',
    heightCm: 168,
    personality: '積極的',
    headline: '攻め強めの本格派、濃い時間を楽しめる',
    detail:
      '入りから攻めが強く、テンション高め。ディープキス多めで刺激が強い。濃いめが好きな人に向く。',
    serviceHighlights: ['攻め強', '濃厚', '刺激'],
    rating: 4.7,
    reviewRating: 4.7,
    damage: '110分 45,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Velvet Garden',
    workerName: 'レイ',
    estimatedAge: '29-31',
    bodyType: '標準',
    bustSize: 'C',
    heightCm: 164,
    personality: 'おとなしい',
    headline: '落ち着いた接客でリピートしたくなる',
    detail:
      '派手さはないが、終始丁寧で安定感がある。会話は少なめだが心地よい。長く通いたいタイプ。',
    serviceHighlights: ['安定感', '丁寧', 'リピート向き'],
    rating: 4.0,
    reviewRating: 4.0,
    damage: '90分 33,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Secret Lagoon',
    workerName: 'ナナ',
    estimatedAge: '23-25',
    bodyType: 'スレンダー',
    bustSize: 'D',
    heightCm: 163,
    personality: '明るい',
    headline: '明るい接客で初見でも緊張しない',
    detail:
      '入室から笑顔で迎えてくれる。会話のテンポが良く、気疲れしない。マットも適度にしっかり。',
    serviceHighlights: ['笑顔', '会話◎', '安心感'],
    rating: 4.3,
    reviewRating: 4.3,
    damage: '90分 35,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '水色りぼん',
    workerName: 'リン',
    estimatedAge: '24-26',
    bodyType: '標準',
    bustSize: 'C',
    heightCm: 161,
    personality: '癒やし系',
    headline: 'ゆったり過ごせる癒やし枠',
    detail:
      '会話も動きもゆっくりで、安心できる。疲れを抜きたい時に合う。派手さはないが満足度は高い。',
    serviceHighlights: ['癒やし', 'ゆったり', '安心感'],
    rating: 4.1,
    reviewRating: 4.1,
    damage: '80分 31,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'fantasy',
    workerName: 'モエ',
    estimatedAge: '21-23',
    bodyType: '小柄',
    bustSize: 'B',
    heightCm: 148,
    personality: '積極的',
    headline: '元気でテンション高め、賑やかに楽しめる',
    detail:
      'とにかく明るく盛り上げてくれる。テンポが良く、時間が早く感じる。賑やかさ重視の人におすすめ。',
    serviceHighlights: ['元気', 'テンポ◎', '賑やか'],
    rating: 4.2,
    reviewRating: 4.2,
    damage: '70分 27,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '女帝',
    workerName: 'シノ',
    estimatedAge: '31-33',
    bodyType: 'グラマラス',
    bustSize: 'F',
    heightCm: 169,
    personality: 'おとなしい',
    headline: '落ち着きと濃さのバランスがいい',
    detail:
      '落ち着いた会話だが、サービスはしっかり濃い。緩急があり飽きない。大人の雰囲気で過ごせる。',
    serviceHighlights: ['大人', '濃厚', '緩急'],
    rating: 4.5,
    reviewRating: 4.5,
    damage: '100分 41,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Velvet Garden',
    workerName: 'ハル',
    estimatedAge: '26-28',
    bodyType: 'メリハリ',
    bustSize: 'E',
    heightCm: 166,
    personality: '明るい',
    headline: '明るさと技術のバランスが良い',
    detail:
      '会話で場を温めつつサービスも丁寧。テンポが心地よく、初回でも満足度が高い。',
    serviceHighlights: ['バランス型', '丁寧', '安心'],
    rating: 4.3,
    reviewRating: 4.3,
    damage: '90分 36,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: 'Secret Lagoon',
    workerName: 'ユリ',
    estimatedAge: '25-27',
    bodyType: '標準',
    bustSize: 'C',
    heightCm: 160,
    personality: '癒やし系',
    headline: '丁寧で優しい、安定感のある接客',
    detail:
      '派手さはないが全体の安定感が高い。緊張しやすい人に合う。ゆっくりしたい日におすすめ。',
    serviceHighlights: ['安定感', '丁寧', '癒やし'],
    rating: 4.1,
    reviewRating: 4.1,
    damage: '85分 32,000円',
    authorEmail: 'guest@seren.jp',
  },
  {
    shopName: '水色りぼん',
    workerName: 'サキ',
    estimatedAge: '23-25',
    bodyType: 'スレンダー',
    bustSize: 'D',
    heightCm: 159,
    personality: '明るい',
    headline: 'フレンドリーで相談しやすい',
    detail:
      '入室から話しかけてくれて緊張がほぐれる。サービスの説明も丁寧。初回におすすめ。',
    serviceHighlights: ['フレンドリー', '丁寧', '安心'],
    rating: 4.0,
    reviewRating: 4.0,
    damage: '80分 29,000円',
    authorEmail: 'guest@seren.jp',
  },
].map((review, index) => {
  const createdAt = new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000);
  return {
    ...review,
    isPublished: review.isPublished ?? true,
    createdAt,
    updatedAt: createdAt,
  };
});

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
        reviewRating: rest.reviewRating ?? rest.rating,
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
