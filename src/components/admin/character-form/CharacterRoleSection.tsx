import React from "react";
import { Shield } from "lucide-react";
import { ROLE_PRESETS } from "./useCharacterForm";

interface CharacterRoleSectionProps {
    role?: string | null;
    team?: string | null;
    position?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectPreset: (preset: string) => void;
}

export const CharacterRoleSection: React.FC<CharacterRoleSectionProps> = ({
    role,
    team,
    position,
    onChange,
    onSelectPreset,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <Shield className="text-rose-400" size={18} />
                <span>الدور الدرامي والفصيل / الانتماء</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">نوع الدور</label>
                    <input
                        type="text"
                        name="role"
                        placeholder="مثال: بطل رئيسي / محقق"
                        value={role || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                        {ROLE_PRESETS.map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => onSelectPreset(p)}
                                className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] transition-colors"
                            >
                                {p.split(" (")[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">الفصيل / المنظمة / الفريق</label>
                    <input
                        type="text"
                        name="team"
                        placeholder="مثال: فريق التحريات الصغير / شوهوكو"
                        value={team || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">اللقب أو التخصص</label>
                    <input
                        type="text"
                        name="position"
                        placeholder="مثال: شارلوك هولمز المعاصر / مهاجم"
                        value={position || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};
