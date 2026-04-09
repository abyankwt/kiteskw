import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, MessageCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollCheckout } from '@/hooks/useCourses';
import toast from 'react-hot-toast';

interface EnrollButtonProps {
  courseId: string;
  courseName?: string;
  whatsappUrl?: string;
  className?: string;
}

/**
 * EnrollButton handles the full enrollment flow:
 * - If user is not logged in: shows login prompt dialog
 * - If user is logged in: calls checkout API → redirects to Hesabe payment URL
 * - If course is free: shows success toast immediately
 * Falls back to WhatsApp URL if no payment backend is configured
 */
export function EnrollButton({ courseId, courseName, whatsappUrl, className }: EnrollButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const checkout = useEnrollCheckout();

  const handleEnroll = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const result = await checkout.mutateAsync(courseId);

      if (result.free) {
        toast.success(`You're enrolled in ${courseName || 'the course'}!`);
        return;
      }

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
    } catch (err: any) {
      const message = err?.response?.data?.error;
      if (message === 'Already enrolled in this course') {
        toast.success('You are already enrolled in this course.');
      } else {
        toast.error(message || 'Enrollment failed. Please try again.');
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleEnroll}
        disabled={checkout.isPending}
        className={className}
      >
        {checkout.isPending ? (
          <><Loader2 size={14} className="mr-2 animate-spin" /> Processing...</>
        ) : (
          <><MessageCircle size={14} className="mr-2" /> Enroll Now</>
        )}
      </Button>

      {/* Login prompt dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in to enroll</DialogTitle>
            <DialogDescription>
              You need an account to enroll in{courseName ? ` "${courseName}"` : ' this course'}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Button
              onClick={() => { setShowLoginPrompt(false); navigate('/admin/login'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LogIn size={14} className="mr-2" /> Sign in
            </Button>
            {whatsappUrl && (
              <Button variant="outline" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={14} className="mr-2 text-[#25D366]" />
                  Enquire on WhatsApp
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
