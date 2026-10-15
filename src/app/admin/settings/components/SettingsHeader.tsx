import Link from "next/link";
import { Settings, RotateCcw, Film, ExternalLink } from "lucide-react";

interface SettingsHeaderProps {
    siteName: string;
    onResetDefault: () => void;
}

export default function SettingsHeader({ siteName, onResetDefault }: SettingsHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] p-0.5 shadow-xl shadow-red-950/40 shrink-0">
                    <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-[#ffb4ab]">
                        <Settings size={28} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="font-cairo font-black text-2xl sm:text-3xl text-white">إعدادات وهوية الموقع</h1>
                        <span className="px-3 py-0.5 rounded-full bg-[#ffb95f]/15 border border-[#ffb95f]/30 text-[#ffb95f] font-cairo text-[11px] font-bold">
                            بنية الخدمات المستقلة
                        </span>
                    </div>
                    <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-1">
                        التحكم الكامل في هوية وشعار منصة <span className="text-white font-bold">{siteName}</span>، الألوان المعتمدة، والمحاكاة الحية
                    </p>
                </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
                <button
                    type="button"
                    onClick={onResetDefault}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                    title="استرجاع شعار واسم أنمي دايز المعتمد"
                >
                    <RotateCcw size={14} className="text-[#ffb95f]" />
                    <span>استعادة الشعار الرسمي</span>
                </button>

                <Link
                    href="/admin/slider"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all"
                >
                    <Film size={14} className="text-red-400" />
                    <span>إدارة السلايدر</span>
                </Link>

                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all"
                >
                    <ExternalLink size={14} className="text-[#94a3b8]" />
                    <span>عرض الموقع</span>
                </Link>
            </div>
        </div>
    );
}
