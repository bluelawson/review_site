import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

import Providers from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SEREN | Soapland Review Exchange',
  description:
    'SERENはソープ体験者のためのクローズドレビューコミュニティです。料金を支払うか自分のレビューを投稿することで、他の口コミが閲覧可能になります。',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className="antialiased bg-[#050505] text-slate-100">
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,59,68,0.45),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(15,23,42,0.6),transparent_40%)]" />
        </div>
        <Providers>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 px-4 pb-16 pt-8 md:px-8">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
