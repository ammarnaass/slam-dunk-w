"use client";

import { useState, useEffect, useRef } from "react";

export interface SearchAnimeItem {
    id: string;
    title: string;
    coverImage: string;
    type?: string;
    totalEpisodes?: number;
    rating?: number | string;
}

export interface SearchCharacterItem {
    id: string;
    name: string;
    image: string;
    team?: string;
    role?: string;
}

export interface SearchEpisodeItem {
    id: string;
    title: string;
    thumbnail?: string;
    episodeNumber?: number;
    episode_number?: number;
    animeTitle?: string;
}

export interface SearchResults {
    animes: SearchAnimeItem[];
    episodes: SearchEpisodeItem[];
    characters: SearchCharacterItem[];
}

interface UseSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function useSearchModal({ isOpen, onClose }: UseSearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults>({ animes: [], episodes: [], characters: [] });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input and lock scroll
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Live search query effect with debounce
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults({ animes: [], episodes: [], characters: [] });
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults({
                        animes: Array.isArray(data?.animes) ? data.animes : [],
                        episodes: Array.isArray(data?.episodes) ? data.episodes : [],
                        characters: Array.isArray(data?.characters) ? data.characters : []
                    });
                } else {
                    setResults({ animes: [], episodes: [], characters: [] });
                }
            } catch (error) {
                console.error("Search modal error:", error);
                setResults({ animes: [], episodes: [], characters: [] });
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [query]);

    const handleLinkClick = () => {
        onClose();
        setQuery("");
    };

    const hasResults =
        results.animes.length > 0 ||
        results.episodes.length > 0 ||
        results.characters.length > 0;

    return {
        query,
        setQuery,
        results,
        loading,
        inputRef,
        hasResults,
        handleLinkClick,
    };
}
