import React from "react";

interface PlanAlertProps {
    msg: { type: "success" | "error"; text: string } | null;
}

export const PlanAlert: React.FC<PlanAlertProps> = ({ msg }) => {
    if (!msg) return null;

    return (
        <div
            className={`p-4 rounded-2xl text-center font-bold text-sm shadow-xl border animate-in slide-in-from-top-2 duration-300 ${
                msg.type === "success"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-950/80 text-rose-300 border-rose-500/30"
            }`}
        >
            {msg.text}
        </div>
    );
};
