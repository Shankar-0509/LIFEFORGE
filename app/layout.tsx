import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'LIFEFORGE — Forge Your Life, Level by Level',
  description:
    'Transform real-world actions into RPG progression. Complete quests, earn XP, grow your attributes, and watch your world evolve.',
  openGraph: {
    title: 'LIFEFORGE — Forge Your Life, Level by Level',
    description: 'Your actions shape your world. Transform real life into RPG progression.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIFEFORGE',
    description: 'Forge your life. Level by level.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} dark`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
