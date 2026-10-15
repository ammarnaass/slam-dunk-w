import Link from "next/link";
import { ExternalLink, Pencil, Trash2, Loader2, Sparkles } from "lucide-react";
import { Character, Anime } from "@/types";

interface CharactersAdminRowProps {
    char: Character;
    linkedAnime?: Anime | null;
    isDeleting: boolean;
    onDelete: (id: string, name: string) => void;
}

export default function CharactersAdminRow({
    char,
    linkedAnime,
    isDeleting,
    onDelete,
}: CharactersAdminRowProps) {
    const charAny = char as any;

    return (
        <tr className="hover:bg-slate-800/40 transition-colors group">
            {/* Character Info */}
            <td className="p-4 pr-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                        <img
                            src={char.image || "/hero-bg.jpg"}
                            alt={char.name_ar || char.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <div>
                        <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                            {char.name_ar || char.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            {char.name_en && (
                                <span className="text-[11px] text-slate-400 font-mono">
                                    {char.name_en}
                                </span>
                            )}
                            {char.name_jp && (
                                <span className="text-[10px] text-slate-500 font-light">
                                    • {char.name_jp}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Anime & Planet */}
            <td className="p-4">
                {linkedAnime ? (
                    <div className="flex flex-col gap-1 items-start">
                        <span className="font-bold text-white text-xs">
                            {linkedAnime.title}
                        </span>
                        {linkedAnime.planet && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                                <Sparkles size={10} />
                                <span>كوكب {linkedAnime.planet}</span>
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-slate-500 text-xs">
                        {char.animeId ? char.animeId : "غير محدد"}
                    </span>
                )}
            </td>

            {/* Role & Affiliation */}
            <td className="p-4">
                <div className="flex flex-col gap-1 items-start">
                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/20 text-red-300 font-semibold text-[11px]">
                        {char.role || "شخصية رئيسية"}
                    </span>
                    {char.team && (
                        <span className="text-[11px] text-slate-400">
                            {char.team}
                        </span>
                    )}
                    {char.number && (
                        <span className="text-[10px] text-slate-500 font-mono">
                            #{char.number}
                        </span>
                    )}
                </div>
            </td>

            {/* Voice Actors */}
            <td className="p-4">
                <div className="flex flex-col gap-0.5 text-[11px]">
                    {charAny.voiceActorJa ? (
                        <span className="text-slate-300 truncate max-w-[180px]" title={charAny.voiceActorJa}>
                            🇯🇵 {charAny.voiceActorJa}
                        </span>
                    ) : (
                        <span className="text-slate-500">🇯🇵 أصلي</span>
                    )}
                    {charAny.voiceActorAr ? (
                        <span className="text-amber-400/90 truncate max-w-[180px]" title={charAny.voiceActorAr}>
                            🎙️ {charAny.voiceActorAr}
                        </span>
                    ) : (
                        <span className="text-slate-500">🎙️ دبلجة</span>
                    )}
                </div>
            </td>

            {/* Actions */}
            <td className="p-4 pl-6 text-left">
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={`/characters/${char.id}`}
                        target="_blank"
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="معاينة في الموقع"
                    >
                        <ExternalLink size={14} />
                    </Link>

                    <Link
                        href={`/admin/characters/${char.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors text-xs"
                        title="تعديل الشخصية"
                    >
                        <Pencil size={13} />
                        <span>تعديل</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => onDelete(char.id, char.name_ar || char.name)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/30 disabled:opacity-50 cursor-pointer"
                        title="حذف الشخصية"
                    >
                        {isDeleting ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Trash2 size={15} />
                        )}
                    </button>
                </div>
            </td>
        </tr>
    );
}
