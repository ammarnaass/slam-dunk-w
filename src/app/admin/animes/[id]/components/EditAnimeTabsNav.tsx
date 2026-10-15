interface EditAnimeTabsNavProps {
    activeTab: "details" | "episodes";
    onTabChange: (tab: "details" | "episodes") => void;
    episodesCount: number;
}

export function EditAnimeTabsNav({
    activeTab,
    onTabChange,
    episodesCount,
}: EditAnimeTabsNavProps) {
    return (
        <div className="flex border-b border-slate-800 mb-6">
            <button
                onClick={() => onTabChange("details")}
                className={`px-6 py-3 font-bold transition-colors cursor-pointer ${
                    activeTab === 'details' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'
                }`}
            >
                تفاصيل العمل
            </button>
            <button
                onClick={() => onTabChange("episodes")}
                className={`px-6 py-3 font-bold transition-colors cursor-pointer ${
                    activeTab === 'episodes' ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-white'
                }`}
            >
                الحلقات ({episodesCount})
            </button>
        </div>
    );
}
