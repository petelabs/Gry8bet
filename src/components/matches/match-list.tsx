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
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface MatchListProps {
  matches: Match[];
  leagues: string[];
}

export function MatchList({ matches, leagues }: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [highConfidenceOnly, setHighConfidenceOnly] = useState(false);

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const teamSearch =
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());
      const leagueFilter = selectedLeague === 'all' || match.league === selectedLeague;
      const confidenceFilter = !highConfidenceOnly || match.prediction.confidence === 'High';
      return teamSearch && leagueFilter && confidenceFilter;
    }).sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());
  }, [matches, searchTerm, selectedLeague, highConfidenceOnly]);

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
        <div className="flex items-center space-x-2">
            <Checkbox id="high-confidence-filter" checked={highConfidenceOnly} onCheckedChange={(checked) => setHighConfidenceOnly(!!checked)} />
            <Label htmlFor="high-confidence-filter" className="text-sm font-normal">
                High-Confidence Picks Only
            </Label>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
            Note: 100% win is not guaranteed.
        </p>
    </div>
  );

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
            <div className="flex items-center space-x-2">
                <Checkbox id="high-confidence-desktop" checked={highConfidenceOnly} onCheckedChange={(checked) => setHighConfidenceOnly(!!checked)} />
                <Label htmlFor="high-confidence-desktop" className="text-sm font-normal whitespace-nowrap">
                    High-Confidence Only
                </Label>
            </div>
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
