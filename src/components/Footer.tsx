export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            SEREN
          </p>
          <p className="text-lg font-semibold text-white">
            Soapland Experience Review
          </p>
          <p className="text-xs text-slate-500">
            匿名・暗号化・本人確認済みのレビューだけを掲載しています。
          </p>
        </div>
        <div className="text-xs text-right text-slate-600">
          <p>© 2024 SEREN Collective</p>
          <p>Anonymous. Human Verified.</p>
        </div>
      </div>
    </footer>
  );
}
