import { Loader2, Save } from "lucide-react";

interface SettingsStickySaveBarProps {
    isDirty: boolean;
    saving: boolean;
    onResetChanges: () => void;
    onSave: () => void;
}

export default function SettingsStickySaveBar({
    isDirty,
    saving,
    onResetChanges,
    onSave,
}: SettingsStickySaveBarProps) {
    return (
        <div className="fixed bottom-6 inset-x-0 z-40 max-w-4xl mx-auto px-4">
            <div className="bg-[#131317]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isDirty ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />
                    <span className="font-cairo text-xs font-bold text-white hidden sm:inline">
                        {isDirty ? "توجد تغييرات غير محفوظة حالياً" : "جميع الإعدادات متزامنة ومحفوظة"}
                    </span>
                    <span className="font-tajawal text-[11px] text-[#94a3b8] hidden md:inline">
                        {isDirty ? "اضغط على زر الحفظ لتحديث الشعار والهوية فوراً" : "تحديث فوري لكل عناصر المنصة"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {isDirty && (
                        <button
                            type="button"
                            onClick={onResetChanges}
                            className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                        >
                            إلغاء التعديلات
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={saving || !isDirty}
                        onClick={onSave}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] disabled:opacity-40 disabled:cursor-not-allowed text-white font-cairo font-bold text-xs shadow-lg shadow-red-950/50 transition-all cursor-pointer active:scale-95"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>جاري الحفظ...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>حفظ التغييرات</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
