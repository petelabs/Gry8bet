'use client';

import { useState, useMemo } from 'react';
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

interface MatchListProps {
  matches: Match[];
  leagues: string[];
}

export function MatchList({ matches, leagues }: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const teamSearch =
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());
      const leagueFilter = selectedLeague === 'all' || match.league === selectedLeague;
      return teamSearch && leagueFilter;
    }).sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());
  }, [matches, searchTerm, selectedLeague]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a team..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:block">
            <Select onValueChange={setSelectedLeague} defaultValue="all">
                <SelectTrigger className="w-[180px]">
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
        <div className="sm:hidden">
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                            Filter the matches to find what you're looking for.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <h3 className="font-semibold text-sm">League</h3>
                        <Select onValueChange={setSelectedLeague} defaultValue="all">
                            <SelectTrigger>
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
                </SheetContent>
            </Sheet>
        </div>
      </div>
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
          <h3 className="text-lg font-semibold text-foreground">No matches found.</h3>
          <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
