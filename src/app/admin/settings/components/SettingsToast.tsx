import { CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsToastProps {
    toast: {
        type: "success" | "error";
        message: string;
    } | null;
}

export default function SettingsToast({ toast }: SettingsToastProps) {
    if (!toast) return null;

    return (
        <div
            className={`fixed top-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                toast.type === "success"
                    ? "bg-[#112211]/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/40"
                    : "bg-[#221111]/90 border-red-500/30 text-red-300 shadow-red-950/40"
            }`}
        >
            {toast.type === "success" ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
            ) : (
                <AlertCircle size={20} className="text-red-400" />
            )}
            <span className="font-tajawal text-xs font-bold">{toast.message}</span>
        </div>
    );
}
