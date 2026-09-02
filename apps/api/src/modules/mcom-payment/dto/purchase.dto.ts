export type BillingCycle = 'month' | 'year';

export type PaymentProvider = 'stripe' | 'paypal';

export interface InitiatePurchaseDto {
  planId: string;
  billingCycle?: BillingCycle;
  provider: PaymentProvider;
}

export interface ConfirmPurchaseDto {
  planId: string;
  billingCycle?: BillingCycle;
  paymentIntentId?: string;
  setupIntentId?: string;
}

export interface CapturePurchaseDto {
  orderId: string;
  planId: string;
  billingCycle?: BillingCycle;
}