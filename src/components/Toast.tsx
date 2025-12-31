"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "info" | "error" | "warning";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        error: <AlertTriangle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    };

    const colors = {
        success: "border-green-500/20 bg-green-500/10 text-green-200",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-200",
        error: "border-red-500/20 bg-red-500/10 text-red-200",
        warning: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
    };

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}>
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[type]}`}>
                {icons[type]}
                <p className="text-sm font-bold whitespace-nowrap">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-2 hover:opacity-70 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
