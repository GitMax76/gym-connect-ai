
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                    <h2 className="text-lg font-bold text-red-700 mb-2">Qualcosa è andato storto</h2>
                    <p className="text-red-600 mb-4">Si è verificato un errore imprevisto:</p>
                    <pre className="text-xs bg-white p-2 rounded mb-4 overflow-auto max-w-full text-left">
                        {this.state.error?.message}
                    </pre>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-100"
                    >
                        Ricarica la pagina
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
