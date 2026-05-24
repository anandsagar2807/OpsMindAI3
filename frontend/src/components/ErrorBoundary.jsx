import { Component } from 'react';
import toast from 'react-hot-toast';

/**
 * Global Error Boundary that catches unhandled React errors and prevents
 * the entire app tree from crashing. Shows a recoverable error UI with
 * a retry button instead of a blank white screen.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('[ErrorBoundary] Unhandled error:', error, errorInfo);

        // Show a toast notification so the user knows something went wrong
        toast.error('Something went wrong. Click "Try Again" to recover.', { duration: 8000 });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        {/* Error icon */}
                        <div className="w-16 h-16 rounded-[12px] bg-red-500/[0.08] border border-red-500/[0.15] flex items-center justify-center mx-auto mb-5">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>

                        <h2 className="text-[20px] font-bold text-white/90 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-[13px] text-gray-400/70 mb-1">
                            An unexpected error occurred in the application.
                        </p>
                        {this.state.error?.message && (
                            <p className="text-[12px] text-gray-500/60 mb-5 px-4 py-2 rounded-[8px] bg-white/[0.03] border border-white/[0.06] font-mono break-all">
                                {this.state.error.message}
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-3 mt-5">
                            <button
                                onClick={this.handleRetry}
                                className="h-9 px-4 rounded-[8px] bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-[13px] shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition-transform active:scale-[0.98]"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="h-9 px-4 rounded-[8px] bg-white/[0.03] border border-white/[0.06] text-gray-400/80 hover:text-white hover:border-white/[0.10] transition-all duration-200 text-[13px] font-medium flex items-center gap-1.5"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;