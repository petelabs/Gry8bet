'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/auth';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { GoogleIcon } from '@/components/auth/google-icon';
import { EmailForm } from '@/components/auth/email-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdditionalUserInfo } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        toast({
            title: '🎉 Welcome Offer Unlocked!',
            description: 'As a new user, you get 50% off any plan for the next 48 hours. Don\'t miss out!',
            duration: 10000,
        });
      }
      // The useEffect will handle the redirect
    } catch (error) {
      console.error("Sign in failed", error);
      // Optionally, show a toast notification on error
    }
  };

  if (isUserLoading || user) {
    return <div className="container flex justify-center items-center py-24">Loading...</div>;
  }

  return (
    <div className="container flex items-center justify-center py-12 sm:py-16">
      <Tabs defaultValue="signin" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Create Account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to access your account and features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmailForm mode="signIn" />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleSignIn}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Get started with your AI-powered predictions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmailForm mode="signUp" />
               <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleSignIn}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign up with Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
