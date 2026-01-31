'use client';
import type { UserProfile } from '@/types';

const STORAGE_KEY = 'seren:users';
const CURRENT_USER_KEY = 'seren:current-user';

const normalizeUserName = (value: string) => value.trim().toLowerCase();
const toEmailFromUserName = (userName: string) =>
  `${normalizeUserName(userName)}@seren.local`;

const defaultUsers: UserProfile[] = [
  {
    id: 'guest',
    userName: 'guest',
    name: 'ゲストレビュアー',
    email: 'guest@seren.jp',
    password: 'seren123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
  {
    id: 'fresh',
    userName: 'member',
    name: '未投稿ユーザー',
    email: 'member@seren.jp',
    password: 'member123',
    plan: 'guest',
    reviewsSubmitted: 0,
  },
  {
    id: 'admin',
    userName: 'admin',
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
    const normalizedUsers = (() => {
      const seen = new Set<string>();
      return users.map((entry) => {
        const baseUsername = entry.userName
          ? normalizeUserName(entry.userName)
          : entry.email
            ? normalizeUserName(entry.email.split('@')[0])
            : normalizeUserName(entry.name);
        const root = baseUsername || `user-${entry.id.slice(0, 6)}`;
        let candidate = root;
        let suffix = 1;
        while (seen.has(candidate)) {
          candidate = `${root}${suffix}`;
          suffix += 1;
        }
        seen.add(candidate);
        return {
          ...entry,
          userName: candidate,
          email: entry.email ?? toEmailFromUserName(candidate),
        };
      });
    })();
    if (!normalizedUsers.some((entry) => entry.email === 'admin@seren.jp')) {
      const adminUser = defaultUsers.find(
        (entry) => entry.email === 'admin@seren.jp',
      );
      if (adminUser) {
        const updated = [...normalizedUsers, adminUser];
        storage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    }
    return normalizedUsers;
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
    const current = JSON.parse(raw) as UserProfile;
    if (!current.userName) {
      const users = getUsers();
      const matched =
        users.find((entry) => entry.id === current.id) ??
        users.find((entry) => entry.email === current.email);
      if (matched) {
        setCurrentUser(matched);
        return matched;
      }
    }
    return current;
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

export const login = async (userNameOrEmail: string, password: string) => {
  ensureAuthStorage();
  const users = getUsers();
  const normalized = normalizeUserName(userNameOrEmail);
  const found = userNameOrEmail.includes('@')
    ? users.find((entry) => entry.email === userNameOrEmail)
    : users.find((entry) => entry.userName === normalized);
  await delay(400);
  if (!found || found.password !== password) {
    throw new Error('ユーザー名もしくはパスワードが正しくありません');
  }
  setCurrentUser(found);
  dispatchAuthChange();
};

export const register = async (
  name: string,
  userName: string,
  email: string,
  password: string,
) => {
  ensureAuthStorage();
  const users = getUsers();
  await delay(400);
  const normalized = normalizeUserName(userName);
  if (!normalized) {
    throw new Error('ユーザー名を入力してください');
  }
  if (/\s/.test(normalized)) {
    throw new Error('ユーザー名に空白は使えません');
  }
  if (users.some((entry) => entry.userName === normalized)) {
    throw new Error('既に登録済みのユーザー名です');
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('メールアドレスを入力してください');
  }
  if (users.some((entry) => entry.email === normalizedEmail)) {
    throw new Error('既に登録済みのメールアドレスです');
  }
  const newUser: UserProfile = {
    id: crypto.randomUUID(),
    userName: normalized,
    name,
    email: normalizedEmail,
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
