import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          <div className="flex justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
          <p className="text-gray-500 mb-6">
            Your payment could not be processed. No charges were made. Please try again or contact us for assistance.
          </p>
          {orderId && (
            <p className="text-xs text-gray-400 mb-6">Reference: {orderId}</p>
          )}
          <div className="flex flex-col gap-3">
            <Link to="/training">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft size={14} className="mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Need help?{' '}
            <a
              href="https://wa.me/96522092260"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
