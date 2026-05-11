"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hesabeConfig = void 0;
exports.hesabeConfig = {
    merchantCode: (process.env.HESABE_MERCHANT_CODE || '').trim(),
    secretKey: (process.env.HESABE_SECRET_KEY || '').trim(),
    accessCode: (process.env.HESABE_ACCESS_CODE || '').trim(),
    iv: (process.env.HESABE_IV || '').trim(), // trim trailing spaces that break AES-CBC
    paymentUrl: (process.env.HESABE_PAYMENT_URL || 'https://api.hesabe.com/payment').trim(),
};
//# sourceMappingURL=hesabe.js.map