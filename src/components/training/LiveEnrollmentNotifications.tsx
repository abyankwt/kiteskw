import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Users, TrendingUp } from 'lucide-react';

// Mock data for recent enrollments
const mockEnrollments = [
    { name: 'Ahmed', location: 'Kuwait City', course: 'SolidWorks – Level 1', time: 2 },
    { name: 'Fatima', location: 'Salmiya', course: 'CFD Mastery', time: 5 },
    { name: 'Mohammed', location: 'Hawally', course: 'SolidWorks Certification', time: 8 },
    { name: 'Sarah', location: 'Jabriya', course: 'MATLAB Fundamental', time: 12 },
    { name: 'Abdullah', location: 'Mangaf', course: 'SolidWorks – Level 1', time: 15 },
    { name: 'Noor', location: 'Ahmadi', course: 'CFD Mastery', time: 18 },
    { name: 'Khalid', location: 'Farwaniya', course: 'SolidWorks Certification', time: 22 },
    { name: 'Layla', location: 'Salwa', course: 'MATLAB Fundamental', time: 25 },
];

export const LiveEnrollmentNotifications = () => {
    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        // Don't show if user has seen it in this session
        const hasSeenNotifications = sessionStorage.getItem('hasSeenEnrollmentToasts');
        if (hasSeenNotifications) return;

        let toastIndex = 0;
        const showNextToast = () => {
            if (toastIndex >= mockEnrollments.length) {
                sessionStorage.setItem('hasSeenEnrollmentToasts', 'true');
                return;
            }

            const enrollment = mockEnrollments[toastIndex];

            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        New Enrollment!
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        <span className="font-semibold text-gray-700">{enrollment.name}</span> from{' '}
                                        {enrollment.location} just enrolled in{' '}
                                        <span className="font-semibold text-blue-600">{enrollment.course}</span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                                        <TrendingUp size={10} />
                                        {enrollment.time} minutes ago
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: 4000,
                    position: 'bottom-right',
                }
            );

            toastIndex++;
        };

        // Show first toast after 3 seconds
        const initialDelay = setTimeout(() => {
            showNextToast();
            setHasShown(true);

            // Show subsequent toasts every 8-15 seconds
            const interval = setInterval(() => {
                showNextToast();
            }, Math.random() * 7000 + 8000); // Random between 8-15 seconds

            return () => clearInterval(interval);
        }, 3000);

        return () => clearTimeout(initialDelay);
    }, []);

    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: '',
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                },
            }}
        />
    );
};
