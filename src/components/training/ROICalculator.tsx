import { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ROICalculator() {
    const [currentSalary, setCurrentSalary] = useState(50000);
    const coursePrice = 11999;
    const averageIncrease = 0.45; // 45% average salary increase

    const expectedSalary = Math.round(currentSalary * (1 + averageIncrease));
    const monthlyIncrease = expectedSalary - currentSalary;
    const paybackMonths = Math.ceil(coursePrice / monthlyIncrease);
    const yearlyGain = monthlyIncrease * 12;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-bold">ROI Calculator</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    Calculate Your Investment Return
                </h3>
                <p className="text-slate-600">
                    See how quickly our training pays for itself
                </p>
            </div>

            {/* Salary Input Slider */}
            <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Your Current Monthly Salary
                </label>
                <div className="relative">
                    <input
                        type="range"
                        min="20000"
                        max="150000"
                        step="5000"
                        value={currentSalary}
                        onChange={(e) => setCurrentSalary(Number(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                                 [&::-webkit-slider-thumb]:from-blue-600 [&::-webkit-slider-thumb]:to-purple-600 
                                 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                                 [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>₹20,000</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(currentSalary)}/month</span>
                    <span>₹1,50,000</span>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Expected Salary */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-md"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            +{Math.round(averageIncrease * 100)}%
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">Expected Post-Training Salary</p>
                    <p className="text-3xl font-bold text-slate-900">{formatCurrency(expectedSalary)}</p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                </motion.div>

                {/* Monthly Increase */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-md"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">Monthly Income Increase</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyIncrease)}</p>
                    <p className="text-xs text-slate-500 mt-1">extra every month</p>
                </motion.div>
            </div>

            {/* Highlight Box */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white text-center shadow-lg"
            >
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Payback Period</span>
                </div>
                <div className="text-5xl font-bold mb-2">
                    {paybackMonths < 1 ? '< 1' : paybackMonths}
                </div>
                <p className="text-xl mb-4">{paybackMonths === 1 ? 'Month!' : 'Months!'}</p>
                <div className="h-px bg-white/30 my-4"></div>
                <p className="text-sm opacity-90">
                    Your investment of <span className="font-bold">{formatCurrency(coursePrice)}</span> pays for itself in {paybackMonths === 1 ? 'less than a month' : `just ${paybackMonths} months`}!
                </p>
                <p className="text-lg font-semibold mt-4">
                    Yearly Gain: <span className="text-2xl">{formatCurrency(yearlyGain)}</span> 🎉
                </p>
            </motion.div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-500 text-center mt-6">
                * Based on our graduates' average 45% salary increase. Individual results may vary.
            </p>
        </div>
    );
}
