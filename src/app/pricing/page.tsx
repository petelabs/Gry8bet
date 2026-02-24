'use client';
import { Check, Star, BadgePercent, Trophy, Rocket, Crown, ShieldCheck, WalletCards, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WHATSAPP_NUMBER = '255987066051'; // IMPORTANT: Replace with your number if this is incorrect.

const plans = [
  {
    name: 'Starter',
    price: '$1',
    period: '/ week',
    predictions: '5 AI Predictions',
    features: ['Basic match analysis', 'Email support'],
    color: 'border-gray-300',
    icon: <Trophy className="h-6 w-6 mb-4 text-gray-500" />,
  },
  {
    name: 'Amateur',
    price: '$1.9',
    period: '/ week',
    predictions: '13 AI Predictions',
    features: ['Detailed analysis', 'Betting insights', 'Email support'],
    color: 'border-blue-400',
    icon: <Rocket className="h-6 w-6 mb-4 text-blue-500" />,
  },
  {
    name: 'Pro',
    price: '$3',
    period: '/ week',
    predictions: '20 AI Predictions',
    features: ['All Amateur features', 'High-confidence alerts', 'Priority support'],
    color: 'border-purple-500',
    icon: <Star className="h-6 w-6 mb-4 text-purple-500" />,
  },
  {
    name: 'Expert',
    price: '$5',
    period: '/ month',
    predictions: '40 AI Predictions',
    features: ['All Pro features', 'Ad-free experience', 'Performance review'],
    color: 'border-green-500',
    icon: <BadgePercent className="h-6 w-6 mb-4 text-green-500" />,
  },
  {
    name: 'Master',
    price: '$10',
    period: '/ month',
    predictions: '150+ AI Predictions',
    features: ['All Expert features', 'Deeper performance insights', 'Next month renewal discount'],
    color: 'border-orange-500',
    icon: <KeyRound className="h-6 w-6 mb-4 text-orange-500" />,
  },
  {
    name: 'VIP',
    price: '$20',
    period: '/ month',
    predictions: 'All Master Predictions',
    features: ['90-99% win probability insights', '7-day bonus on renewal', 'All Master features'],
    color: 'border-yellow-500',
    highlight: true,
    icon: <Crown className="h-6 w-6 mb-4 text-yellow-500" />,
  },
  {
    name: 'Legend',
    price: '$300',
    period: 'Lifetime',
    predictions: 'Unlimited Predictions',
    features: ['All features forever', 'Exclusive community access', 'Direct line to analysts'],
    color: 'border-gray-800',
    icon: <ShieldCheck className="h-6 w-6 mb-4 text-gray-800" />,
  },
];


export default function PricingPage() {
  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Pricing Plans</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose a plan that fits your strategy. Get the ultimate edge in your betting journey.
        </p>
      </div>

       <Alert className="max-w-3xl mx-auto mt-8 border-primary/50">
          <BadgePercent className="h-4 w-4" />
          <AlertTitle>New User? Get 50% Off!</AlertTitle>
          <AlertDescription>
            For a limited time, all new users get a 50% discount on any plan for the first month. Pay within 2 days of signing up to claim your offer!
          </AlertDescription>
        </Alert>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn('flex flex-col', plan.color, plan.highlight && 'relative ring-2 ring-yellow-500 shadow-2xl')}>
             {plan.highlight && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                    </div>
                </div>
            )}
            <CardHeader className="text-center items-center pt-10">
              {plan.icon}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <CardDescription>{plan.predictions}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full" variant={plan.highlight ? 'default' : 'outline'}>
                    <Link href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I'd like to subscribe to the ${plan.name} plan.`)}`} target="_blank" rel="noopener noreferrer">
                        Choose {plan.name}
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

        <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight">How to Subscribe</h2>
            <p className="mt-2 text-lg text-muted-foreground">Follow these simple steps to unlock your plan.</p>
        </div>

        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader className="text-center">
                <div className="flex justify-center">
                    <WalletCards className="h-8 w-8 mb-2 text-primary" />
                </div>
                <CardTitle>Payment Instructions</CardTitle>
                <CardDescription>
                    We use a trusted manual payment process to keep things simple for you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <ol className="list-decimal list-inside space-y-4">
                    <li>
                        Click the <strong>"Choose Plan"</strong> button for your desired subscription. This will open a WhatsApp chat with us.
                    </li>
                    <li>
                        Send the pre-filled message to let us know which plan you've chosen.
                    </li>
                    <li>
                        Make your payment to the following Airtel Money account:
                        <div className="font-mono text-base bg-muted p-3 rounded-md text-center my-2 select-all">
                            [Your Airtel Money Number Here]
                        </div>
                    </li>
                    <li>
                        After paying, please send a screenshot of the transaction confirmation back to us in the same WhatsApp chat.
                    </li>
                    <li>
                        Once we verify your payment, we will activate your Pro subscription immediately. Your trust is our priority, and we'll ensure a smooth process.
                    </li>
                </ol>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground mx-auto">
                    If you have any questions, feel free to ask us on WhatsApp. We're here to help!
                </p>
            </CardFooter>
        </Card>

       <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
                Want to go back? <Link href="/" className="underline hover:text-primary">Return to matches</Link>.
            </p>
        </div>
    </div>
  );
}
