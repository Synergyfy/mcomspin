'use client';

import React, { useState, type FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, Loader2, CreditCard, Wallet } from 'lucide-react';
import { useInitiatePurchase, useConfirmStripe } from '@/services/business';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export interface PendingPurchase {
  planId: string;
  billingCycle: 'month' | 'year';
}

export const PENDING_KEY = 'mcomspin_pending_purchase';

export function getPendingPurchase(): PendingPurchase | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingPurchase) : null;
  } catch {
    return null;
  }
}

export function setPendingPurchase(p: PendingPurchase) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(p));
}

export function clearPendingPurchase() {
  localStorage.removeItem(PENDING_KEY);
}

function PaymentForm({
  planName,
  amount,
  mode,
  onSettled,
}: {
  planName: string;
  amount: number;
  mode: 'payment' | 'setup';
  onSettled: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const confirm = useConfirmStripe();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const pending = getPendingPurchase();
    if (!pending) {
      setError('Your pending purchase was not found. Please start the checkout again.');
      setProcessing(false);
      return;
    }

    if (mode === 'setup') {
      const { error: submitError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });
      if (submitError) {
        setError(submitError.message || 'Payment setup failed. Please try again.');
        setProcessing(false);
        return;
      }
      if (!setupIntent?.id) {
        setError('Payment is being finalized. Check your email for confirmation.');
        setProcessing(false);
        return;
      }
      confirm.mutate(
        { planId: pending.planId, billingCycle: pending.billingCycle, setupIntentId: setupIntent.id },
        {
          onSuccess: () => onSettled(),
          onError: (err: unknown) => {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg || 'Payment succeeded but plan activation failed. Contact support.');
            setProcessing(false);
          },
        },
      );
      return;
    }

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/billing`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (!paymentIntent?.id) {
      setError('Payment is being finalized. Check your email for confirmation.');
      setProcessing(false);
      return;
    }
    confirm.mutate(
      { planId: pending.planId, billingCycle: pending.billingCycle, paymentIntentId: paymentIntent.id },
      {
        onSuccess: () => onSettled(),
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setError(msg || 'Payment succeeded but plan activation failed. Contact support.');
          setProcessing(false);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl bg-stone-50 border border-stone-100 p-4 text-[13px] text-stone-600">
        {planName} — £{amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
      </div>

      <PaymentElement />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[12px] text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3.5 rounded-2xl bg-[#1a1a1a] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#f97316] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing && <Loader2 className="w-4 h-4 animate-spin" />}
        {processing ? 'Processing payment…' : 'Pay now'}
      </button>
    </form>
  );
}

interface CheckoutModalProps {
  plan: { id: string; name: string; monthlyPrice?: number; annualPrice?: number; isFree?: boolean };
  billingCycle: 'month' | 'year';
  onClose: () => void;
  onSettled: () => void;
}

export default function CheckoutModal({ plan, billingCycle, onClose, onSettled }: CheckoutModalProps) {
  const initiate = useInitiatePurchase();
  const [provider, setProvider] = useState<'stripe' | 'paypal'>('stripe');
  const [clientSecret, setClientSecret] = useState('');
  const [intentType, setIntentType] = useState<'payment' | 'setup'>('payment');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const amount = plan.isFree
    ? 0
    : billingCycle === 'year'
      ? (plan.annualPrice ?? Number(plan.monthlyPrice ?? 0) * 12)
      : Number(plan.monthlyPrice ?? 0);

  const startStripe = async () => {
    setError('');
    setSessionExpired(false);
    setProcessing(true);
    try {
      setPendingPurchase({ planId: plan.id, billingCycle });
      const res = await initiate.mutateAsync({ planId: plan.id, billingCycle, provider: 'stripe' });
      if (res?.clientSecret) {
        setIntentType(res.type ?? 'payment');
        setClientSecret(res.clientSecret);
      } else {
        setError('Stripe did not return a client secret.');
        clearPendingPurchase();
      }
    } catch (err: unknown) {
      clearPendingPurchase();
      if ((err as { response?: { status?: number } })?.response?.status === 401) setSessionExpired(true);
      else {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setError(msg || 'Failed to start payment. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const startPaypal = async () => {
    setError('');
    setSessionExpired(false);
    setProcessing(true);
    try {
      setPendingPurchase({ planId: plan.id, billingCycle });
      const res = await initiate.mutateAsync({ planId: plan.id, billingCycle, provider: 'paypal' });
      if (res?.approvalUrl) {
        window.location.href = res.approvalUrl;
      } else {
        setError('PayPal did not return an approval URL.');
        clearPendingPurchase();
      }
    } catch (err: unknown) {
      clearPendingPurchase();
      if ((err as { response?: { status?: number } })?.response?.status === 401) setSessionExpired(true);
      else {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setError(msg || 'Failed to start payment. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const ssoLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api/v1';
    window.location.href = `${apiUrl}/auth/sso/start?next=/dashboard/billing`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-[#eee] shadow-2xl p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest rounded-full">
          Secure Checkout
        </span>
        <h3 className="text-xl font-bold text-[#1a1a1a] mt-3">{plan.name}</h3>
        <p className="text-[13px] text-[#888] mt-1">
          Payments are processed securely by MCOM Solutions. Your plan activates the moment payment settles.
        </p>

        {error && (
          <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-100 text-[12px] text-red-600">{error}</div>
        )}

        {sessionExpired ? (
          <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
            <h4 className="font-bold text-[#1a1a1a]">Your MCOM session has expired</h4>
            <p className="text-[12px] text-stone-600 mt-2">
              Sign in with MCOM again to re-authorize your account, then continue with your plan purchase.
            </p>
            <button
              type="button"
              onClick={ssoLogin}
              className="mt-5 w-full py-3 rounded-2xl bg-[#f97316] text-white text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
            >
              Sign in with MCOM again
            </button>
          </div>
        ) : clientSecret ? (
          <div className="mt-6">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: { colorPrimary: '#f97316', borderRadius: '12px' },
                },
              }}
            >
              <PaymentForm
                planName={plan.name}
                amount={amount}
                mode={intentType}
                onSettled={onSettled}
              />
            </Elements>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('stripe')}
                className={`rounded-2xl border p-4 text-[12px] font-bold transition-all flex items-center justify-center gap-2 ${
                  provider === 'stripe'
                    ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                    : 'border-[#eee] bg-white text-stone-600 hover:border-[#f97316]/40'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Card
              </button>
              <button
                type="button"
                onClick={() => setProvider('paypal')}
                className={`rounded-2xl border p-4 text-[12px] font-bold transition-all flex items-center justify-center gap-2 ${
                  provider === 'paypal'
                    ? 'border-[#f97316] bg-[#f97316]/5 text-[#f97316]'
                    : 'border-[#eee] bg-white text-stone-600 hover:border-[#f97316]/40'
                }`}
              >
                <Wallet className="w-4 h-4" /> PayPal
              </button>
            </div>

            <button
              type="button"
              onClick={provider === 'stripe' ? startStripe : startPaypal}
              disabled={processing}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#1a1a1a] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#f97316] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {processing ? 'Starting payment…' : `Continue to payment — £${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`}
            </button>
            <p className="mt-3 text-center text-[10px] text-[#999]">
              Secured by MCOM Solutions via Stripe &amp; PayPal
            </p>
          </>
        )}
      </div>
    </div>
  );
}