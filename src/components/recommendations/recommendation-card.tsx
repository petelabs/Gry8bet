import type { BettingSite } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface RecommendationCardProps {
  site: BettingSite;
}

export function RecommendationCard({ site }: RecommendationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Image
            src={site.logoUrl}
            alt={`${site.name} logo`}
            width={48}
            height={48}
            data-ai-hint={site.logoImageHint}
            className="rounded-lg aspect-square object-contain border"
          />
        <div className="flex-1">
          <CardTitle>{site.name}</CardTitle>
          <CardDescription className="line-clamp-2">{site.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={site.url} target="_blank" rel="noopener noreferrer">
            Bet Now
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
