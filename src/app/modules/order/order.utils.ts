/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.shurjopay.sp_endpoint!,
  config.shurjopay.sp_username!,
  config.shurjopay.sp_password!,
  config.shurjopay.sp_prefix!,
  config.shurjopay.sp_return_url!,
);

const makePaymentAsync = async (paymentPayload: any): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      response => resolve(response),
      error => reject(error),
    );
  });
};

const verifyPaymentAsync = (order_id: string): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      response => resolve(response),
      error => reject(error),
    );
  });
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
