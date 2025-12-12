'use client';
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { UserProfile } from '@/types';

type AuthContextState = {
  user: UserProfile | null;
  users: UserProfile[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  registerSubmission: () => void;
};

const STORAGE_KEY = 'seren:users';
const CURRENT_USER_KEY = 'seren:current-user';

const defaultUsers: UserProfile[] = [
  {
    id: 'guest',
    name: 'ゲストレビュアー',
    email: 'guest@seren.jp',
    password: 'seren123',
    plan: 'guest',
    reviewsSubmitted: 1,
  },
  {
    id: 'fresh',
    name: '未投稿ユーザー',
    email: 'member@seren.jp',
    password: 'member123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
];

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(defaultUsers);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUsers = window.localStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
      startTransition(() => {
        setUsers(JSON.parse(storedUsers));
      });
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }

    const storedUser = window.localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      startTransition(() => {
        setUser(JSON.parse(storedUser));
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const findUser = useCallback(
    (email: string) => users.find((entry) => entry.email === email),
    [users],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const found = findUser(email);
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!found || found.password !== password) {
        throw new Error('メールアドレスもしくはパスワードが正しくありません');
      }
      setUser(found);
    },
    [findUser],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const exists = findUser(email);
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (exists) {
        throw new Error('既に登録済みのメールアドレスです');
      }
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        plan: 'guest',
        reviewsSubmitted: 0,
      };
      setUsers((prev) => [...prev, newUser]);
      setUser(newUser);
    },
    [findUser],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const registerSubmission = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, reviewsSubmitted: prev.reviewsSubmitted + 1 };
      setUsers((list) =>
        list.map((entry) => (entry.id === updated.id ? updated : entry)),
      );
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextState>(
    () => ({
      user,
      users,
      login,
      register,
      logout,
      registerSubmission,
    }),
    [user, users, login, register, logout, registerSubmission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
