import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { CheckCircle2, XCircle, Wifi, WifiOff, Settings, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentConfig {
  merchantCode: string;
  merchantCodeSet: boolean;
  secretKeySet: boolean;
  secretKeyLength: number;
  secretKeyValid: boolean;
  accessCodeSet: boolean;
  ivSet: boolean;
  ivLength: number;
  ivValid: boolean;
  paymentUrl: string;
  mode: 'production' | 'sandbox';
  apiBaseUrl: string;
  responseUrl: string;
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

  const allSet = config && config.secretKeySet && config.accessCodeSet && config.ivSet && !!config.paymentUrl;
  const hasWarnings = config && (!config.secretKeyValid || !config.ivValid || !config.apiBaseUrl || config.apiBaseUrl === '(not set)');

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

      {/* 422 diagnostic warning */}
      {hasWarnings && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
            <AlertTriangle size={15} />
            Configuration issues detected — likely cause of 422 errors
          </div>
          <ul className="text-xs text-red-600 space-y-1 pl-5 list-disc">
            {config && !config.secretKeyValid && (
              <li>Secret Key must be exactly 32 characters (AES-256). Currently: {config.secretKeyLength} chars.</li>
            )}
            {config && !config.ivValid && (
              <li>IV must be exactly 16 characters (AES-CBC). Currently: {config.ivLength} chars.</li>
            )}
            {config && (!config.apiBaseUrl || config.apiBaseUrl === '(not set)') && (
              <li>API_BASE_URL is not set — Hesabe won't know where to send payment callbacks.</li>
            )}
          </ul>
        </div>
      )}

      {/* Credential status */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Credential Status</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {isLoading ? (
            [...Array(7)].map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
              </div>
            ))
          ) : config ? (
            <>
              <CredRow label="Merchant Code" value={config.merchantCode} ok={config.merchantCodeSet} />
              <CredRow
                label="Secret Key"
                value={config.secretKeySet ? `Set (${config.secretKeyLength} chars — needs 32)` : 'Not set'}
                ok={config.secretKeySet}
                warn={config.secretKeySet && !config.secretKeyValid}
              />
              <CredRow label="Access Code" value={config.accessCodeSet ? '••••••••••••' : 'Not set'} ok={config.accessCodeSet} />
              <CredRow
                label="IV (Encryption)"
                value={config.ivSet ? `Set (${config.ivLength} chars — needs 16)` : 'Not set'}
                ok={config.ivSet}
                warn={config.ivSet && !config.ivValid}
              />
              <CredRow label="Payment URL" value={config.paymentUrl || 'Not set'} ok={!!config.paymentUrl} />
              <CredRow
                label="API Base URL"
                value={config.apiBaseUrl}
                ok={!!config.apiBaseUrl && config.apiBaseUrl !== '(not set)'}
              />
              <CredRow
                label="Callback URL (sent to Hesabe)"
                value={config.responseUrl}
                ok={config.responseUrl !== '(API_BASE_URL not set)'}
                note="This URL must be whitelisted in your Hesabe merchant portal"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* Test connection */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Test Connection</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Sends a minimal encrypted request to Hesabe to verify credentials.
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

      {/* Fix instructions */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">How to fix 422 errors</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Go to <strong>Plesk → Node.js → Environment Variables</strong> and verify:
        </p>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 space-y-1">
          <p>HESABE_MERCHANT_CODE=<span className="text-blue-600">your_merchant_code</span></p>
          <p>HESABE_SECRET_KEY=<span className="text-blue-600">exactly_32_characters_long_key!</span></p>
          <p>HESABE_ACCESS_CODE=<span className="text-blue-600">your_access_code</span></p>
          <p>HESABE_IV=<span className="text-blue-600">exactly16chars!!</span></p>
          <p>HESABE_PAYMENT_URL=<span className="text-blue-600">https://api.hesabe.com/payment</span></p>
          <p>API_BASE_URL=<span className="text-blue-600">https://your-domain.com</span></p>
        </div>
        <p className="text-xs text-gray-500">
          Also ensure the <strong>Callback URL</strong> above is added to your Hesabe merchant portal under "Response URL".
          Restart the Node.js app after saving any changes.
        </p>
      </div>
    </div>
  );
}

function CredRow({ label, value, ok, warn, note }: {
  label: string;
  value: string;
  ok: boolean;
  warn?: boolean;
  note?: string;
}) {
  return (
    <div className="px-5 py-3 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 font-mono mt-0.5 break-all">{value}</p>
        {note && <p className="text-xs text-amber-600 mt-0.5">{note}</p>}
      </div>
      {warn ? (
        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium whitespace-nowrap">
          <AlertTriangle size={13} /> Wrong length
        </span>
      ) : ok ? (
        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium whitespace-nowrap">
          <CheckCircle2 size={13} /> Set
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium whitespace-nowrap">
          <XCircle size={13} /> Missing
        </span>
      )}
    </div>
  );
}
