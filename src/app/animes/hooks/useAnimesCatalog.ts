"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Anime } from "@/types";
import { SPACETOON_PLANETS, GENRE_MAPPING } from "../constants/animes-catalog.constants";

export type AnimeSortBy = "latest" | "rating" | "episodes" | "year";

export function useAnimesCatalog() {
    const searchParams = useSearchParams();
    const urlGenre = searchParams.get("genre") || searchParams.get("planet") || "";
    const urlSearch = searchParams.get("q") || searchParams.get("search") || "";

    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [selectedPlanet, setSelectedPlanet] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [sortBy, setSortBy] = useState<AnimeSortBy>("latest");

    // Sync URL query params with state
    useEffect(() => {
        if (urlGenre) {
            const lower = urlGenre.trim().toLowerCase();
            const matched = SPACETOON_PLANETS.find(p => 
                p.genre.toLowerCase() === lower ||
                p.name.toLowerCase().includes(lower) ||
                (GENRE_MAPPING[p.genre] && GENRE_MAPPING[p.genre].toLowerCase() === lower)
            );
            if (matched) {
                setSelectedPlanet(matched.genre);
            } else {
                setSelectedPlanet(urlGenre);
            }
        }
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
    }, [urlGenre, urlSearch]);

    useEffect(() => {
        fetch("/api/animes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAnimes(data);
                } else {
                    setAnimes([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching animes:", err);
                setLoading(false);
            });
    }, []);

    // Filter and Sort Logic
    const filteredAnimes = useMemo(() => {
        return animes
            .filter(anime => {
                // Search filter
                const query = searchQuery.trim().toLowerCase();
                const matchesSearch = !query || 
                    anime.title.toLowerCase().includes(query) ||
                    (anime.description && anime.description.toLowerCase().includes(query)) ||
                    (anime.genres && anime.genres.some(g => {
                        const ar = GENRE_MAPPING[g] || g;
                        return ar.toLowerCase().includes(query) || g.toLowerCase().includes(query);
                    }));

                // Planet/Genre filter
                const matchesPlanet = selectedPlanet === "all" || (anime.genres && anime.genres.some(g => {
                    return g.toLowerCase() === selectedPlanet.toLowerCase() || 
                           GENRE_MAPPING[g]?.toLowerCase() === selectedPlanet.toLowerCase();
                }));

                // Status filter
                const isCompleted = anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";
                const matchesStatus = 
                    selectedStatus === "all" ||
                    (selectedStatus === "completed" && isCompleted) ||
                    (selectedStatus === "ongoing" && !isCompleted);

                return matchesSearch && matchesPlanet && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "rating") {
                    return (b.rating || 0) - (a.rating || 0);
                }
                if (sortBy === "episodes") {
                    return (b.totalEpisodes || 0) - (a.totalEpisodes || 0);
                }
                if (sortBy === "year") {
                    return (b.releaseYear || 0) - (a.releaseYear || 0);
                }
                return 0; // default latest
            });
    }, [animes, searchQuery, selectedPlanet, selectedStatus, sortBy]);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedPlanet("all");
        setSelectedStatus("all");
        setSortBy("latest");
    };

    const hasActiveFilters = Boolean(
        searchQuery || selectedPlanet !== "all" || selectedStatus !== "all" || sortBy !== "latest"
    );

    return {
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
    };
}
