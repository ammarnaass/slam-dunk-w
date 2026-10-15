"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PlanetsCosmicHero } from "./components/PlanetsCosmicHero";
import { PlanetsMatrixGrid } from "./components/PlanetsMatrixGrid";
import { PlanetsControlsBar } from "./components/PlanetsControlsBar";
import { PlanetAnimeGrid } from "./components/PlanetAnimeGrid";
import { PlanetsTropesCloud } from "./components/PlanetsTropesCloud";
import { PlanetsViewModeToggle } from "./components/PlanetsViewModeToggle";
import { usePlanetsPage } from "./hooks/usePlanetsPage";

const Spacetoon3DPlanetarium = dynamic(
  () => import("./components/Spacetoon3DPlanetarium").then((mod) => mod.Spacetoon3DPlanetarium),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl bg-[#0d0d15] border border-amber-500/20 flex flex-col items-center justify-center gap-3 text-amber-300 font-cairo">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <span className="text-sm">جاري محاكاة مدار كواكب سبيستون ثلاثي الأبعاد 3D...</span>
      </div>
    ),
  }
);

function PlanetsContent() {
  const {
    selectedPlanetId,
    adminPlanets,
    viewMode,
    dbAnimes,
    loading,
    searchQuery,
    setSearchQuery,
    activeFilterChip,
    setActiveFilterChip,
    activeTropeQuery,
    setActiveTropeQuery,
    sortBy,
    setSortBy,
    handleToggleViewMode,
    handleSelectPlanet,
    activePlanetName,
    displayedWorks,
  } = usePlanetsPage();

  return (
    <div
      className="min-h-screen bg-[#0b0b0f] text-[#e4e1e7] selection:bg-[#dc2626] selection:text-white relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Cosmic Breadcrumb & Hero Header */}
        <PlanetsCosmicHero totalWorks={dbAnimes.length} />

        {/* View Mode Toggle: 3D Spacetoon vs 2D Normal Grid */}
        <PlanetsViewModeToggle
          viewMode={viewMode}
          onChangeViewMode={handleToggleViewMode}
        />

        {/* Section 2: Celestial 3D Orbit OR Interactive Planet Matrix Grid */}
        {viewMode === "3d" ? (
          <Spacetoon3DPlanetarium
            planets={adminPlanets}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
          />
        ) : (
          <PlanetsMatrixGrid
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
            animes={dbAnimes}
          />
        )}

        {/* Anchor for smooth scrolling from 3D HUD */}
        <div id="planet-animes-section" className="scroll-mt-20" />

        {/* Section 3: Active Planet Controls Bar (Search, Chips, Sort) */}
        <PlanetsControlsBar
          activePlanetName={activePlanetName}
          worksCount={displayedWorks.length}
          activeFilterChip={activeFilterChip}
          onSelectFilterChip={setActiveFilterChip}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Section 4: 2:3 Vertical Aspect Poster Cards Grid */}
        <PlanetAnimeGrid works={displayedWorks} loading={loading} />

        {/* Section 5: Narrative Tropes & Micro-Categories Cloud */}
        <PlanetsTropesCloud
          activeTropeQuery={activeTropeQuery}
          onSelectTrope={setActiveTropeQuery}
          animes={dbAnimes}
        />
      </div>
    </div>
  );
}

export default function PlanetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-white font-cairo">
          جاري تحميل مدار الكواكب...
        </div>
      }
    >
      <PlanetsContent />
    </Suspense>
  );
}
