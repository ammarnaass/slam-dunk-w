import { useState, useEffect, useMemo, useCallback } from "react";
import { Character, Anime } from "@/types";

export function useAdminCharacters() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnime, setSelectedAnime] = useState<string>("all");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [charsRes, animesRes] = await Promise.all([
                fetch("/api/characters"),
                fetch("/api/admin/animes").catch(() => fetch("/api/animes")),
            ]);

            const charsData = await charsRes.json();
            if (Array.isArray(charsData)) {
                setCharacters(charsData);
            } else if (charsData?.characters && Array.isArray(charsData.characters)) {
                setCharacters(charsData.characters);
            }

            if (animesRes.ok) {
                const animesData = await animesRes.json();
                if (Array.isArray(animesData)) {
                    setAnimes(animesData);
                } else if (animesData?.items && Array.isArray(animesData.items)) {
                    setAnimes(animesData.items);
                }
            }
        } catch (error) {
            console.error("Failed to fetch characters or animes", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف الشخصية "${name}" نهائياً؟`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCharacters(prev => prev.filter((char) => char.id !== id));
            } else {
                alert("فشل حذف الشخصية");
            }
        } catch (error) {
            console.error("Failed to delete character", error);
        } finally {
            setDeletingId(null);
        }
    };

    const animeMap = useMemo(() => {
        const map = new Map<string, Anime>();
        animes.forEach(a => map.set(a.id, a));
        return map;
    }, [animes]);

    const filteredCharacters = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        return characters.filter((char) => {
            // Anime Filter
            if (selectedAnime !== "all") {
                if (char.animeId !== selectedAnime) return false;
            }

            // Role Filter
            if (selectedRole !== "all") {
                const roleLower = (char.role || "").toLowerCase();
                if (!roleLower.includes(selectedRole.toLowerCase())) return false;
            }

            // Search query
            if (!q) return true;
            return (
                (char.name_ar || "").toLowerCase().includes(q) ||
                (char.name || "").toLowerCase().includes(q) ||
                (char.name_en || "").toLowerCase().includes(q) ||
                (char.name_jp || "").toLowerCase().includes(q) ||
                (char.team || "").toLowerCase().includes(q) ||
                (char.role || "").toLowerCase().includes(q) ||
                (char.description || "").toLowerCase().includes(q)
            );
        });
    }, [characters, searchTerm, selectedAnime, selectedRole]);

    // Unique animes represented in characters
    const uniqueAnimeCount = useMemo(() => {
        const set = new Set<string>();
        characters.forEach(c => {
            if (c.animeId) set.add(c.animeId);
        });
        return set.size;
    }, [characters]);

    return {
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
        refetch: loadData,
    };
}
