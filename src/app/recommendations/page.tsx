'use client';

import { bettingSites, continents } from '@/lib/betting-data';
import { RecommendationCard } from '@/components/recommendations/recommendation-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Continent } from '@/lib/types';

export default function RecommendationsPage() {

  return (
    <div className="container py-6 sm:py-8">
        <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Betting Site Recommendations</h1>
            <p className="text-muted-foreground md:text-xl">
                Our top picks for reliable and popular betting sites around the world.
            </p>
        </div>

      <Tabs defaultValue="all" className="mt-8">
        <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                {continents.map(continent => (
                    <TabsTrigger key={continent} value={continent}>{continent}</TabsTrigger>
                ))}
            </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bettingSites.map(site => (
                    <RecommendationCard key={site.id} site={site} />
                ))}
            </div>
        </TabsContent>

        {continents.map(continent => (
             <TabsContent key={continent} value={continent} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bettingSites.filter(site => site.continents.includes(continent as Continent)).map(site => (
                        <RecommendationCard key={site.id} site={site} />
                    ))}
                </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
