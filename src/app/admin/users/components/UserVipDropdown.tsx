"use client";

import { Crown, ChevronDown, Loader2 } from "lucide-react";
import { User } from "@/types";
import { QuickUpgradeAction } from "../hooks/useAdminUsers";

interface UserVipDropdownProps {
    user: User;
    isPremium: boolean;
    isRowLoading: boolean;
    actionLoadingId: string | null;
    onQuickUpgrade: (userId: string, action: QuickUpgradeAction) => void;
}

export function UserVipDropdown({
    user,
    isPremium,
    isRowLoading,
    actionLoadingId,
    onQuickUpgrade,
}: UserVipDropdownProps) {
    const isLoading = actionLoadingId === user.id;

    return (
        <div className="relative group/upgrade">
            <button
                disabled={isRowLoading}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
                    isPremium
                        ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-amber-600/20"
                }`}
                title="ترقية سريعة لاشتراك VIP"
            >
                {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                ) : (
                    <>
                        <Crown size={13} />
                        <span>{isPremium ? "تمديد" : "ترقية VIP"}</span>
                        <ChevronDown size={11} />
                    </>
                )}
            </button>

            {/* Dropdown Options */}
            <div className="absolute left-0 top-full mt-1.5 hidden group-hover/upgrade:block z-30 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1.5 backdrop-blur-2xl">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-800/80 mb-1">
                    اختر مدة الترقية:
                </div>
                <button
                    onClick={() => onQuickUpgrade(user.id, "UPGRADE_30")}
                    className="w-full text-right px-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                    <span>+ شهر (30 يوم)</span>
                    <span className="text-[10px] text-amber-400/80">شهري</span>
                </button>
                <button
                    onClick={() => onQuickUpgrade(user.id, "UPGRADE_90")}
                    className="w-full text-right px-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                    <span>+ 3 أشهر (90 يوم)</span>
                    <span className="text-[10px] text-amber-400/80">موسمي</span>
                </button>
                <button
                    onClick={() => onQuickUpgrade(user.id, "UPGRADE_365")}
                    className="w-full text-right px-3 py-2.5 min-h-[44px] text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-900 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                >
                    <span>+ سنة كاملة (365 يوم)</span>
                    <span className="text-[10px] text-amber-400/80">سنوي ذهبي</span>
                </button>
                {isPremium && (
                    <button
                        onClick={() => onQuickUpgrade(user.id, "CANCEL_VIP")}
                        className="w-full text-right px-3 py-2.5 min-h-[44px] text-xs font-bold text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border-t border-slate-800/80 mt-1 cursor-pointer"
                    >
                        إلغاء اشتراك VIP
                    </button>
                )}
            </div>
        </div>
    );
}
