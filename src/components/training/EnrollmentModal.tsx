import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, CreditCard, GraduationCap } from 'lucide-react';
import apiClient from '@/lib/apiClient';
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

export function EnrollmentModal({ course, onClose }: Props) {
    const [error, setError] = useState('');
    const isFree = course?.price === 'Free';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    if (!course) return null;

    const onSubmit = async (values: FormValues) => {
        setError('');
        try {
            const { data } = await apiClient.post('/enrollments/guest', {
                courseId: String(course.id),
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
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
                        <span className={`text-sm font-semibold ${isFree ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {course.price}
                        </span>
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={16} className="animate-spin" /> Processing...</>
                        ) : isFree ? (
                            <><GraduationCap size={16} /> Enroll Now — Free</>
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
