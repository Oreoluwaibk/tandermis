import axiosInstance from "@/utils/axiosConfig";

export const SUBSCRIPTION_AMOUNT = Number(
  process.env.NEXT_PUBLIC_SUBSCRIPTION_AMOUNT ?? 22000
);

export const FLUTTERWAVE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ??
  "FLWPUBK_TEST-d641a1dd78d51b651bb754ac8cb235fd-X";

export interface PaymentAttemptResponse {
  user_id: number;
  account_id: number;
  amount: number;
  reference: string;
}

export interface PaymentVerificationResponse {
  reference: string;
  status: string;
  subscription_valid_to: string;
}

export const createPaymentAttempt = (amount: number) =>
  axiosInstance.post<PaymentAttemptResponse>("/api/v1/payment-attempt", {
    amount,
  });

export const verifyFlutterwaveTransaction = (params: {
  tx_ref: string;
  transaction_id?: string;
  status?: string;
}) =>
  axiosInstance.get<PaymentVerificationResponse>(
    "/api/v1/payment-gateway/flutterwave/transaction/verification",
    { params }
  );
