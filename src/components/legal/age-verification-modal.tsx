'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage only on the client side
    const isVerified = localStorage.getItem('age_verified');
    if (isVerified !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem('age_verified', 'true');
    setIsOpen(false);
  };

  const handleExit = () => {
    // Redirect to a neutral site
    window.location.href = 'https://www.google.com';
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">Age Verification</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You must be 18 years or older to enter this site. Please confirm your age.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={handleExit} className="w-full sm:w-auto">Exit</Button>
          <AlertDialogAction onClick={handleEnter} className="w-full sm:w-auto">
            I am 18 or older
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
