export interface CouponDto {
    code: string;
    description?: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number | null;
    expiresAt?: string | null;
    isActive?: boolean;
    applicableCourseIds?: string[] | null;
}
export interface ValidateCouponResult {
    valid: boolean;
    message: string;
    couponId?: string;
    discountAmount?: number;
    finalAmount?: number;
}
export declare function getCoupons(): Promise<{
    id: any;
    code: any;
    description: any;
    discountType: any;
    discountValue: number;
    minOrderAmount: number;
    maxUses: any;
    usedCount: any;
    expiresAt: any;
    isActive: any;
    applicableCourseIds: any;
    createdAt: any;
    updatedAt: any;
}[]>;
export declare function createCoupon(dto: CouponDto, createdBy: string): Promise<{
    id: any;
    code: any;
    description: any;
    discountType: any;
    discountValue: number;
    minOrderAmount: number;
    maxUses: any;
    usedCount: any;
    expiresAt: any;
    isActive: any;
    applicableCourseIds: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function updateCoupon(id: string, dto: Partial<CouponDto>): Promise<{
    id: any;
    code: any;
    description: any;
    discountType: any;
    discountValue: number;
    minOrderAmount: number;
    maxUses: any;
    usedCount: any;
    expiresAt: any;
    isActive: any;
    applicableCourseIds: any;
    createdAt: any;
    updatedAt: any;
}>;
export declare function deleteCoupon(id: string): Promise<void>;
export declare function validateCoupon(code: string, courseId: string, amount: number): Promise<ValidateCouponResult>;
export declare function applyCoupon(couponId: string): Promise<void>;
//# sourceMappingURL=coupon.service.d.ts.map