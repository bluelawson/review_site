import AuthForm from '@/components/forms/AuthForm';

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Join SEREN
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">新規登録</h1>
        <p className="mt-3 text-sm text-slate-400">
          投稿者のみがコミュニティにアクセスできます。
        </p>
      </header>
      <AuthForm mode="register" />
    </div>
  );
}
