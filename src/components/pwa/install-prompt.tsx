'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Define the interface for the event, which is not standard in all browsers
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Check if the app is already installed.
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
          return;
      }
      setInstallEvent(e as BeforeInstallPromptEvent);
      // Check if user has dismissed it before
      const dismissed = localStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
          setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    setInstallEvent(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
      localStorage.setItem('pwa_install_dismissed', 'true');
      setIsVisible(false);
  }

  if (!isVisible || !installEvent) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Card className="max-w-sm shadow-lg">
            <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">Install Gry8bet App</CardTitle>
                        <CardDescription className="text-sm">
                            Get faster access & offline features. It's only 1MB!
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <Button className="w-full" onClick={handleInstallClick}>
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
