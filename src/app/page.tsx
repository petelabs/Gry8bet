import { matches, leagues } from '@/lib/data';
import { MatchList } from '@/components/matches/match-list';

export default function Home() {
  return (
    <div className="container py-6 sm:py-8">
      <MatchList matches={matches} leagues={leagues} />
    </div>
  );
}
