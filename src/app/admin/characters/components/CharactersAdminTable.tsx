import { Users } from "lucide-react";
import { Character, Anime } from "@/types";
import CharactersAdminRow from "./CharactersAdminRow";

interface CharactersAdminTableProps {
    characters: Character[];
    animeMap: Map<string, Anime>;
    deletingId: string | null;
    onDelete: (id: string, name: string) => void;
}

export default function CharactersAdminTable({
    characters,
    animeMap,
    deletingId,
    onDelete,
}: CharactersAdminTableProps) {
    return (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800/80">
                        <tr>
                            <th className="p-4 pr-6 font-semibold">الشخصية</th>
                            <th className="p-4 font-semibold">العمل التابع له</th>
                            <th className="p-4 font-semibold">الدور والانتماء</th>
                            <th className="p-4 font-semibold">الأداء الصوتي</th>
                            <th className="p-4 pl-6 text-left font-semibold">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {characters.map((char) => (
                            <CharactersAdminRow
                                key={char.id}
                                char={char}
                                linkedAnime={char.animeId ? animeMap.get(char.animeId) : null}
                                isDeleting={deletingId === char.id}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {characters.length === 0 && (
                <div className="p-12 text-center text-slate-400 space-y-2">
                    <Users size={32} className="mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-bold text-white">لا توجد شخصيات مطابقة لمعايير البحث</p>
                    <p className="text-xs text-slate-500">جرب اختيار عمل آخر أو مسح كلمة البحث.</p>
                </div>
            )}
        </div>
    );
}
