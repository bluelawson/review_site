'use client';
import { useState } from 'react';

import Button from '@/components/ui/Button';

type Props = {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
};

export default function RemandReasonModal({
  open,
  submitting,
  onCancel,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-2xl">
        <h2 className="text-lg font-semibold">差し戻し理由</h2>
        <p className="mt-2 text-xs text-slate-400">
          差し戻し理由を入力してください。内容は投稿者に通知されます。
        </p>
        <textarea
          className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-rose-300/60 focus:outline-none"
          rows={6}
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            if (error) setError('');
          }}
          placeholder="例) 具体的な体験内容が不足しています。日時やサービス内容を追記してください。"
        />
        {error && <p className="mt-2 text-xs text-rose-200">{error}</p>}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              setReason('');
              setError('');
              onCancel();
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="outline"
            type="button"
            className="border-rose-300/50 text-rose-200 hover:border-rose-200/80"
            onClick={async () => {
              const trimmed = reason.trim();
              if (!trimmed) {
                setError('差し戻し理由を入力してください。');
                return;
              }
              await onSubmit(trimmed);
              setReason('');
              setError('');
            }}
            disabled={submitting}
          >
            差し戻す
          </Button>
        </div>
      </div>
    </div>
  );
}
