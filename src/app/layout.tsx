import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster"
import { ProPlanProvider } from '@/hooks/use-pro-plan';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: {
    default: 'Gry8bet | AI-Powered Football Predictions & Betting Insights',
    template: '%s | Gry8bet',
  },
  description: 'Get expert football predictions with Gry8bet. Our AI analyzes match data, stats, and expert insights to give you reliable betting tips, confident picks, and detailed analysis for all major leagues. Be the #1 bettor.',
  keywords: ['bet predictions', 'football predictions', 'soccer predictions', 'AI betting', 'sports betting tips', 'Gry8bet', 'expert analysis', 'betting insights'],
  manifest: '/manifest.webmanifest',
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <FirebaseClientProvider>
          <ProPlanProvider>
              <Header />
              <main className="flex-1 flex flex-col">{children}</main>
              <Toaster />
              <InstallPrompt />
          </ProPlanProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
