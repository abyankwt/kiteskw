export const hesabeConfig = {
  merchantCode: process.env.HESABE_MERCHANT_CODE || '',
  secretKey: process.env.HESABE_SECRET_KEY || '',
  accessCode: process.env.HESABE_ACCESS_CODE || '',
  iv: process.env.HESABE_IV || '',
  paymentUrl: process.env.HESABE_PAYMENT_URL || 'https://api.hesabe.com/payment',
};
