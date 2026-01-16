import Link from 'next/link';

export default function AccessPanel() {
  return (
    <section
      id="access"
      className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[2fr_3fr]"
    >
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          アクセスルール
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-white">
          閲覧権限の得方
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          「有料パス購入」または「自分の口コミ投稿」のいずれかで全レビューの閲覧鍵が解錠されます。
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
              Option A
            </p>
            <h3 className="text-xl font-semibold text-white">
              プレミアムパス（準備中）
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              審査済み会員限定で先行案内中。決済後すぐに全文を解錠します。
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.5em] text-emerald-200">
              Option B
            </p>
            <h3 className="text-xl font-semibold text-white">
              自分の体験談を投稿
            </h3>
            <p className="mt-2 text-sm text-emerald-100/90">
              店舗名、担当嬢、料金、感想を具体的に書いてください。スタッフが24時間以内に審査し、合格後に解錠します。
            </p>
            <Link
              href="/review/register"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white"
            >
              投稿フォームへ →
            </Link>
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-3xl border border-white/10 px-6 py-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          投稿ガイドライン
        </p>
        <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300">
          {[
            '店舗／コース／所感を具体的に記載（伏字 OK）。',
            '誹謗中傷のみを目的とした投稿は禁止。',
            '架空体験やコピペを検出した場合は即時凍結。',
            '未成年の利用・閲覧は禁止です。',
          ].map((rule, index) => (
            <li key={rule} className="flex gap-3">
              <span className="text-emerald-300">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
