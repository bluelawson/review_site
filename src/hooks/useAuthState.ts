'use client';
import { useCallback, useEffect, useState } from 'react';

import {
  authChangeEventName,
  ensureAuthStorage,
  getCurrentUser,
  getUsers,
  login,
  logout,
  register,
  registerSubmission,
  updatePassword,
  updateProfile,
  updateReviewStatusEmail,
} from '@/lib/authApi';
import type { UserProfile } from '@/types';

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const refresh = useCallback(() => {
    ensureAuthStorage();
    setUsers(getUsers());
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    refresh();
    const handleChange = () => refresh();
    window.addEventListener(authChangeEventName, handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener(authChangeEventName, handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, [refresh]);

  const handleLogin = useCallback(
    async (userName: string, password: string) => {
      await login(userName, password);
      refresh();
    },
    [refresh],
  );

  const handleRegister = useCallback(
    async (name: string, userName: string, email: string, password: string) => {
      await register(name, userName, email, password);
      refresh();
    },
    [refresh],
  );

  const handleLogout = useCallback(() => {
    logout();
    refresh();
  }, [refresh]);

  const handleRegisterSubmission = useCallback(() => {
    registerSubmission();
    refresh();
  }, [refresh]);

  const handleUpdateProfile = useCallback(
    async (input: { name: string; email: string }) => {
      await updateProfile(input);
      refresh();
    },
    [refresh],
  );

  const handleUpdatePassword = useCallback(
    async (currentPassword: string, nextPassword: string) => {
      await updatePassword(currentPassword, nextPassword);
      refresh();
    },
    [refresh],
  );

  const handleUpdateReviewStatusEmail = useCallback(
    async (enabled: boolean) => {
      await updateReviewStatusEmail(enabled);
      refresh();
    },
    [refresh],
  );

  return {
    user,
    users,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    registerSubmission: handleRegisterSubmission,
    updateProfile: handleUpdateProfile,
    updatePassword: handleUpdatePassword,
    updateReviewStatusEmail: handleUpdateReviewStatusEmail,
  };
};
