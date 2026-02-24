import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Toaster } from "@/components/ui/toaster"
import { ProPlanProvider } from '@/hooks/use-pro-plan';

export const metadata: Metadata = {
  title: 'FootyForecast',
  description: 'AI-powered football match predictions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <ProPlanProvider>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Toaster />
        </ProPlanProvider>
      </body>
    </html>
  );
}
