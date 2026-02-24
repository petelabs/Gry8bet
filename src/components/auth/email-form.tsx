'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type EmailFormValues = z.infer<typeof formSchema>;

interface EmailFormProps {
  mode: 'signIn' | 'signUp';
}

export function EmailForm({ mode }: EmailFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      if (mode === 'signUp') {
        await signUpWithEmail(data.email, data.password);
        toast({
          title: 'Account Created!',
          description: 'Welcome! You are now signed in.',
        });
      } else {
        await signInWithEmail(data.email, data.password);
        toast({
          title: 'Signed In Successfully',
          description: 'Welcome back!',
        });
      }
      // Redirect is handled by the parent page's useEffect
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already in use. Please sign in or use a different email.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please use a stronger password.';
            break;
          default:
            errorMessage = error.message;
        }
      }
      toast({
        variant: 'destructive',
        title: `Sign ${mode === 'signIn' ? 'In' : 'Up'} Failed`,
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'signIn' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
