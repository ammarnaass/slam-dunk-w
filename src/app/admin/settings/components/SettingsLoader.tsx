import { Loader2 } from "lucide-react";

export default function SettingsLoader() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#dc2626]/20 border border-[#dc2626]/40 flex items-center justify-center text-[#ffb4ab] animate-pulse">
                <Loader2 className="animate-spin" size={24} />
            </div>
            <div>
                <h3 className="font-cairo font-bold text-white text-base">جاري تحميل إعدادات المنصة</h3>
                <p className="font-tajawal text-xs text-[#94a3b8] mt-1">يتم جلب بيانات الهوية والشعار وربط النظام...</p>
            </div>
        </div>
    );
}
