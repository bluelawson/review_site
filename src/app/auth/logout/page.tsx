import Link from 'next/link';

export default function LogoutComplete() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Signed out
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          ログアウトしました
        </h1>
        <p className="mt-4 text-sm text-slate-400">
          口コミの閲覧を再開するには再度ログインしてください。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full border border-white/30 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:border-white/60 hover:bg-white/10"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
