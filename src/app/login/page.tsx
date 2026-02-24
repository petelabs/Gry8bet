'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/auth';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { GoogleIcon } from '@/components/auth/google-icon';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
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
    <div className="container flex items-center justify-center py-24">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your account and pro features.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
