export type PersonalityTone = "明るい" | "おとなしい" | "積極的" | "癒やし系";

export type BodyType =
  | "スレンダー"
  | "標準"
  | "グラマラス"
  | "メリハリ"
  | "小柄"
  | "長身";

export type Review = {
  id: string;
  shopName: string;
  workerName: string;
  estimatedAge: string;
  bodyType: BodyType;
  bustSize: string;
  personality: PersonalityTone;
  headline: string;
  detail: string;
  serviceHighlights: string[];
  rating: number;
  damage: string;
  createdAt: string;
  createdBy: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  password: string;
  plan: "guest" | "premium";
  reviewsSubmitted: number;
};
