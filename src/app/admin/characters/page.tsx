"use client";

import { Loader2 } from "lucide-react";
import { useAdminCharacters } from "./hooks/useAdminCharacters";
import CharactersAdminHeader from "./components/CharactersAdminHeader";
import CharactersAdminFilterBar from "./components/CharactersAdminFilterBar";
import CharactersAdminTable from "./components/CharactersAdminTable";

export default function CharactersAdmin() {
    const {
        characters,
        animes,
        loading,
        searchTerm,
        setSearchTerm,
        selectedAnime,
        setSelectedAnime,
        selectedRole,
        setSelectedRole,
        deletingId,
        handleDelete,
        animeMap,
        filteredCharacters,
        uniqueAnimeCount,
    } = useAdminCharacters();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[380px] gap-3">
                <Loader2 className="w-9 h-9 animate-spin text-red-600" />
                <p className="text-sm text-slate-400 font-medium">جاري تحميل موسوعة شخصيات ANIME DAZE...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <CharactersAdminHeader
                totalCharacters={characters.length}
                uniqueAnimeCount={uniqueAnimeCount}
            />

            {/* Filter and Search Bar */}
            <CharactersAdminFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedAnime={selectedAnime}
                onAnimeChange={setSelectedAnime}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                characters={characters}
                animes={animes}
            />

            {/* Characters Table */}
            <CharactersAdminTable
                characters={filteredCharacters}
                animeMap={animeMap}
                deletingId={deletingId}
                onDelete={handleDelete}
            />
        </div>
    );
}
