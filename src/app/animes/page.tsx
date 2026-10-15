"use client";

import { Suspense } from "react";
import { useAnimesCatalog } from "./hooks/useAnimesCatalog";
import {
    AnimesCatalogHeader,
    AnimesSearchBar,
    AnimesPlanetsRibbon,
    AnimesFilterControls,
    AnimesCatalogGrid,
} from "./components";

function AnimesListContent() {
    const {
        animes,
        loading,
        searchQuery,
        setSearchQuery,
        selectedPlanet,
        setSelectedPlanet,
        selectedStatus,
        setSelectedStatus,
        sortBy,
        setSortBy,
        filteredAnimes,
        resetFilters,
        hasActiveFilters,
    } = useAnimesCatalog();

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md pt-20 sm:pt-24 pb-12 sm:pb-20">
            {/* Top Atmospheric Glow */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header Banner Section */}
                <AnimesCatalogHeader
                    loading={loading}
                    totalCount={animes.length}
                />

                {/* Main Search & Filters Bar */}
                <div className="py-4 sm:py-6 flex flex-col gap-3.5 sm:gap-5">
                    <AnimesSearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSelectPlanet={setSelectedPlanet}
                    />

                    <AnimesPlanetsRibbon
                        selectedPlanet={selectedPlanet}
                        onSelectPlanet={setSelectedPlanet}
                    />

                    <AnimesFilterControls
                        selectedStatus={selectedStatus}
                        onSelectStatus={setSelectedStatus}
                        sortBy={sortBy}
                        onSelectSortBy={setSortBy}
                        onReset={resetFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Anime Cards Grid */}
                <AnimesCatalogGrid
                    loading={loading}
                    animes={filteredAnimes}
                    onReset={resetFilters}
                />
            </div>
        </div>
    );
}

export default function AnimesListPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface-container-lowest text-on-surface flex items-center justify-center font-cairo">
                جاري تحميل مكتبة الأنمي...
            </div>
        }>
            <AnimesListContent />
        </Suspense>
    );
}
