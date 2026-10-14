"use client";

import { useState, useEffect, useMemo } from "react";
import { AdminPlanetItem, PlanetsSettingsConfig, DEFAULT_PLANETS_SETTINGS } from "@/lib/planets-presets";
import { Anime } from "@/types";

export interface PlanetWithWorks extends AdminPlanetItem {
    worksCount?: number;
}

export function useAdminPlanets() {
    const [planets, setPlanets] = useState<PlanetWithWorks[]>([]);
    const [settings, setSettings] = useState<PlanetsSettingsConfig>(DEFAULT_PLANETS_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modals state
    const [editingPlanet, setEditingPlanet] = useState<AdminPlanetItem | null>(null);
    const [preview3DPlanet, setPreview3DPlanet] = useState<AdminPlanetItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingAnimesPlanet, setViewingAnimesPlanet] = useState<AdminPlanetItem | null>(null);
    const [animesList, setAnimesList] = useState<Anime[]>([]);
    const [loadingAnimes, setLoadingAnimes] = useState(false);

    useEffect(() => {
        fetchPlanets();
    }, []);

    // Auto-dismiss toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchPlanets = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/planets");
            if (res.ok) {
                const json = await res.json();
                const payload = json.data || json;
                if (payload?.planets) {
                    setPlanets(payload.planets);
                    if (payload.settings) setSettings(payload.settings);
                } else if (Array.isArray(payload)) {
                    setPlanets(payload);
                }
            } else {
                setToast({ type: "error", message: "تعذر جلب بيانات الكواكب من الخادم." });
            }
        } catch (error) {
            console.error("Failed to fetch planets:", error);
            setToast({ type: "error", message: "حدث خطأ أثناء الاتصال بالنظام." });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (newSettings: PlanetsSettingsConfig) => {
        try {
            setSaving(true);
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "save-settings", settings: newSettings })
            });
            if (res.ok) {
                setSettings(newSettings);
                setToast({ type: "success", message: "تم حفظ وتطبيق إعدادات نمط عرض الكواكب بنجاح!" });
            }
        } catch (error) {
            console.error("Save settings error:", error);
            setToast({ type: "error", message: "تعذر حفظ إعدادات نمط العرض." });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEnabled = async (planetId: string) => {
        try {
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "toggle", planetId })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                const target = json.data.find((p: any) => p.id === planetId);
                setToast({ 
                    type: "success", 
                    message: target?.isEnabled ? `تم تفعيل ${target.name} بنجاح!` : `تم تعطيل ${target.name} وإخفاؤه من المنصة.` 
                });
            }
        } catch (error) {
            console.error("Toggle error:", error);
            setToast({ type: "error", message: "تعذر تحديث حالة الكوكب." });
        }
    };

    const handleMoveOrder = async (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= planets.length) return;

        const updated = [...planets];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
        setPlanets(reordered);

        try {
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "save-all", planets: reordered })
            });
            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setToast({ type: "success", message: "تم تحديث ترتيب الكواكب بنجاح!" });
            }
        } catch (error) {
            console.error("Order save error:", error);
        }
    };

    const handleResetDefaults = async () => {
        if (!confirm("هل أنت متأكد من رغبتك في استعادة كواكب سبيستون الرسمية الافتراضية؟")) return;

        try {
            setSaving(true);
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reset" })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setToast({ type: "success", message: "تمت استعادة كواكب سبيستون العشرة الافتراضية بنجاح!" });
            }
        } catch (error) {
            console.error("Reset error:", error);
            setToast({ type: "error", message: "فشلت استعادة الإعدادات الافتراضية." });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEdit = async (updatedPlanet: AdminPlanetItem) => {
        try {
            setSaving(true);
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update", planet: updatedPlanet })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setEditingPlanet(null);
                setToast({ type: "success", message: `تم حفظ تعديلات ${updatedPlanet.name} بنجاح!` });
            }
        } catch (error) {
            console.error("Save edit error:", error);
            setToast({ type: "error", message: "تعذر حفظ التعديلات." });
        } finally {
            setSaving(false);
        }
    };

    const handleCreatePlanet = async (planetPayload: AdminPlanetItem) => {
        try {
            setSaving(true);
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", planet: planetPayload })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setIsCreateModalOpen(false);
                setToast({ type: "success", message: `تمت إضافة ${planetPayload.name} بنجاح إلى المنصة!` });
            }
        } catch (error) {
            console.error("Create error:", error);
            setToast({ type: "error", message: "حدث خطأ أثناء إضافة الكوكب الجديد." });
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePlanet = async (planet: AdminPlanetItem) => {
        if (!confirm(`هل أنت متأكد من حذف ${planet.name} نهائياً؟`)) return;

        try {
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", planetId: planet.id })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setToast({ type: "success", message: `تم حذف ${planet.name} بنجاح.` });
            }
        } catch (error) {
            console.error("Delete error:", error);
            setToast({ type: "error", message: "تعذر حذف الكوكب." });
        }
    };

    const handleOpenAnimesModal = async (planet: AdminPlanetItem) => {
        setViewingAnimesPlanet(planet);
        setLoadingAnimes(true);
        try {
            const res = await fetch("/api/animes");
            if (res.ok) {
                const all: Anime[] = await res.json();
                const pGenre = (planet.genreKey || "").toLowerCase();
                const pArabic = (planet.arabicGenre || "").toLowerCase();
                const pFlagship = (planet.flagshipWorks || []).map(f => f.toLowerCase());

                const filtered = all.filter(a => {
                    const title = (a.title || "").toLowerCase();
                    const genres = (a.genres || []).map(g => g.toLowerCase());
                    return genres.includes(pGenre) || genres.includes(pArabic) || pFlagship.some(fw => title.includes(fw));
                });
                setAnimesList(filtered);
            }
        } catch (error) {
            console.error("Failed to load animes for planet:", error);
        } finally {
            setLoadingAnimes(false);
        }
    };

    // Filtered planets
    const filteredPlanets = useMemo(() => {
        return planets.filter(p => {
            const matchesSearch = 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.genreKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.arabicGenre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.slogan?.toLowerCase().includes(searchQuery.toLowerCase());

            if (filterStatus === "active") return matchesSearch && p.isEnabled;
            if (filterStatus === "inactive") return matchesSearch && !p.isEnabled;
            return matchesSearch;
        });
    }, [planets, searchQuery, filterStatus]);

    // Totals
    const totalPlanets = planets.length;
    const activePlanets = planets.filter(p => p.isEnabled).length;
    const totalClassifiedWorks = planets.reduce((acc, p) => acc + (p.worksCount || 0), 0);

    return {
        planets,
        settings,
        loading,
        saving,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        toast,
        filteredPlanets,
        totalPlanets,
        activePlanets,
        totalClassifiedWorks,
        // Modals
        editingPlanet,
        setEditingPlanet,
        preview3DPlanet,
        setPreview3DPlanet,
        isCreateModalOpen,
        setIsCreateModalOpen,
        viewingAnimesPlanet,
        setViewingAnimesPlanet,
        animesList,
        loadingAnimes,
        // Actions
        handleSaveSettings,
        handleToggleEnabled,
        handleMoveOrder,
        handleResetDefaults,
        handleSaveEdit,
        handleCreatePlanet,
        handleDeletePlanet,
        handleOpenAnimesModal,
    };
}
