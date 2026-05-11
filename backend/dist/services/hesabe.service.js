"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentPayload = createPaymentPayload;
exports.decryptCallback = decryptCallback;
exports.verifyHmac = verifyHmac;
exports.isPaymentSuccessful = isPaymentSuccessful;
const crypto_js_1 = __importDefault(require("crypto-js"));
const hesabe_1 = require("../config/hesabe");
function encrypt(data) {
    const key = crypto_js_1.default.enc.Utf8.parse(hesabe_1.hesabeConfig.secretKey);
    const iv = crypto_js_1.default.enc.Utf8.parse(hesabe_1.hesabeConfig.iv);
    const encrypted = crypto_js_1.default.AES.encrypt(data, key, {
        iv,
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return encrypted.toString();
}
function decrypt(encryptedData) {
    const key = crypto_js_1.default.enc.Utf8.parse(hesabe_1.hesabeConfig.secretKey);
    const iv = crypto_js_1.default.enc.Utf8.parse(hesabe_1.hesabeConfig.iv);
    const decrypted = crypto_js_1.default.AES.decrypt(encryptedData, key, {
        iv,
        mode: crypto_js_1.default.mode.CBC,
        padding: crypto_js_1.default.pad.Pkcs7,
    });
    return decrypted.toString(crypto_js_1.default.enc.Utf8);
}
function generateHmac(data) {
    return crypto_js_1.default.HmacSHA256(data, hesabe_1.hesabeConfig.secretKey).toString();
}
function createPaymentPayload(params) {
    const payload = {
        merchantCode: hesabe_1.hesabeConfig.merchantCode,
        amount: parseFloat(params.amount.toFixed(3)),
        currency: 'KWD',
        responseUrl: `${process.env.API_BASE_URL}/api/v1/payments/callback`,
        failureUrl: `${process.env.API_BASE_URL}/api/v1/payments/failure-callback?orderId=${params.orderId}`,
        version: '2.0',
        orderReferenceNumber: params.orderId,
        variable1: params.userId,
        variable2: params.courseId,
    };
    const jsonPayload = JSON.stringify(payload);
    console.log('[Hesabe] Payload being sent:', JSON.stringify(payload, null, 2));
    console.log('[Hesabe] Config:', {
        merchantCode: hesabe_1.hesabeConfig.merchantCode,
        accessCode: hesabe_1.hesabeConfig.accessCode,
        secretKeyLength: hesabe_1.hesabeConfig.secretKey.length,
        ivLength: hesabe_1.hesabeConfig.iv.length,
        paymentUrl: hesabe_1.hesabeConfig.paymentUrl,
    });
    const encryptedPayload = encrypt(jsonPayload);
    const paymentUrl = `${hesabe_1.hesabeConfig.paymentUrl}?data=${encodeURIComponent(encryptedPayload)}&accessCode=${hesabe_1.hesabeConfig.accessCode}`;
    return { encryptedPayload, paymentUrl };
}
function decryptCallback(encryptedData) {
    try {
        const decrypted = decrypt(encryptedData);
        return JSON.parse(decrypted);
    }
    catch (err) {
        throw new Error('Failed to decrypt Hesabe callback: ' + err);
    }
}
function verifyHmac(data, receivedHmac) {
    const expected = generateHmac(data);
    return expected === receivedHmac;
}
function isPaymentSuccessful(response) {
    return response.status === true && response.resultCode === '0';
}
//# sourceMappingURL=hesabe.service.js.map