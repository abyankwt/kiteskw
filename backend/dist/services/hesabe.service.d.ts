export interface HesabeDecryptedResponse {
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
export declare function createPaymentPayload(params: {
    amount: number;
    orderId: string;
    userId: string;
    courseId: string;
}): {
    encryptedPayload: string;
    paymentUrl: string;
};
export declare function decryptCallback(encryptedData: string): HesabeDecryptedResponse;
export declare function verifyHmac(data: string, receivedHmac: string): boolean;
export declare function isPaymentSuccessful(response: HesabeDecryptedResponse): boolean;
//# sourceMappingURL=hesabe.service.d.ts.map