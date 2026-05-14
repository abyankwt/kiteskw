import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, CreditCard, GraduationCap, Tag, CheckCircle2, ChevronDown } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useValidateCoupon } from '@/hooks/useCoupons';
import toast from 'react-hot-toast';

const schema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(7, 'Enter a valid phone number'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    course: { id: string | number; title: string; price: string } | null;
    onClose: () => void;
}

function parsePrice(price: string): number {
    if (price === 'Free') return 0;
    return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

export function EnrollmentModal({ course, onClose }: Props) {
    const [error, setError] = useState('');
    const [couponOpen, setCouponOpen] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [couponResult, setCouponResult] = useState<{
        valid: boolean;
        message: string;
        code: string;
        discountAmount?: number;
        finalAmount?: number;
    } | null>(null);

    const validateCoupon = useValidateCoupon();
    const isFree = course?.price === 'Free';
    const baseAmount = course ? parsePrice(course.price) : 0;
    const finalAmount = couponResult?.valid ? (couponResult.finalAmount ?? baseAmount) : baseAmount;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    if (!course) return null;

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponResult(null);
        const result = await validateCoupon.mutateAsync({
            code: couponInput.trim(),
            courseId: String(course.id),
            amount: baseAmount,
        });
        setCouponResult({ ...result, code: couponInput.trim().toUpperCase() });
    };

    const handleRemoveCoupon = () => {
        setCouponResult(null);
        setCouponInput('');
    };

    const onSubmit = async (values: FormValues) => {
        setError('');
        try {
            const { data } = await apiClient.post('/enrollments/guest', {
                courseId: String(course.id),
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                ...(couponResult?.valid && { couponCode: couponResult.code }),
            });

            if (data.free) {
                toast.success('You are now enrolled! Check your email.');
                onClose();
            } else if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            }
        } catch (err: any) {
            const msg = err?.response?.data?.error;
            if (msg === 'Already enrolled in this course') {
                toast.success('You are already enrolled in this course!');
                onClose();
            } else {
                setError(msg || 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#151921] border border-white/10 rounded-2xl shadow-2xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="p-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <GraduationCap size={16} className="text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-white leading-tight">{course.title}</h2>
                    </div>
                    <div className="ml-11">
                        {couponResult?.valid ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-400 line-through">{course.price}</span>
                                <span className="text-sm font-semibold text-emerald-400">
                                    KWD {finalAmount.toFixed(3)}
                                </span>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                                    -{couponResult.discountAmount ? `KWD ${couponResult.discountAmount.toFixed(3)}` : ''}
                                </span>
                            </div>
                        ) : (
                            <span className={`text-sm font-semibold ${isFree ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {course.price}
                            </span>
                        )}
                        <p className="text-slate-400 text-xs mt-0.5">
                            {isFree ? 'Free enrollment — no payment required' : 'Secure payment via Hesabe'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <input
                            type="text"
                            autoComplete="name"
                            placeholder="Ahmed Al-Rashidi"
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.fullName ? 'border-red-500/50' : 'border-white/10'}`}
                            {...register('fullName')}
                        />
                        {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                            {...register('email')}
                        />
                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300">Phone Number</label>
                        <input
                            type="tel"
                            autoComplete="tel"
                            placeholder="+965 XXXX XXXX"
                            className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.phone ? 'border-red-500/50' : 'border-white/10'}`}
                            {...register('phone')}
                        />
                        {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                    </div>

                    {/* Coupon section — only for paid courses */}
                    {!isFree && (
                        <div className="border border-white/10 rounded-lg overflow-hidden">
                            {couponResult?.valid ? (
                                <div className="flex items-center justify-between px-4 py-3 bg-emerald-500/10">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                        <span className="text-sm text-emerald-400 font-medium font-mono">{couponResult.code}</span>
                                        <span className="text-xs text-emerald-300">applied</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-xs text-slate-400 hover:text-white transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setCouponOpen(o => !o)}
                                        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Tag size={13} />
                                            Have a coupon code?
                                        </span>
                                        <ChevronDown size={14} className={`transition-transform ${couponOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {couponOpen && (
                                        <div className="px-4 pb-3 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponInput}
                                                    onChange={e => {
                                                        setCouponInput(e.target.value.toUpperCase());
                                                        if (couponResult) setCouponResult(null);
                                                    }}
                                                    placeholder="ENTER CODE"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={validateCoupon.isPending || !couponInput.trim()}
                                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    {validateCoupon.isPending ? '...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponResult && !couponResult.valid && (
                                                <p className="text-xs text-red-400">{couponResult.message}</p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={16} className="animate-spin" /> Processing...</>
                        ) : isFree ? (
                            <><GraduationCap size={16} /> Enroll Now — Free</>
                        ) : couponResult?.valid ? (
                            <><CreditCard size={16} /> Pay KWD {finalAmount.toFixed(3)}</>
                        ) : (
                            <><CreditCard size={16} /> Proceed to Payment</>
                        )}
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                        Your details are used only for enrollment and course access.
                    </p>
                </form>
            </div>
        </div>
    );
}
