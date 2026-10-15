import { SPACETOON_PLANETS } from "../constants/animes-catalog.constants";

interface AnimesPlanetsRibbonProps {
    selectedPlanet: string;
    onSelectPlanet: (planet: string) => void;
}

export function AnimesPlanetsRibbon({
    selectedPlanet,
    onSelectPlanet,
}: AnimesPlanetsRibbonProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1">
            {SPACETOON_PLANETS.map((planet) => {
                const isSelected = selectedPlanet === planet.genre;
                return (
                    <button
                        key={planet.name}
                        onClick={() => onSelectPlanet(planet.genre)}
                        className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-cairo font-bold transition-all whitespace-nowrap cursor-pointer border active:scale-95 ${
                            isSelected
                                ? "bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_16px_rgba(220,38,38,0.45)]"
                                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-white/5"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {planet.icon}
                        </span>
                        <span>{planet.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
