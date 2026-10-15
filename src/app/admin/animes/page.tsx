"use client";

import { Loader2 } from "lucide-react";
import { useAdminAnimes } from "./hooks/useAdminAnimes";
import AnimeAdminHeader from "./components/AnimeAdminHeader";
import AnimeAdminFilterBar from "./components/AnimeAdminFilterBar";
import AnimeAdminCard from "./components/AnimeAdminCard";
import AnimeAdminEmptyState from "./components/AnimeAdminEmptyState";

export default function AnimesPage() {
    const {
        filteredAnimes,
        loading,
        searchQuery,
        setSearchQuery,
        selectedFilter,
        setSelectedFilter,
        sortBy,
        setSortBy,
        deletingId,
        handleDelete,
        counts,
    } = useAdminAnimes();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-9 h-9 animate-spin text-red-600" />
                <p className="text-sm font-medium text-slate-400">جاري تحميل قائمة الأعمال...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <AnimeAdminHeader counts={counts} />

            {/* Filter and Search Bar */}
            <AnimeAdminFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                counts={counts}
            />

            {/* Empty State */}
            {filteredAnimes.length === 0 ? (
                <AnimeAdminEmptyState
                    searchQuery={searchQuery}
                    onResetFilters={() => {
                        setSearchQuery("");
                        setSelectedFilter("all");
                    }}
                />
            ) : (
                /* Anime Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredAnimes.map((anime) => (
                        <AnimeAdminCard
                            key={anime.id}
                            anime={anime}
                            isDeleting={deletingId === anime.id}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
