import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMyEnrollments } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useAuth();
  const { refetch } = useMyEnrollments();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Confirmed</h1>
          <p className="text-gray-500 mb-6">
            {user
              ? `Welcome, ${user.fullName}. Your enrollment has been confirmed and the course has been added to your account.`
              : 'Your payment was successful and your enrollment has been confirmed.'}
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6">Reference: {orderId}</p>
          )}
          <div className="flex flex-col gap-3">
            <Link to="/training">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <BookOpen size={16} className="mr-2" />
                Browse More Courses
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
