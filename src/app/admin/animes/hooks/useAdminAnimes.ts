import { useState, useEffect, useMemo, useCallback } from "react";
import { Anime } from "@/types";

export type AnimeFilterType = "all" | "tv" | "movie" | "featured" | "ongoing" | "completed";
export type AnimeSortType = "recent" | "title" | "episodes";

export function useAdminAnimes() {
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<AnimeFilterType>("all");
    const [sortBy, setSortBy] = useState<AnimeSortType>("recent");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAnimes = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/animes");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAnimes(data);
            } else if (data?.animes && Array.isArray(data.animes)) {
                setAnimes(data.animes);
            }
        } catch (err) {
            console.error("Failed to load animes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnimes();
    }, [fetchAnimes]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف "${title}"؟ سيتم حذف جميع حلقاته وسيرفرات البث المرتبطة به نهائياً!`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/animes/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAnimes(prev => prev.filter(a => a.id !== id));
            } else {
                alert("حدث خطأ أثناء محاولة الحذف، يرجى المحاولة لاحقاً.");
            }
        } catch (error) {
            console.error("Error deleting anime:", error);
            alert("فشل الاتصال بالخادم.");
        } finally {
            setDeletingId(null);
        }
    };

    // Filter and sort animes
    const filteredAnimes = useMemo(() => {
        return animes.filter(anime => {
            // Text search
            const q = searchQuery.toLowerCase().trim();
            const matchesQuery = !q || 
                anime.title?.toLowerCase().includes(q) || 
                anime.description?.toLowerCase().includes(q) ||
                (Array.isArray(anime.genres) && anime.genres.some(g => g.toLowerCase().includes(q)));

            if (!matchesQuery) return false;

            // Category filter
            if (selectedFilter === "featured") return !!anime.isFeatured;
            if (selectedFilter === "tv") return anime.type?.toLowerCase().includes("tv") || anime.type?.includes("مسلسل");
            if (selectedFilter === "movie") return anime.type?.toLowerCase().includes("movie") || anime.type?.includes("فيلم");
            if (selectedFilter === "ongoing") return anime.status?.toLowerCase() === "ongoing" || anime.status === "مستمر";
            if (selectedFilter === "completed") return anime.status?.toLowerCase() === "completed" || anime.status === "مكتمل";

            return true;
        }).sort((a, b) => {
            if (sortBy === "title") return (a.title || "").localeCompare(b.title || "", "ar");
            if (sortBy === "episodes") return (Number(b.totalEpisodes) || 0) - (Number(a.totalEpisodes) || 0);
            return 0; // default order as returned (updatedAt desc)
        });
    }, [animes, searchQuery, selectedFilter, sortBy]);

    // Summary counts
    const counts = useMemo(() => {
        const total = animes.length;
        const tv = animes.filter(a => a.type?.toLowerCase().includes("tv") || a.type?.includes("مسلسل")).length;
        const movies = animes.filter(a => a.type?.toLowerCase().includes("movie") || a.type?.includes("فيلم")).length;
        const featured = animes.filter(a => a.isFeatured).length;
        const ongoing = animes.filter(a => a.status?.toLowerCase() === "ongoing" || a.status === "مستمر").length;
        return { total, tv, movies, featured, ongoing };
    }, [animes]);

    return {
        animes,
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
        refetch: fetchAnimes
    };
}
