import CryptoJS from 'crypto-js';
import { hesabeConfig } from '../config/hesabe';

/**
 * Hesabe Payment Gateway Integration
 * Uses AES-256-CBC encryption + HMAC-SHA256 for request/response security
 * Documentation: https://hesabe.com/developers
 */

interface HesabePaymentRequest {
  merchantCode: string;
  amount: number;
  currency: string;
  responseUrl: string;
  failureUrl: string;
  version: string;
  orderReferenceNumber: string;
  variable1?: string; // userId
  variable2?: string; // courseId
  variable3?: string;
  variable4?: string;
  variable5?: string;
}

interface HesabeDecryptedResponse {
  status: boolean;
  message: string;
  resultCode: string;
  orderReferenceNumber: string;
  paymentId: string;
  variable1?: string;
  variable2?: string;
  variable3?: string;
  response?: any;
}

function encrypt(data: string): string {
  const key = CryptoJS.enc.Utf8.parse(hesabeConfig.secretKey);
  const iv = CryptoJS.enc.Utf8.parse(hesabeConfig.iv);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

function decrypt(encryptedData: string): string {
  const key = CryptoJS.enc.Utf8.parse(hesabeConfig.secretKey);
  const iv = CryptoJS.enc.Utf8.parse(hesabeConfig.iv);

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

function generateHmac(data: string): string {
  return CryptoJS.HmacSHA256(data, hesabeConfig.secretKey).toString();
}

export function createPaymentPayload(params: {
  amount: number;
  orderId: string;
  userId: string;
  courseId: string;
}): { encryptedPayload: string; paymentUrl: string } {
  const payload: HesabePaymentRequest = {
    merchantCode: hesabeConfig.merchantCode,
    amount: parseFloat(params.amount.toFixed(3)),
    currency: 'KWD',
    responseUrl: `${process.env.API_BASE_URL}/api/v1/payments/webhook`,
    failureUrl: `${process.env.FRONTEND_URL}/payment/failure?orderId=${params.orderId}`,
    version: '2.0',
    orderReferenceNumber: params.orderId,
    variable1: params.userId,
    variable2: params.courseId,
  };

  const jsonPayload = JSON.stringify(payload);
  const encryptedPayload = encrypt(jsonPayload);

  const paymentUrl = `${hesabeConfig.paymentUrl}?data=${encodeURIComponent(encryptedPayload)}&accessCode=${hesabeConfig.accessCode}`;

  return { encryptedPayload, paymentUrl };
}

export function decryptCallback(encryptedData: string): HesabeDecryptedResponse {
  try {
    const decrypted = decrypt(encryptedData);
    return JSON.parse(decrypted);
  } catch (err) {
    throw new Error('Failed to decrypt Hesabe callback: ' + err);
  }
}

export function verifyHmac(data: string, receivedHmac: string): boolean {
  const expected = generateHmac(data);
  return expected === receivedHmac;
}

export function isPaymentSuccessful(response: HesabeDecryptedResponse): boolean {
  return response.status === true && response.resultCode === '0';
}
