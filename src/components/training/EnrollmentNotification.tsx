import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Enrollment {
    name: string;
    course: string;
    location: string;
}

const SAMPLE_ENROLLMENTS: Enrollment[] = [
    { name: "Ahmed K.", course: "SolidWorks Level 1", location: "Kuwait City" },
    { name: "Fatima M.", course: "CFD Mastery", location: "Salmiya" },
    { name: "Mohammed A.", course: "ANSYS Professional", location: "Hawally" },
    { name: "Sarah H.", course: "SolidWorks Certification", location: "Farwaniya" },
    { name: "Abdullah R.", course: "FEA Advanced", location: "Kuwait City" }
];

export function EnrollmentNotification() {
    const [currentNotification, setCurrentNotification] = useState<Enrollment | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showNotification = () => {
            // Random enrollment from sample data
            const randomEnrollment = SAMPLE_ENROLLMENTS[
                Math.floor(Math.random() * SAMPLE_ENROLLMENTS.length)
            ];

            setCurrentNotification(randomEnrollment);
            setIsVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Show first notification after 8 seconds
        const initialTimeout = setTimeout(() => {
            showNotification();
        }, 8000);

        // Show subsequent notifications every 25-35 seconds
        const interval = setInterval(() => {
            showNotification();
        }, 25000 + Math.random() * 10000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!currentNotification) return null;

    return (
        <div
            className={cn(
                "fixed bottom-24 left-6 z-40 max-w-sm",
                "transform transition-all duration-500 ease-out",
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0"
            )}
        >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                        {currentNotification.name} just enrolled!
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5 truncate">
                        {currentNotification.course}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {currentNotification.location} • Just now
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
