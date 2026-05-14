import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CheckCircle2, XCircle, Wifi, WifiOff, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentConfig {
  merchantCode: string;
  secretKeySet: boolean;
  accessCodeSet: boolean;
  ivSet: boolean;
  paymentUrl: string;
  mode: 'production' | 'sandbox';
}

export default function AdminPaymentSettings() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ['admin', 'payment-settings'],
    queryFn: () => apiClient.get('/admin/payment-settings').then(r => r.data as PaymentConfig),
  });

  const testMutation = useMutation({
    mutationFn: () => apiClient.post('/admin/payment-settings/test').then(r => r.data),
    onSuccess: (data) => setTestResult(data),
    onError: (err: any) => setTestResult({ success: false, message: err?.response?.data?.error ?? 'Connection failed' }),
  });

  const credentials = config ? [
    { label: 'Merchant Code', value: config.merchantCode, set: true },
    { label: 'Secret Key', value: config.secretKeySet ? '••••••••••••' : 'Not set', set: config.secretKeySet },
    { label: 'Access Code', value: config.accessCodeSet ? '••••••••••••' : 'Not set', set: config.accessCodeSet },
    { label: 'IV (Encryption)', value: config.ivSet ? '••••••••••••' : 'Not set', set: config.ivSet },
    { label: 'Payment URL', value: config.paymentUrl || 'Not set', set: !!config.paymentUrl },
  ] : [];

  const allSet = config && config.secretKeySet && config.accessCodeSet && config.ivSet && !!config.paymentUrl;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Payment Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Hesabe payment gateway configuration status</p>
      </div>

      {/* Mode indicator */}
      {config && (
        <div className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium',
          config.mode === 'production'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        )}>
          <Settings size={15} />
          Mode: <span className="capitalize font-bold">{config.mode}</span>
          {config.mode === 'production' && <span className="ml-auto text-xs text-green-600">Live payments enabled</span>}
          {config.mode === 'sandbox' && <span className="ml-auto text-xs text-amber-600">Test mode — no real charges</span>}
        </div>
      )}

      {/* Credential status cards */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Credential Status</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
              </div>
            ))
          ) : (
            credentials.map(c => (
              <div key={c.label} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.label}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{c.value}</p>
                </div>
                {c.set ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                    <CheckCircle2 size={14} /> Set
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                    <XCircle size={14} /> Missing
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Test connection */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Test Connection</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Sends a minimal request to Hesabe to verify your credentials are correct.
          </p>
        </div>
        <button
          onClick={() => { setTestResult(null); testMutation.mutate(); }}
          disabled={testMutation.isPending || !allSet}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {testMutation.isPending ? <Wifi size={14} className="animate-pulse" /> : <Wifi size={14} />}
          {testMutation.isPending ? 'Testing...' : 'Test Connection'}
        </button>

        {!allSet && !isLoading && (
          <p className="text-xs text-amber-600">All credentials must be set before testing.</p>
        )}

        {testResult && (
          <div className={cn(
            'flex items-start gap-2 px-4 py-3 rounded-lg text-sm',
            testResult.success
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          )}>
            {testResult.success ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <WifiOff size={16} className="mt-0.5 shrink-0" />}
            {testResult.message}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Updating Credentials</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          To update payment credentials, go to <strong>Plesk → Node.js → Environment Variables</strong> and set:
          <code className="block mt-2 bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs text-gray-700 space-y-1">
            <span className="block">HESABE_MERCHANT_CODE=your_code</span>
            <span className="block">HESABE_SECRET_KEY=your_secret</span>
            <span className="block">HESABE_ACCESS_CODE=your_access_code</span>
            <span className="block">HESABE_IV=your_iv</span>
            <span className="block">HESABE_PAYMENT_URL=https://api.hesabe.com/payment</span>
          </code>
          Restart the Node.js app after saving changes.
        </p>
      </div>
    </div>
  );
}
