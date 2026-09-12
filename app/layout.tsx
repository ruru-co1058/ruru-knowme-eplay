import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '認識你真好｜快樂遊戲屋',
  description: '配對、拼圖和連連看，三個簡單又有趣的動腦遊戲都在這裡。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
