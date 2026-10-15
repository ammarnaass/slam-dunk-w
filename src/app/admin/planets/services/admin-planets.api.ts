import { AdminPlanetItem, PlanetsSettingsConfig } from "@/lib/planets-presets";
import { Anime } from "@/types";

export const adminPlanetsApi = {
    async fetchPlanets() {
        const res = await fetch("/api/admin/planets");
        if (!res.ok) throw new Error("تعذر جلب بيانات الكواكب من الخادم.");
        const json = await res.json();
        return json.data || json;
    },

    async saveSettings(settings: PlanetsSettingsConfig) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "save-settings", settings }),
        });
        if (!res.ok) throw new Error("تعذر حفظ إعدادات نمط العرض.");
        return await res.json();
    },

    async togglePlanet(planetId: string) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggle", planetId }),
        });
        if (!res.ok) throw new Error("تعذر تحديث حالة الكوكب.");
        return await res.json();
    },

    async saveOrder(planets: AdminPlanetItem[]) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "save-all", planets }),
        });
        if (!res.ok) throw new Error("تعذر حفظ ترتيب الكواكب.");
        return await res.json();
    },

    async resetDefaults() {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "reset" }),
        });
        if (!res.ok) throw new Error("فشلت استعادة الإعدادات الافتراضية.");
        return await res.json();
    },

    async updatePlanet(planet: AdminPlanetItem) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", planet }),
        });
        if (!res.ok) throw new Error("تعذر حفظ التعديلات.");
        return await res.json();
    },

    async createPlanet(planet: AdminPlanetItem) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create", planet }),
        });
        if (!res.ok) throw new Error("حدث خطأ أثناء إضافة الكوكب الجديد.");
        return await res.json();
    },

    async deletePlanet(planetId: string) {
        const res = await fetch("/api/admin/planets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", planetId }),
        });
        if (!res.ok) throw new Error("تعذر حذف الكوكب.");
        return await res.json();
    },

    async fetchPlanetAnimes(planet: AdminPlanetItem): Promise<Anime[]> {
        const res = await fetch("/api/animes");
        if (!res.ok) return [];
        const all: Anime[] = await res.json();
        const pGenre = (planet.genreKey || "").toLowerCase();
        const pArabic = (planet.arabicGenre || "").toLowerCase();
        const pFlagship = (planet.flagshipWorks || []).map((f) => f.toLowerCase());

        return all.filter((a) => {
            const title = (a.title || "").toLowerCase();
            const genres = (a.genres || []).map((g) => g.toLowerCase());
            return (
                genres.includes(pGenre) ||
                genres.includes(pArabic) ||
                pFlagship.some((fw) => title.includes(fw))
            );
        });
    },
};
