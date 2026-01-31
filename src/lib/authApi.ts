'use client';
import type { UserProfile } from '@/types';

const STORAGE_KEY = 'seren:users';
const CURRENT_USER_KEY = 'seren:current-user';

const defaultUsers: UserProfile[] = [
  {
    id: 'guest',
    name: 'ゲストレビュアー',
    email: 'guest@seren.jp',
    password: 'seren123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
  {
    id: 'fresh',
    name: '未投稿ユーザー',
    email: 'member@seren.jp',
    password: 'member123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
  {
    id: 'admin',
    name: '管理者',
    email: 'admin@seren.jp',
    password: 'admin123',
    plan: 'admin',
    reviewsSubmitted: 0,
  },
];

const AUTH_EVENT = 'seren-auth-change';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const dispatchAuthChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const ensureAuthStorage = () => {
  const storage = getStorage();
  if (!storage) return;
  if (!storage.getItem(STORAGE_KEY)) {
    storage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

export const getUsers = (): UserProfile[] => {
  const storage = getStorage();
  if (!storage) return defaultUsers;
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    storage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    const users = JSON.parse(raw) as UserProfile[];
    if (!users.some((entry) => entry.email === 'admin@seren.jp')) {
      const adminUser = defaultUsers.find(
        (entry) => entry.email === 'admin@seren.jp',
      );
      if (adminUser) {
        const updated = [...users, adminUser];
        storage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    }
    return users;
  } catch {
    storage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
};

export const getCurrentUser = (): UserProfile | null => {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    storage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

const setUsers = (users: UserProfile[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const setCurrentUser = (user: UserProfile | null) => {
  const storage = getStorage();
  if (!storage) return;
  if (user) {
    storage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(CURRENT_USER_KEY);
  }
};

export const login = async (email: string, password: string) => {
  ensureAuthStorage();
  const users = getUsers();
  const found = users.find((entry) => entry.email === email);
  await delay(400);
  if (!found || found.password !== password) {
    throw new Error('メールアドレスもしくはパスワードが正しくありません');
  }
  setCurrentUser(found);
  dispatchAuthChange();
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  ensureAuthStorage();
  const users = getUsers();
  await delay(400);
  if (users.some((entry) => entry.email === email)) {
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
  const updatedUsers = [...users, newUser];
  setUsers(updatedUsers);
  setCurrentUser(newUser);
  dispatchAuthChange();
};

export const logout = () => {
  setCurrentUser(null);
  dispatchAuthChange();
};

export const registerSubmission = () => {
  const users = getUsers();
  const current = getCurrentUser();
  if (!current) return null;
  const updatedUser = {
    ...current,
    reviewsSubmitted: current.reviewsSubmitted + 1,
  };
  const updatedUsers = users.map((entry) =>
    entry.id === updatedUser.id ? updatedUser : entry,
  );
  setUsers(updatedUsers);
  setCurrentUser(updatedUser);
  dispatchAuthChange();
  return updatedUser;
};

export const authChangeEventName = AUTH_EVENT;
