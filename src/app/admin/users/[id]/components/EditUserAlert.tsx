"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface EditUserAlertProps {
    msg: { type: "success" | "error"; text: string } | null;
}

export function EditUserAlert({ msg }: EditUserAlertProps) {
    if (!msg) return null;

    return (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-xl animate-in slide-in-from-top-2 duration-300 ${
            msg.type === "success" 
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30" 
                : "bg-rose-950/80 text-rose-300 border-rose-500/30"
        }`}>
            {msg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-bold">{msg.text}</span>
        </div>
    );
}
