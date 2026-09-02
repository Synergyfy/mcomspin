'use client';

import React, { useEffect, useState } from 'react';
import {
  Crown,
  Check,
  Shield,
  Gem,
  Loader2,
  CreditCard,
  CircleDollarSign,
} from 'lucide-react';
import { useBusinessBilling, useSubscribePlan, useConfirmStripe, useCapturePaypal } from '@/services/business';
import CheckoutModal, { getPendingPurchase, clearPendingPurchase } from '@/components/CheckoutModal';

interface PlanConfig {
  quotas: Record<string, number>;
  featureFlags: Record<string, boolean>;
}

interface PlanRecord {
  id: string;
  name: string;
  description?: string | null;
  isFree?: boolean;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  annualPrice?: number;
  currency?: string;
  interval?: string;
  isDefault?: boolean;
  configuration?: PlanConfig;
}

interface SubscriptionRecord {
  id: string;
  planId?: string | null;
  status?: string;
  currentPeriodEnd?: string;
  planType?: string;
  plan?: PlanRecord | null;
}

interface InvoiceRecord {
  id: string;
  description?: string;
  invoiceNumber?: string;
  status?: string;
  createdAt?: string;
  totalAmount?: number;
  amount?: number;
}

interface PaymentMethodRecord {
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

interface BillingData {
  subscription?: SubscriptionRecord | null;
  invoices?: InvoiceRecord[];
  plans?: PlanRecord[];
  paymentMethod?: PaymentMethodRecord | null;
}

export default function BillingPage() {
  const { data: billingData, isLoading, isError } = useBusinessBilling();
  const subscribe = useSubscribePlan();
  const confirmStripe = useConfirmStripe();
  const capturePaypal = useCapturePaypal();
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanRecord | null>(null);

  const subscription = (billingData as BillingData)?.subscription;
  const invoices: InvoiceRecord[] = (billingData as BillingData)?.invoices ?? [];
  const plans: PlanRecord[] = (billingData as BillingData)?.plans ?? [];
  const paymentMethod = (billingData as BillingData)?.paymentMethod;

  const currentPlan = subscription?.plan as PlanRecord | null | undefined;
  const currentPlanId = currentPlan?.id ?? subscription?.planId ?? null;

  /* Handle the return leg of an off-page payment (PayPal redirect, or a Stripe
     redirect such as 3DS) — settle the order and activate the plan. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaypal = params.get('paypal_success') === '1';
    const token = params.get('token');
    const paymentIntent = params.get('payment_intent');
    const pending = getPendingPurchase();

    if (!pending) return;
    if (!isPaypal && !token && !paymentIntent) return;

    if (isPaypal && token) {
      capturePaypal.mutate(
        { orderId: token, planId: pending.planId, billingCycle: pending.billingCycle },
        {
          onSuccess: () => {
            clearPendingPurchase();
            setMessage('Subscription activated successfully. Welcome aboard!');
            window.history.replaceState({}, '', '/dashboard/billing');
          },
          onError: (err: unknown) => {
            clearPendingPurchase();
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setMessage(msg || 'Payment was not confirmed. Please try again.');
            window.history.replaceState({}, '', '/dashboard/billing');
          },
        },
      );
    } else if (paymentIntent) {
      confirmStripe.mutate(
        { planId: pending.planId, billingCycle: pending.billingCycle, paymentIntentId: paymentIntent },
        {
          onSuccess: () => {
            clearPendingPurchase();
            setMessage('Subscription activated successfully. Welcome aboard!');
            window.history.replaceState({}, '', '/dashboard/billing');
          },
          onError: (err: unknown) => {
            clearPendingPurchase();
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setMessage(msg || 'Payment was not confirmed. Please try again.');
            window.history.replaceState({}, '', '/dashboard/billing');
          },
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paymentPending = capturePaypal.isPending || confirmStripe.isPending;

  const handleSubscribe = (plan: PlanRecord) => {
    setMessage(null);
    if (plan.isFree) {
      setSubscribingId(plan.id);
      subscribe.mutate(
        { planId: plan.id, billingCycle },
        {
          onSuccess: () => {
            setSubscribingId(null);
            setMessage('Subscription updated successfully.');
          },
          onError: (err: unknown) => {
            setSubscribingId(null);
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setMessage(msg || 'Failed to subscribe. Please try again.');
          },
        },
      );
      return;
    }
    setCheckoutPlan(plan);
  };

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center">
          <p className="font-bold text-[15px]">Failed to load billing data</p>
          <p className="text-[13px] mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const renewal = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a1a]">Billing &amp; Subscription</h2>
        <p className="text-[#888] mt-1">View your current plan, compare options, and subscribe.</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold">
          {message}
        </div>
      )}

      {/* ─── Current Plan ─── */}
      <section className="bg-white rounded-[40px] border border-[#eee] p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#f97316]/5 rounded-bl-[100px]" />
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 bg-[#f0f0f0] rounded" />
            <div className="h-8 w-48 bg-[#f0f0f0] rounded" />
            <div className="h-4 w-full bg-[#f0f0f0] rounded" />
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div>
                <span className="px-3 py-1 bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Current Plan
                </span>
                <h3 className="text-3xl font-black text-[#1a1a1a] mt-2">
                  {currentPlan?.name ?? subscription?.planType ?? 'No active plan'}
                </h3>
                <p className="text-[13px] text-[#888] mt-1">
                  {currentPlan
                    ? currentPlan.isFree
                      ? 'Free plan'
                      : `£${Number(currentPlan.monthlyPrice).toFixed(2)}/mo`
                    : 'You are not subscribed to a plan yet.'}
                </p>
              </div>
              {currentPlan?.isFree && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full w-fit">
                  Free
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-[#f5f5f3] pt-6">
              <div>
                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Status</p>
                <p className="text-[15px] font-bold text-[#1a1a1a] mt-1 capitalize">{subscription?.status ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider">Renewal Date</p>
                <p className="text-[15px] font-bold text-[#1a1a1a] mt-1">{subscription ? renewal : '—'}</p>
              </div>
            </div>

            {currentPlan?.configuration && (
              <div className="mt-6 pt-6 border-t border-[#f5f5f3]">
                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-wider mb-3">Included</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(currentPlan.configuration.quotas ?? {}).map(([k, v]) => (
                    <span key={k} className="px-2 py-1 bg-stone-50 text-stone-600 rounded-lg text-[10px] font-bold">
                      {k.replace(/^max/, '')}: {v === -1 ? '∞' : v}
                    </span>
                  ))}
                  {Object.entries(currentPlan.configuration.featureFlags ?? {})
                    .filter(([, v]) => v)
                    .map(([k]) => (
                      <span key={k} className="px-2 py-1 bg-[#f97316]/5 text-[#f97316] rounded-lg text-[10px] font-bold">
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Available Plans ─── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h3 className="text-xl font-bold text-[#1a1a1a]">Choose a plan</h3>
            <p className="text-[13px] text-[#888] mt-0.5">Subscribe or upgrade to unlock more capacity and features.</p>
          </div>
          <div className="flex rounded-full bg-[#f5f5f3] p-1 w-fit">
            <button
              onClick={() => setBillingCycle('month')}
              className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${billingCycle === 'month' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#999]'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`px-5 py-2 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${billingCycle === 'year' ? 'bg-white text-[#1a1a1a] shadow-sm' : 'text-[#999]'}`}
            >
              Annual
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-[32px] border border-[#eee] animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-dashed border-[#e5e5e5] p-12 text-center">
            <CircleDollarSign className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-stone-500">No plans available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const isCurrent = plan.id === currentPlanId;
              const quotas = plan.configuration?.quotas ?? {};
              const flagEntries = Object.entries(plan.configuration?.featureFlags ?? {}).filter(([, v]) => v);
              const isSubmitting = subscribingId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-[32px] border p-7 shadow-sm flex flex-col relative overflow-hidden transition-all ${
                    isCurrent ? 'border-[#f97316]/50 shadow-glow' : 'border-[#eee] hover:border-[#f97316]/30 hover:shadow-md'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#f97316] text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-2xl">
                      Current
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      {plan.isDefault ? <Crown className="w-5 h-5 text-[#f97316]" /> : <Gem className="w-5 h-5 text-stone-300" />}
                      <h4 className="font-bold text-lg text-[#1a1a1a]">{plan.name}</h4>
                    </div>
                    {plan.description && <p className="text-[12px] text-[#888] mt-1 leading-relaxed">{plan.description}</p>}
                  </div>

                  <div className="flex items-baseline gap-1 mb-5">
                    {plan.isFree ? (
                      <span className="text-3xl font-black text-[#1a1a1a]">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-[#1a1a1a]">
                          £{(
                            billingCycle === 'year'
                              ? (plan.annualPrice ?? Number(plan.monthlyPrice ?? 0) * 12)
                              : Number(plan.monthlyPrice ?? 0)
                          ).toFixed(2)}
                        </span>
                        <span className="text-[12px] text-[#888]">{billingCycle === 'year' ? '/yr' : '/mo'}</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-6 flex-1">
                    {Object.entries(quotas).length > 0 && (
                      <>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">Quotas</p>
                        {Object.entries(quotas).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-[12px] text-stone-600">
                            <span className="capitalize">{k.replace(/^max/, '')}</span>
                            <span className="font-bold">{v === -1 ? 'Unlimited' : v}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {flagEntries.length > 0 && (
                      <div className="pt-3 space-y-1.5">
                        {flagEntries.map(([k]) => (
                          <div key={k} className="flex items-center gap-2 text-[12px] text-stone-600">
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            {k.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isCurrent || isSubmitting}
                    className={`w-full py-3 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                      isCurrent
                        ? 'bg-[#f5f5f3] text-[#aaa] cursor-default'
                        : 'bg-[#1a1a1a] text-white hover:bg-[#f97316]'
                    } flex items-center justify-center gap-2 disabled:opacity-60`}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isCurrent ? 'Current Plan' : isSubmitting ? 'Subscribing...' : plan.isFree ? 'Choose Free' : 'Subscribe'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Invoices */}
        <section className="md:col-span-2 bg-white rounded-[40px] border border-[#eee] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-[#eee]">
            <h3 className="text-[15px] font-bold text-[#1a1a1a]">Invoice History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-[#f5f5f3]">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="px-8 py-5"><div className="h-4 w-full bg-[#f5f5f3] rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : invoices.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-[#888] text-[13px]">No invoices yet</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-[#fafaf9] transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.description || inv.invoiceNumber || inv.id}</p>
                        <p className="text-[12px] text-[#888]">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[14px] font-bold text-[#1a1a1a]">{inv.totalAmount != null ? `£${Number(inv.totalAmount).toFixed(2)}` : inv.amount}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] rounded-[40px] p-8 text-white">
            <h4 className="text-[15px] font-bold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment Method</h4>
            {paymentMethod ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-[10px]">{paymentMethod.brand || 'CARD'}</div>
                <div>
                  <p className="text-[13px] font-bold">•••• {paymentMethod.last4 || '••••'}</p>
                  <p className="text-[11px] text-white/40">Expires {paymentMethod.expMonth}/{String(paymentMethod.expYear).slice(-2)}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[12px] text-white/50">No payment method on file</p>
              </div>
            )}
          </section>

          <section className="bg-[#f97316]/5 rounded-[40px] p-8 border border-[#f97316]/10">
            <h4 className="text-[15px] font-bold text-[#1a1a1a] mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-[#f97316]" /> Need help?</h4>
            <p className="text-[13px] text-[#888] leading-relaxed">
              If you have questions about your subscription or need a custom plan, our team is here to help.
            </p>
          </section>
        </div>
      </div>

      {paymentPending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl px-8 py-6 flex items-center gap-3 shadow-2xl">
            <Loader2 className="w-5 h-5 text-[#f97316] animate-spin" />
            <p className="text-[13px] font-bold text-[#1a1a1a]">Confirming your payment…</p>
          </div>
        </div>
      )}

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          billingCycle={billingCycle}
          onClose={() => setCheckoutPlan(null)}
          onSettled={() => {
            clearPendingPurchase();
            setCheckoutPlan(null);
            setMessage('Subscription activated successfully. Welcome aboard!');
          }}
        />
      )}
    </div>
  );
}