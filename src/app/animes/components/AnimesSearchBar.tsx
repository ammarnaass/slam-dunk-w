import { RECENT_SEARCHES } from "../constants/animes-catalog.constants";

interface AnimesSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectPlanet: (planet: string) => void;
}

export function AnimesSearchBar({
    searchQuery,
    onSearchChange,
    onSelectPlanet,
}: AnimesSearchBarProps) {
    return (
        <div className="flex flex-col gap-3.5">
            {/* Search Input Box */}
            <div className="relative w-full">
                <div className="relative flex items-center bg-surface-container-low rounded-2xl border border-white/[0.08] shadow-lg focus-within:border-primary-container focus-within:shadow-[0_0_24px_rgba(220,38,38,0.3)] min-h-[50px] sm:min-h-[54px] transition-all">
                    <div className="pr-3.5 sm:pr-4 pl-2 flex items-center pointer-events-none text-on-surface-variant shrink-0">
                        <span className="material-symbols-outlined text-[22px]">search</span>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="ابحث بالاسم، الكوكب، أو التصنيف..."
                        className="w-full bg-transparent py-3 sm:py-3.5 pr-1 pl-12 text-base sm:text-sm font-tajawal text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute left-1.5 sm:left-2 w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-xl bg-surface-container-high/90 text-on-surface-variant hover:text-on-surface active:scale-95 transition-all cursor-pointer"
                            title="مسح"
                            aria-label="مسح البحث"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Searches Tags Ribbon */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x -mt-1 pb-0.5 text-xs">
                <span className="text-on-surface-variant shrink-0 flex items-center gap-1 font-tajawal px-1 text-xs">
                    <span className="material-symbols-outlined text-[15px] text-primary">trending_up</span>
                    <span className="font-bold">شائع:</span>
                </span>
                {RECENT_SEARCHES.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                            if (item.genre) {
                                onSelectPlanet(item.genre);
                            } else if (item.query) {
                                onSearchChange(item.query);
                            }
                        }}
                        className="inline-flex items-center px-3 py-1.5 min-h-[36px] rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-tajawal whitespace-nowrap border border-white/5 active:scale-95 transition-all cursor-pointer"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
