'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { FieldWrapper, TextField } from '@/components/ui/Input';
import { useAuthState } from '@/hooks/useAuthState';

type Props = {
  mode: 'login' | 'register';
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const { login, register } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        setMessage('ログインに成功しました。');
      } else {
        await register(form.name, form.email, form.password);
        setMessage('登録が完了しました。レビュー投稿をはじめましょう。');
      }
      setTimeout(() => router.push('/'), 600);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel space-y-6 rounded-3xl border border-white/10 px-8 py-10"
    >
      {mode === 'register' && (
        <FieldWrapper label="ニックネーム">
          <TextField
            required
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </FieldWrapper>
      )}
      <FieldWrapper label="メールアドレス">
        <TextField
          type="email"
          required
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </FieldWrapper>
      <FieldWrapper label="パスワード">
        <TextField
          type="password"
          minLength={6}
          required
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </FieldWrapper>
      {message && <p className="text-sm text-slate-300">{message}</p>}
      <div className="flex justify-center">
        <Button type="submit" loading={loading}>
          {mode === 'login' ? 'ログイン' : '登録する'}
        </Button>
      </div>
    </form>
  );
}
