import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

export function BetNowCard() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle>Ready to Bet on this Match?</CardTitle>
        <CardDescription>
          Place your bet with our trusted partner, 22Bet, and get the best odds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg" className="w-full">
          <Link href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
            Bet Now on 22Bet
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
