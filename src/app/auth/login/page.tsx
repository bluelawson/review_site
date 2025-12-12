import AuthForm from '@/components/forms/AuthForm';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Access SEREN
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">ログイン</h1>
        <p className="mt-3 text-sm text-slate-400">
          口コミ投稿または有料パスの購入者のみ閲覧できます。
        </p>
      </header>
      <AuthForm mode="login" />
      <div className="text-center text-xs text-slate-500">
        ゲスト: guest@seren.jp / seren123
      </div>
    </div>
  );
}
