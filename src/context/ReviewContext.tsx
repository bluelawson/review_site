'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import type { Review } from '@/types';

type ReviewContextState = {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Review;
  deleteReview: (id: string) => void;
  getReviewById: (id: string) => Review | null;
};

type Action =
  | { type: 'SET'; payload: Review[] }
  | { type: 'ADD'; payload: Review }
  | { type: 'DELETE'; payload: string };

const STORAGE_KEY = 'seren:reviews';

const initialData: Review[] = [
  {
    id: 'rev-1',
    shopName: '水色りぼん',
    workerName: 'らら',
    estimatedAge: '23-25',
    bodyType: 'スレンダー',
    bustSize: 'D',
    personality: '癒やし系',
    headline: 'しっとり系で丁寧な接客、余韻が残る時間',
    detail:
      '受付からお風呂の段取りまでとにかく丁寧。会話のテンポも落ち着いていて居心地が良かった。マットは余計な力がなく、体重移動がかなり滑らか。恋人感を重視する人に刺さりそう。',
    serviceHighlights: ['マット', '共浴', 'キス◎'],
    rating: 4.8,
    damage: '90分 38,000円+オプ2,000円',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdBy: 'guest@seren.jp',
  },
  {
    id: 'rev-2',
    shopName: 'fantasy',
    workerName: 'リノ',
    estimatedAge: '26-28',
    bodyType: 'グラマラス',
    bustSize: 'F',
    personality: '積極的',
    headline: '圧倒的な密着とリード。玄人向けの濃密コース',
    detail:
      '入室直後からスキンシップ多め。ディープキスも申し訳程度ではなく、距離の詰め方が速い。マットもスピードがあってスパっと抜いてくるタイプ。支配されたい人には最高。体感価値は料金以上。',
    serviceHighlights: ['即密着', 'ディープキス', '攻め強'],
    rating: 4.6,
    damage: '100分 42,000円 指名料込み',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdBy: 'reviewer@seren.jp',
  },
  {
    id: 'rev-3',
    shopName: '女帝',
    workerName: 'マリア',
    estimatedAge: '30-32',
    bodyType: 'メリハリ',
    bustSize: 'E',
    personality: '明るい',
    headline: 'トーク力高め、ビギナーにも優しい王道サービス',
    detail:
      'ルームは広めで清潔。序盤から終盤までテンポが一定で、安心して身を任せられる。トークで場を温めてからマットも丁寧で初心者に優しい。ハードさは控えめ。',
    serviceHighlights: ['会話巧者', 'ビギナー向け', '安心感'],
    rating: 4.3,
    damage: '80分 32,000円',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    createdBy: 'guest@seren.jp',
  },
];

function reducer(state: Review[], action: Action): Review[] {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [action.payload, ...state];
    case 'DELETE':
      return state.filter((review) => review.id !== action.payload);
    default:
      return state;
  }
}

const ReviewContext = createContext<ReviewContextState | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialData);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      dispatch({ type: 'SET', payload: JSON.parse(stored) });
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addReview = useCallback(
    (review: Omit<Review, 'id' | 'createdAt'>) => {
      const newReview: Review = {
        ...review,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD', payload: newReview });
      return newReview;
    },
    [],
  );

  const deleteReview = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getReviewById = useCallback(
    (id: string) => state.find((review) => review.id === id) ?? null,
    [state],
  );

  const value = useMemo<ReviewContextState>(
    () => ({
      reviews: state,
      addReview,
      deleteReview,
      getReviewById,
    }),
    [state, addReview, deleteReview, getReviewById],
  );

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
}

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider');
  }
  return context;
};
