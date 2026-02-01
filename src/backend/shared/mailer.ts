import { Resend } from 'resend';

import type { Review } from '@/backend/review/domain/model/review';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom =
  process.env.RESEND_FROM ?? 'contact@yoshiura-office.com';

let client: Resend | null = null;

const getClient = () => {
  if (!resendApiKey) return null;
  if (!client) {
    client = new Resend(resendApiKey);
  }
  return client;
};

const buildEmailContent = (review: Review) => {
  const statusLabel =
    review.status === 'APPROVED' ? '承認' : '差し戻し';
  const showRemandGuidance = review.status === 'REJECTED';
  const subject = `レビューが${statusLabel}されました`;
  const text = [
    `レビューの審査結果が更新されました。`,
    '',
    `結果: ${statusLabel}`,
    `店舗名: ${review.shopName}`,
    `キャスト名: ${review.castName}`,
    `見出し: ${review.headline}`,
    '',
    ...(showRemandGuidance
      ? ['内容の見直しや再投稿をご希望の場合は、審査一覧から修正してください。']
      : []),
    ...(showRemandGuidance && review.remandReason
      ? [`差し戻し理由: ${review.remandReason}`]
      : []),
    '',
    '※本メールは送信専用です。',
  ].join('\n');
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>レビューの審査結果が更新されました。</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
      <p><strong>結果:</strong> ${statusLabel}</p>
      <p><strong>店舗名:</strong> ${review.shopName}</p>
      <p><strong>キャスト名:</strong> ${review.castName}</p>
      <p><strong>見出し:</strong> ${review.headline}</p>
      ${
        showRemandGuidance
          ? '<p style="margin-top:16px;">内容の見直しや再投稿をご希望の場合は、審査一覧から修正してください。</p>'
          : ''
      }
      ${
        showRemandGuidance && review.remandReason
          ? `<p style="margin-top:8px;"><strong>差し戻し理由:</strong> ${review.remandReason}</p>`
          : ''
      }
      <p style="color:#888;font-size:12px;">※本メールは送信専用です。</p>
    </div>
  `;
  return { subject, text, html };
};

export const sendReviewStatusEmail = async (review: Review) => {
  const resend = getClient();
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  const { subject, text, html } = buildEmailContent(review);
  await resend.emails.send({
    from: resendFrom,
    to: review.author.email,
    subject,
    text,
    html,
  });
};
