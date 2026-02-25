import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster"
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AgeVerificationModal } from '@/components/legal/age-verification-modal';

export const metadata: Metadata = {
  title: {
    default: 'Gry8bet | AI-Powered Football Predictions & Betting Insights',
    template: '%s | Gry8bet',
  },
  description: 'Get expert football predictions with Gry8bet. Our AI analyzes match data, stats, and expert insights to give you reliable betting tips, confident picks, and detailed analysis for all major leagues. Be the #1 bettor with our football betting tips.',
  keywords: ['bet predictions', 'football predictions', 'soccer predictions', 'AI betting', 'sports betting tips', 'Gry8bet', 'expert analysis', 'betting insights', 'football betting', 'soccer betting', 'live scores', 'match analysis'],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="theme-color" content="#2E4E8C" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <FirebaseClientProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Toaster />
            <InstallPrompt />
            <AgeVerificationModal />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
