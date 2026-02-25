'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShareCard() {
  const { toast } = useToast();
  const [shareUrl, setShareUrl] = useState('https://gry8.bet');
  const shareText = "Check out Gry8bet for AI-powered football predictions and betting insights! #Gry8bet #AI #Football";

  useEffect(() => {
    // This ensures the window object is accessed only on the client-side, after initial render.
    setShareUrl(window.location.origin);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "You can now share it with your friends.",
      });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: "destructive",
            title: "Failed to copy",
            description: "Could not copy the link to your clipboard.",
        });
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Share the App, Win Rewards!</CardTitle>
        <CardDescription>
          Spread the word about Gry8bet on social media for a chance to get free Pro access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link">
          <Copy className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
