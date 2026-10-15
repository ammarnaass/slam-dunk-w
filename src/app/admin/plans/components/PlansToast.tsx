import { CheckCircle, AlertCircle } from "lucide-react";

interface PlansToastProps {
    toast: { type: "success" | "error"; text: string } | null;
}

export function PlansToast({ toast }: PlansToastProps) {
    if (!toast) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success" 
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50" 
                : "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50"
        }`}>
            {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-bold">{toast.text}</span>
        </div>
    );
}
