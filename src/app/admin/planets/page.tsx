"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
    Compass, 
    Plus, 
    RotateCcw, 
    ExternalLink, 
    Loader2, 
    Tv, 
    Search, 
    Layers, 
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { Anime } from "@/types";
import { EditPlanetModal } from "./components/EditPlanetModal";
import { CreatePlanetModal } from "./components/CreatePlanetModal";
import { ViewPlanetAnimesModal } from "./components/ViewPlanetAnimesModal";
import { PlanetCardItem } from "./components/PlanetCardItem";

export default function AdminPlanetsPage() {
    const [planets, setPlanets] = useState<Array<AdminPlanetItem & { worksCount?: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modals state
    const [editingPlanet, setEditingPlanet] = useState<AdminPlanetItem | null>(null);
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
                setPlanets(json.data || json);
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

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24" dir="rtl">
            {/* Toast Alert Notification */}
            {toast && (
                <div className={`fixed top-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                    toast.type === "success" 
                        ? "bg-[#112211]/90 border-emerald-500/30 text-emerald-300 shadow-emerald-950/40" 
                        : "bg-[#221111]/90 border-red-500/30 text-red-300 shadow-red-950/40"
                }`}>
                    {toast.type === "success" ? <CheckCircle2 size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
                    <span className="font-tajawal text-xs font-bold">{toast.message}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-red-600 to-purple-600 p-0.5 shadow-xl shadow-red-950/40 shrink-0">
                        <div className="w-full h-full bg-[#131317] rounded-[14px] flex items-center justify-center text-amber-400">
                            <Compass size={28} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="font-cairo font-black text-2xl text-white">إدارة كواكب الأنمي وسبيستون</h1>
                            <span className="px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                                Cosmic Universe CMS
                            </span>
                        </div>
                        <p className="font-tajawal text-xs sm:text-sm text-[#94a3b8] mt-1">
                            تحكم في عوالم وتصنيفات الكواكب (رياضة، أكشن، مغامرات، زمردة، كوميديا...)، وإدارتها وتخصيص ظهورها على الصفحة الرئيسية وصفحة الكواكب.
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#e4e1e7] border border-white/[0.08] transition-all cursor-pointer"
                        title="استعادة كواكب سبيستون الأصلية"
                    >
                        <RotateCcw size={15} className="text-amber-400" />
                        <span>استعادة الافتراضي</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>إضافة كوكب جديد</span>
                    </button>

                    <Link
                        href="/planets"
                        target="_blank"
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1b1b22] hover:bg-[#252530] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white border border-white/5 transition-all"
                    >
                        <ExternalLink size={14} />
                        <span>عرض صفحة الكواكب</span>
                    </Link>
                </div>
            </div>

            {/* Quick KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                    <div>
                        <span className="font-tajawal text-xs text-[#94a3b8] font-bold">إجمالي الكواكب المتاحة</span>
                        <h3 className="font-cairo font-black text-2xl text-white mt-1">{totalPlanets} كواكب</h3>
                        <span className="text-[11px] text-amber-400/80 font-mono mt-0.5 block">10 كواكب نوستالجيا سبيستون</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Compass size={24} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                    <div>
                        <span className="font-tajawal text-xs text-[#94a3b8] font-bold">الكواكب المفعلة حالياً</span>
                        <h3 className="font-cairo font-black text-2xl text-emerald-400 mt-1">{activePlanets} كوكب</h3>
                        <span className="text-[11px] text-emerald-500/80 font-mono mt-0.5 block">ظاهرة للمشاهدين على الموقع</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 size={24} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                    <div>
                        <span className="font-tajawal text-xs text-[#94a3b8] font-bold">إجمالي الأعمال المصنفة</span>
                        <h3 className="font-cairo font-black text-2xl text-white mt-1">{totalClassifiedWorks} عمل</h3>
                        <span className="text-[11px] text-[#ffb4ab] font-mono mt-0.5 block">مرتبطة بتصنيفات الكواكب</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#ffb4ab]">
                        <Tv size={24} />
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#131317] border border-white/[0.08] flex items-center justify-between">
                    <div>
                        <span className="font-tajawal text-xs text-[#94a3b8] font-bold">الرابط المباشر في الرئيسية</span>
                        <h3 className="font-cairo font-black text-base text-white mt-1">قسم كواكب الأنمي</h3>
                        <Link href="/admin/settings?tab=home" className="text-[11px] text-red-400 hover:underline font-cairo font-bold mt-0.5 block">
                            تخصيص ترتيب القسم ↗
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Layers size={24} />
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-[#131317] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن كوكب بالاسم، التصنيف، الشعار..."
                        className="w-full bg-[#1b1b22] border border-white/5 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-[#94a3b8]/60 focus:outline-none focus:border-red-500 font-tajawal"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94a3b8] font-cairo font-bold">الحالة:</span>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("all")}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                            filterStatus === "all" ? "bg-red-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        الكل ({planets.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("active")}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                            filterStatus === "active" ? "bg-emerald-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        النشطة ({activePlanets})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("inactive")}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                            filterStatus === "inactive" ? "bg-red-950 text-red-300" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        المعطلة ({totalPlanets - activePlanets})
                    </button>
                </div>
            </div>

            {/* Planets Grid */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-center">
                    <Loader2 className="animate-spin text-amber-500" size={32} />
                    <span className="font-cairo text-sm text-[#94a3b8]">جاري تحميل كواكب الأنمي والأعمال المصنفة...</span>
                </div>
            ) : filteredPlanets.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[#131317] border border-white/[0.08]">
                    <Compass size={40} className="mx-auto text-[#94a3b8]/40 mb-3" />
                    <h3 className="font-cairo font-bold text-white text-base">لا توجد كواكب مطابقة لبحثك</h3>
                    <p className="font-tajawal text-xs text-[#94a3b8] mt-1">جرب تغيير معايير البحث أو استعادة الكواكب الافتراضية.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlanets.map((planet, idx) => (
                        <PlanetCardItem
                            key={planet.id}
                            planet={planet}
                            index={idx}
                            totalPlanets={planets.length}
                            onToggleEnabled={handleToggleEnabled}
                            onMoveOrder={handleMoveOrder}
                            onEdit={setEditingPlanet}
                            onOpenAnimes={handleOpenAnimesModal}
                            onDelete={handleDeletePlanet}
                        />
                    ))}
                </div>
            )}

            {/* Modal: Edit Planet */}
            <EditPlanetModal
                planet={editingPlanet}
                isOpen={!!editingPlanet}
                onClose={() => setEditingPlanet(null)}
                onSave={handleSaveEdit}
                saving={saving}
            />

            {/* Modal: Create Planet */}
            <CreatePlanetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePlanet}
                saving={saving}
            />

            {/* Modal: View Associated Animes */}
            <ViewPlanetAnimesModal
                planet={viewingAnimesPlanet}
                onClose={() => setViewingAnimesPlanet(null)}
                animesList={animesList}
                loading={loadingAnimes}
            />
        </div>
    );
}
