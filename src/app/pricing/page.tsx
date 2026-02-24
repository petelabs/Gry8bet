'use client';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useProPlan } from '@/hooks/use-pro-plan';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PricingPage() {
  const { isPro, setIsPro } = useProPlan();

  const proFeatures = [
    'Unlimited AI Prediction Insights',
    'High-Confidence Match Alerts',
    'In-depth Performance Analytics',
    'Ad-free Experience',
  ];

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Become a Pro</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Unlock advanced features and get the ultimate edge in your betting strategy.
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Pro Plan</CardTitle>
            <CardDescription>All the best features, one simple price.</CardDescription>
            <div className="mt-4">
              <span className="text-5xl font-bold">$19</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={() => setIsPro(true)} disabled={isPro}>
              {isPro ? 'You are already a Pro!' : 'Upgrade to Pro'}
            </Button>
          </CardFooter>
        </Card>
      </div>

       <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg bg-card">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="pro-mode-toggle" className="font-bold">
              Dev Mode: Pro Status
            </Label>
            <p className="text-sm text-muted-foreground">Toggle to simulate Pro membership.</p>
          </div>
          <Switch
            id="pro-mode-toggle"
            checked={isPro}
            onCheckedChange={setIsPro}
          />
        </div>
      </div>
        <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
                Want to go back? <Link href="/" className="underline hover:text-primary">Return to matches</Link>.
            </p>
        </div>
    </div>
  );
}
