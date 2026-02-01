export const reviewStatusLabels = {
  PENDING: '審査中',
  APPROVED: '承認',
  REJECTED: '差し戻し',
} as const;

export const reviewStatusBadgeClass = {
  PENDING: 'bg-sky-400/10 text-sky-200',
  APPROVED: 'bg-emerald-400/10 text-emerald-200',
  REJECTED: 'bg-rose-400/10 text-rose-200',
} as const;
