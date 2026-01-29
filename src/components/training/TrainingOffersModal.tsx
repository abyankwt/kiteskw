import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, Sparkles, Tag, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingOffersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TrainingOffersModal({ open, onOpenChange }: TrainingOffersModalProps) {
    const whatsappUrl = "https://wa.me/96522092260";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-[#0F131A] border border-white/10 shadow-2xl p-0 overflow-hidden ring-0 outline-none">
                {/* Close Button Override */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white/50 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                >
                    <X size={16} />
                </button>

                {/* Hero Header */}
                <div className="relative h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 overflow-hidden flex flex-col items-center justify-center text-center p-6">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shine_3s_infinite]" />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

                    <div className="relative z-10 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-3 shadow-lg">
                            <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                            <span>Exclusive Offer</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Unlock Your Mastery</h2>
                        <p className="text-blue-100 text-xs mt-1 font-medium tracking-wide">Limited time opportunities for ambitious engineers</p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4 bg-[#0F131A]">
                    {/* Offer 1 */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-xl bg-[#1A1F29] border border-white/5 hover:border-blue-500/50 hover:bg-[#1f2532] transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shrink-0 border border-blue-500/20">
                            <Tag size={22} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">Corporate Power Bundle</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mt-1">Enroll 5+ engineers and save <span className="text-emerald-400 font-bold">20% instantly</span>. Perfect for teams.</p>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                            <ArrowRight size={16} className="text-blue-400" />
                        </div>
                    </a>

                    {/* Offer 2 */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-xl bg-[#1A1F29] border border-white/5 hover:border-emerald-500/50 hover:bg-[#1f2532] transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0 border border-emerald-500/20">
                            <Timer size={22} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">Early Bird Advantage</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mt-1">Book 30 days ahead for <span className="text-emerald-400 font-bold">10% OFF</span>. Secure your seat now.</p>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                            <ArrowRight size={16} className="text-emerald-400" />
                        </div>
                    </a>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-2 bg-[#0F131A] flex flex-col gap-3">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-[1.02]"
                    >
                        Claim My Discount <ArrowRight size={18} />
                    </a>

                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        No thanks, I prefer paying full price
                    </button>
                </div>
            </DialogContent>
        </Dialog >
    );
}
