'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Copy, Instagram, Youtube, MessageSquare, Ghost } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareCardProps {
  path?: string;
  text?: string;
}

export function ShareCard({ path = '', text }: ShareCardProps) {
  const { toast } = useToast();
  const [shareUrl, setShareUrl] = useState('');
  const shareText = text || "Check out Gry8bet for AI-powered football predictions and betting insights! #Gry8bet #AI #Football";

  useEffect(() => {
    // This ensures the window object is accessed only on the client-side,
    // and constructs the full URL from the origin and the provided path.
    setShareUrl(`${window.location.origin}${path}`);
  }, [path]);

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

  const showLimitationToast = (platform: string) => {
    toast({
        title: `Sharing to ${platform}`,
        description: `Web browsers have limitations for direct sharing to ${platform}. We've opened their site for you!`,
    });
  }


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Share the App, Win Rewards!</CardTitle>
        <CardDescription>
          Spread the word about Gry8bet on social media for a chance to get free Pro access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/></svg>
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <MessageSquare className="h-5 w-5" />
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
        <Button variant="outline" size="icon" asChild>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Instagram"
            onClick={() => showLimitationToast('Instagram')}
          >
            <Instagram className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on YouTube"
            onClick={() => showLimitationToast('YouTube')}
          >
            <Youtube className="h-5 w-5" />
          </a>
        </Button>
        <Button variant="outline" size="icon" asChild>
           <a
            href="https://www.snapchat.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Snapchat"
            onClick={() => showLimitationToast('Snapchat')}
          >
            <Ghost className="h-5 w-5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
