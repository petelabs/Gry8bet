'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Match } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { MatchCard } from './match-card';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from '../ui/label';
import { useProPlan } from '@/hooks/use-pro-plan';
import { ProModal } from '@/components/pro-modal';

interface MatchListProps {
  matches: Match[];
  leagues: string[];
  highConfidencePicks: Set<string>;
}

export function MatchList({ matches, leagues, highConfidencePicks }: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  
  // Freemium search logic
  const [searchCount, setSearchCount] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const { isPro } = useProPlan();
  
  useEffect(() => {
    // Load search count from session storage on component mount
    const count = sessionStorage.getItem('gry8bet_search_count') || '0';
    setSearchCount(parseInt(count, 10));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = e.target.value;
      
      // Increment count only when user starts typing a new search
      if (searchTerm === '' && newSearchTerm !== '') {
          const newCount = searchCount + 1;
          if (newCount > 1 && !isPro) {
              setShowProModal(true);
          } else {
              setSearchCount(newCount);
              sessionStorage.setItem('gry8bet_search_count', newCount.toString());
              setSearchTerm(newSearchTerm);
          }
      } else {
          setSearchTerm(newSearchTerm);
      }
  };
  
  const hasExceededFreeSearch = searchCount > 1 && !isPro;


  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const teamSearch =
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());
      const leagueFilter = selectedLeague === 'all' || match.league === selectedLeague;
      return teamSearch && leagueFilter;
    }).sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());
  }, [matches, searchTerm, selectedLeague]);

  const FilterControls = () => (
    <div className="grid gap-4">
        <div>
            <Label className="text-sm font-semibold" htmlFor="league-filter">League</Label>
            <Select onValueChange={setSelectedLeague} defaultValue={selectedLeague}>
                <SelectTrigger id="league-filter" className="mt-1">
                    <SelectValue placeholder="Filter by league" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Leagues</SelectItem>
                    {leagues.map(league => (
                    <SelectItem key={league} value={league}>{league}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
  );

  return (
    <>
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a team (1 free search)..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={hasExceededFreeSearch}
            />
             {hasExceededFreeSearch && <div className="absolute inset-0 bg-background/50 rounded-md" />}
          </div>
          <div className="hidden md:flex gap-4">
              <Select onValueChange={setSelectedLeague} defaultValue="all">
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Leagues</SelectItem>
                      {leagues.map(league => (
                      <SelectItem key={league} value={league}>{league}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
          <div className="md:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Filter Matches
                      </Button>
                  </SheetTrigger>
                  <SheetContent>
                      <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                              Find the matches you're looking for.
                          </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                          <FilterControls />
                      </div>
                  </SheetContent>
              </Sheet>
          </div>
        </div>
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredMatches.map(match => (
              <MatchCard key={match.id} match={match} isHighConfidence={highConfidencePicks.has(match.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
            <h3 className="text-lg font-semibold text-foreground">No matches found.</h3>
            <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </>
  );
}
