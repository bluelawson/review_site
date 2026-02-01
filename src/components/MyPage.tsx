'use client';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import { FieldWrapper, TextField } from '@/components/ui/Input';
import PanelMessage from '@/components/ui/PanelMessage';
import { useAuthState } from '@/hooks/useAuthState';

export default function MyPage() {
  const { user, updateProfile, updatePassword, updateReviewStatusEmail } =
    useAuthState();
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileForm({ name: user.name, email: user.email });
    setNotificationEnabled(user.reviewStatusEmailEnabled);
  }, [user]);

  if (!user) {
    return (
      <PanelMessage>マイページを利用するにはログインが必要です。</PanelMessage>
    );
  }

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');
    try {
      await updateProfile(profileForm);
      setProfileMessage('プロフィールを更新しました。');
    } catch (error) {
      if (error instanceof Error) {
        setProfileMessage(error.message);
      } else {
        setProfileMessage('プロフィールの更新に失敗しました。');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    if (!passwordForm.current || !passwordForm.next) {
      setPasswordMessage('すべての項目を入力してください。');
      setPasswordLoading(false);
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordMessage('新しいパスワードが一致しません。');
      setPasswordLoading(false);
      return;
    }
    try {
      await updatePassword(passwordForm.current, passwordForm.next);
      setPasswordMessage('パスワードを更新しました。');
      setPasswordForm({ current: '', next: '', confirm: '' });
    } catch (error) {
      if (error instanceof Error) {
        setPasswordMessage(error.message);
      } else {
        setPasswordMessage('パスワードの更新に失敗しました。');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          My Page
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">マイページ</h1>
        <p className="mt-3 text-sm text-slate-400">
          ユーザー名: <span className="text-white">{user.userName}</span>
        </p>
      </header>

      <section className="glass-panel rounded-3xl border border-white/10 px-8 py-8">
        <h2 className="text-lg font-semibold text-white">プロフィール</h2>
        <form className="mt-6 space-y-5" onSubmit={handleProfileSubmit}>
          <FieldWrapper label="ニックネーム">
            <TextField
              required
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </FieldWrapper>
          <FieldWrapper label="メールアドレス">
            <TextField
              type="email"
              required
              value={profileForm.email}
              onChange={(event) =>
                setProfileForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
            />
          </FieldWrapper>
          {profileMessage && (
            <p className="text-xs text-slate-300">{profileMessage}</p>
          )}
          <Button type="submit" loading={profileLoading}>
            更新する
          </Button>
        </form>
      </section>

      <section className="glass-panel rounded-3xl border border-white/10 px-8 py-8">
        <h2 className="text-lg font-semibold text-white">通知設定</h2>
        <p className="mt-2 text-sm text-slate-400">
          レビューの承認・差し戻しが行われた際にメールでお知らせします。
        </p>
        <label className="mt-6 flex items-center gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={async (event) => {
              const nextValue = event.target.checked;
              setNotificationEnabled(nextValue);
              setNotificationLoading(true);
              setNotificationMessage('');
              try {
                await updateReviewStatusEmail(nextValue);
                setNotificationMessage('通知設定を更新しました。');
              } catch (error) {
                if (error instanceof Error) {
                  setNotificationMessage(error.message);
                } else {
                  setNotificationMessage('通知設定の更新に失敗しました。');
                }
              } finally {
                setNotificationLoading(false);
              }
            }}
            className="size-4 accent-emerald-400"
            disabled={notificationLoading}
          />
          審査結果のメール通知を受け取る
        </label>
        {notificationMessage && (
          <p className="mt-4 text-xs text-slate-400">{notificationMessage}</p>
        )}
      </section>

      <section className="glass-panel rounded-3xl border border-white/10 px-8 py-8">
        <h2 className="text-lg font-semibold text-white">パスワード変更</h2>
        <form className="mt-6 space-y-5" onSubmit={handlePasswordSubmit}>
          <FieldWrapper label="現在のパスワード">
            <TextField
              type="password"
              required
              value={passwordForm.current}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  current: event.target.value,
                }))
              }
            />
          </FieldWrapper>
          <FieldWrapper label="新しいパスワード">
            <TextField
              type="password"
              minLength={6}
              required
              value={passwordForm.next}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  next: event.target.value,
                }))
              }
            />
          </FieldWrapper>
          <FieldWrapper label="新しいパスワード（確認）">
            <TextField
              type="password"
              minLength={6}
              required
              value={passwordForm.confirm}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirm: event.target.value,
                }))
              }
            />
          </FieldWrapper>
          {passwordMessage && (
            <p className="text-xs text-slate-300">{passwordMessage}</p>
          )}
          <Button type="submit" loading={passwordLoading}>
            変更する
          </Button>
        </form>
      </section>
    </div>
  );
}
