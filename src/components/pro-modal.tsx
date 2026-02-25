import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import Link from 'next/link';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Upgrade to VIP</DialogTitle>
          <DialogDescription className="text-center">
            You've used your one free search. Upgrade to VIP to unlock unlimited searches and other exclusive features!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
          <Button asChild size="lg">
            <Link href="/pricing">Upgrade Now</Link>
          </Button>
          <Button variant="ghost" onClick={onClose}>Maybe Later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
