import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { LottiePlayer } from "@/components/ui/LottiePlayer";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // Error animation URL
            const errorAnimationUrl = "https://lottie.host/2fa8e7b6-6c8a-4f25-9c8e-4b3d8c7a9e1f/DqRGZjKnPQ.json";

            // Fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-gray-50 rounded-lg border border-gray-200 m-4">
                    {/* Lottie Error Animation */}
                    <div className="w-32 h-32 mb-4">
                        <LottiePlayer
                            animationData={errorAnimationUrl}
                            loop={true}
                            autoplay={true}
                            speed={1}
                            lazyLoad={false}
                            ariaLabel="Error illustration"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4 max-w-md">
                        We encountered an unexpected error ensuring the visual integrity of the page.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded text-left w-full overflow-auto max-h-40">
                            <p className="font-mono text-sm whitespace-pre-wrap">
                                {this.state.error.toString()}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
