import React from "react";
import { Mic } from "lucide-react";

interface CharacterVoiceSectionProps {
    voiceActorJa?: string | null;
    voiceActorAr?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CharacterVoiceSection: React.FC<CharacterVoiceSectionProps> = ({
    voiceActorJa,
    voiceActorAr,
    onChange,
}) => {
    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/5 pb-3">
                <Mic className="text-emerald-400" size={18} />
                <span>مؤدو الأصوات (الأداء الصوتي والدبلجة)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                        🇯🇵 مؤدي الصوت الياباني (Seiyuu)
                    </label>
                    <input
                        type="text"
                        name="voiceActorJa"
                        placeholder="مثال: مينامي تاكاياما / تاكيشي كوساو"
                        value={voiceActorJa || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">
                        🎙️ مؤدي الصوت بالدبلجة العربية
                    </label>
                    <input
                        type="text"
                        name="voiceActorAr"
                        placeholder="مثال: آمال سعد الدين / عادل أبو حسون"
                        value={voiceActorAr || ""}
                        onChange={onChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
};
