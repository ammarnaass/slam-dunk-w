"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
    Compass, 
    Sparkles, 
    Plus, 
    RotateCcw, 
    Check, 
    X, 
    ExternalLink, 
    Loader2, 
    Edit3, 
    Trash2, 
    ArrowUp, 
    ArrowDown, 
    Eye, 
    EyeOff, 
    Tv, 
    Search, 
    Filter, 
    Layers, 
    SlidersHorizontal,
    Star,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { AdminPlanetItem, DEFAULT_ADMIN_PLANETS } from "@/lib/planets-presets";
import { Anime } from "@/types";

export default function AdminPlanetsPage() {
    const [planets, setPlanets] = useState<Array<AdminPlanetItem & { worksCount?: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Modals
    const [editingPlanet, setEditingPlanet] = useState<AdminPlanetItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingAnimesPlanet, setViewingAnimesPlanet] = useState<AdminPlanetItem | null>(null);
    const [animesList, setAnimesList] = useState<Anime[]>([]);
    const [loadingAnimes, setLoadingAnimes] = useState(false);

    // New planet form state
    const [newPlanetForm, setNewPlanetForm] = useState<Partial<AdminPlanetItem>>({
        id: "",
        name: "",
        arabicGenre: "",
        genreKey: "Action",
        badge: "🪐",
        icon: "explore",
        slogan: "",
        description: "",
        color: "#dc2626",
        flagshipWorks: [],
        isEnabled: true
    });

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

        // Reassign order
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

    const handleSaveEdit = async () => {
        if (!editingPlanet) return;

        try {
            setSaving(true);
            const res = await fetch("/api/admin/planets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update", planet: editingPlanet })
            });

            if (res.ok) {
                const json = await res.json();
                setPlanets(json.data);
                setEditingPlanet(null);
                setToast({ type: "success", message: `تم حفظ تعديلات ${editingPlanet.name} بنجاح!` });
            }
        } catch (error) {
            console.error("Save edit error:", error);
            setToast({ type: "error", message: "تعذر حفظ التعديلات." });
        } finally {
            setSaving(false);
        }
    };

    const handleCreatePlanet = async () => {
        if (!newPlanetForm.name?.trim()) {
            alert("يرجى إدخال اسم الكوكب");
            return;
        }

        const id = newPlanetForm.id?.trim() || `planet-${Date.now()}`;
        const planetPayload: AdminPlanetItem = {
            id,
            name: newPlanetForm.name.trim(),
            arabicGenre: newPlanetForm.arabicGenre?.trim() || newPlanetForm.name.replace(/^كوكب\s*/, ""),
            genreKey: newPlanetForm.genreKey || "Action",
            badge: newPlanetForm.badge || "🪐",
            icon: newPlanetForm.icon || "explore",
            slogan: newPlanetForm.slogan || "كوكب المغامرات والبطولة",
            description: newPlanetForm.description || "رحلة لاكتشاف عوالم الأنمي الفريدة.",
            color: newPlanetForm.color || "#dc2626",
            bgClass: "bg-red-500/15 border-red-500/30 text-red-400",
            glowColor: "rgba(220, 38, 38, 0.4)",
            flagshipWorks: typeof newPlanetForm.flagshipWorks === "string" 
                ? (newPlanetForm.flagshipWorks as string).split(",").map(s => s.trim()).filter(Boolean)
                : (newPlanetForm.flagshipWorks || []),
            isEnabled: true,
            order: planets.length + 1,
            isCustom: true
        };

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
                setNewPlanetForm({
                    id: "",
                    name: "",
                    arabicGenre: "",
                    genreKey: "Action",
                    badge: "🪐",
                    icon: "explore",
                    slogan: "",
                    description: "",
                    color: "#dc2626",
                    flagshipWorks: [],
                    isEnabled: true
                });
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
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all ${
                            filterStatus === "all" ? "bg-red-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        الكل ({planets.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("active")}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all ${
                            filterStatus === "active" ? "bg-emerald-600 text-white" : "bg-white/[0.04] text-[#94a3b8] hover:text-white"
                        }`}
                    >
                        النشطة ({activePlanets})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterStatus("inactive")}
                        className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all ${
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
                        <div
                            key={planet.id}
                            className={`rounded-3xl bg-[#131317] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl ${
                                planet.isEnabled 
                                    ? "border-white/[0.08] hover:border-white/20" 
                                    : "border-red-950/40 opacity-60 bg-[#0e0e12]"
                            }`}
                        >
                            {/* Ambient Glow */}
                            <div 
                                className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity opacity-40 group-hover:opacity-75"
                                style={{ backgroundColor: planet.color || "#dc2626" }}
                            />

                            {/* Card Header */}
                            <div className="p-6 relative z-10 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3.5">
                                        {/* Large Emoji Badge */}
                                        <div 
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-105 shrink-0"
                                            style={{ 
                                                backgroundColor: `${planet.color}22`,
                                                border: `1px solid ${planet.color}44`
                                            }}
                                        >
                                            <span>{planet.badge || "🪐"}</span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-cairo font-black text-lg text-white group-hover:text-amber-400 transition-colors">
                                                    {planet.name}
                                                </h3>
                                                {planet.isCustom && (
                                                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-cairo text-[10px] font-bold">
                                                        مخصص
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] font-mono text-[#94a3b8]">/{planet.id}</span>
                                                <span className="text-white/20">•</span>
                                                <span className="text-[11px] font-cairo text-amber-400 font-bold">{planet.genreKey}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enable / Disable Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleEnabled(planet.id)}
                                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 shrink-0 ${
                                            planet.isEnabled ? "bg-emerald-500" : "bg-white/10"
                                        }`}
                                        title={planet.isEnabled ? "تعطيل الكوكب" : "تفعيل الكوكب"}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                                            planet.isEnabled ? "-translate-x-5" : "translate-x-0"
                                        }`} />
                                    </button>
                                </div>

                                {/* Slogan */}
                                {planet.slogan && (
                                    <p className="font-cairo font-bold text-xs text-[#ffb95f] leading-snug">
                                        ✨ &quot;{planet.slogan}&quot;
                                    </p>
                                )}

                                {/* Description */}
                                <p className="font-tajawal text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                                    {planet.description}
                                </p>

                                {/* Flagship Works Chips */}
                                {planet.flagshipWorks && planet.flagshipWorks.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        <span className="text-[10px] font-cairo font-bold text-[#94a3b8]/70 block">
                                            الأعمال البارزة في الكوكب:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {planet.flagshipWorks.map((work, wIdx) => (
                                                <span 
                                                    key={wIdx} 
                                                    className="px-2.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] font-tajawal text-[11px] text-white/80"
                                                >
                                                    {work}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer Actions Strip */}
                            <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between gap-2 relative z-10">
                                {/* Works Count & View Button */}
                                <button
                                    type="button"
                                    onClick={() => handleOpenAnimesModal(planet)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#ffb4ab] border border-white/5 transition-all cursor-pointer"
                                    title="عرض الأنميات المصنفة في هذا الكوكب"
                                >
                                    <Tv size={14} />
                                    <span>{planet.worksCount || 0} عملاً</span>
                                </button>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                    {/* Order Up */}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveOrder(idx, "up")}
                                        disabled={idx === 0}
                                        className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-20 text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                                        title="تقديم الترتيب"
                                    >
                                        <ArrowUp size={14} />
                                    </button>

                                    {/* Order Down */}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveOrder(idx, "down")}
                                        disabled={idx === planets.length - 1}
                                        className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-20 text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                                        title="تأخير الترتيب"
                                    >
                                        <ArrowDown size={14} />
                                    </button>

                                    {/* Edit Modal Button */}
                                    <button
                                        type="button"
                                        onClick={() => setEditingPlanet(planet)}
                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-amber-500/20 text-[#94a3b8] hover:text-amber-400 border border-white/5 transition-all cursor-pointer"
                                        title="تعديل بيانات الكوكب"
                                    >
                                        <Edit3 size={14} />
                                    </button>

                                    {/* Preview on website */}
                                    <Link
                                        href={`/planets?planet=${encodeURIComponent(planet.id)}`}
                                        target="_blank"
                                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-blue-500/20 text-[#94a3b8] hover:text-blue-400 border border-white/5 transition-all"
                                        title="معاينة الكوكب في الموقع العام"
                                    >
                                        <ExternalLink size={14} />
                                    </Link>

                                    {/* Delete if custom */}
                                    {planet.isCustom && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePlanet(planet)}
                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                            title="حذف هذا الكوكب"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal: Edit Planet */}
            {editingPlanet && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{editingPlanet.badge}</span>
                                <div>
                                    <h3 className="font-cairo font-black text-lg text-white">تعديل {editingPlanet.name}</h3>
                                    <span className="font-mono text-xs text-[#94a3b8]">ID: {editingPlanet.id}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingPlanet(null)}
                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">اسم الكوكب</label>
                                <input
                                    type="text"
                                    value={editingPlanet.name}
                                    onChange={(e) => setEditingPlanet({ ...editingPlanet, name: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">الرمز التعبيري (Badge)</label>
                                    <input
                                        type="text"
                                        value={editingPlanet.badge}
                                        onChange={(e) => setEditingPlanet({ ...editingPlanet, badge: e.target.value })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">التصنيف المرتبط في النظام</label>
                                    <select
                                        value={editingPlanet.genreKey}
                                        onChange={(e) => setEditingPlanet({ ...editingPlanet, genreKey: e.target.value })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-cairo font-bold focus:outline-none focus:border-red-500"
                                    >
                                        <option value="Action">Action (أكشن)</option>
                                        <option value="Sports">Sports (رياضة)</option>
                                        <option value="Adventure">Adventure (مغامرات)</option>
                                        <option value="Comedy">Comedy (كوميديا)</option>
                                        <option value="Drama">Drama (زمردة / دراما)</option>
                                        <option value="Mystery">Mystery (غموض)</option>
                                        <option value="Sci-Fi">Sci-Fi (علوم وخيال)</option>
                                        <option value="Historical">Historical (تاريخ)</option>
                                        <option value="Movie">Movie (أفلام)</option>
                                        <option value="Kids">Kids (بون بون / أطفال)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الشعار الترويجي (Slogan)</label>
                                <input
                                    type="text"
                                    value={editingPlanet.slogan}
                                    onChange={(e) => setEditingPlanet({ ...editingPlanet, slogan: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الوصف الكوني</label>
                                <textarea
                                    rows={3}
                                    value={editingPlanet.description}
                                    onChange={(e) => setEditingPlanet({ ...editingPlanet, description: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الأعمال البارزة (مفصولة بفواصل)</label>
                                <input
                                    type="text"
                                    value={(editingPlanet.flagshipWorks || []).join(", ")}
                                    onChange={(e) => setEditingPlanet({ 
                                        ...editingPlanet, 
                                        flagshipWorks: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                                    })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="سلام دانك, كابتن ماجد, بي بليد..."
                                />
                            </div>

                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div>
                                    <span className="font-cairo font-bold text-xs text-white block">حالة تفعيل الكوكب</span>
                                    <span className="font-tajawal text-[11px] text-[#94a3b8]">إظهاره للمستخدمين في القوائم والصفحات</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingPlanet({ ...editingPlanet, isEnabled: !editingPlanet.isEnabled })}
                                    className={`px-3 py-1.5 rounded-xl font-cairo font-bold text-xs transition-all cursor-pointer ${
                                        editingPlanet.isEnabled 
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}
                                >
                                    {editingPlanet.isEnabled ? "الكوكب نشط" : "الكوكب معطل"}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setEditingPlanet(null)}
                                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSaveEdit}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                <span>حفظ التعديلات</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Create Planet */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <h3 className="font-cairo font-black text-lg text-white">إضافة كوكب جديد للمنصة</h3>
                                    <span className="font-tajawal text-xs text-[#94a3b8]">إنشاء تصنيف وعالم كوني مخصص</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">اسم الكوكب (مثال: كوكب النينجا)</label>
                                <input
                                    type="text"
                                    value={newPlanetForm.name}
                                    onChange={(e) => setNewPlanetForm({ ...newPlanetForm, name: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="كوكب..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">المعرف الإنجليزي (Slug)</label>
                                    <input
                                        type="text"
                                        value={newPlanetForm.id}
                                        onChange={(e) => setNewPlanetForm({ ...newPlanetForm, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                                        placeholder="ninja, super-heroes..."
                                    />
                                </div>
                                <div>
                                    <label className="block font-cairo font-bold text-xs text-white mb-1.5">الرمز التعبيري (Badge)</label>
                                    <input
                                        type="text"
                                        value={newPlanetForm.badge}
                                        onChange={(e) => setNewPlanetForm({ ...newPlanetForm, badge: e.target.value })}
                                        className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                        placeholder="🥷, ⚡, 🌟..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">التصنيف المطابق في الأنمي</label>
                                <select
                                    value={newPlanetForm.genreKey}
                                    onChange={(e) => setNewPlanetForm({ ...newPlanetForm, genreKey: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-cairo font-bold focus:outline-none focus:border-red-500"
                                >
                                    <option value="Action">Action (أكشن)</option>
                                    <option value="Sports">Sports (رياضة)</option>
                                    <option value="Adventure">Adventure (مغامرات)</option>
                                    <option value="Comedy">Comedy (كوميديا)</option>
                                    <option value="Drama">Drama (دراما)</option>
                                    <option value="Mystery">Mystery (غموض)</option>
                                    <option value="Sci-Fi">Sci-Fi (خيال علمي)</option>
                                    <option value="Historical">Historical (تاريخي)</option>
                                    <option value="Fantasy">Fantasy (فانتازيا)</option>
                                    <option value="Shounen">Shounen (شونين)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الشعار الترويجي (Slogan)</label>
                                <input
                                    type="text"
                                    value={newPlanetForm.slogan}
                                    onChange={(e) => setNewPlanetForm({ ...newPlanetForm, slogan: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="كوكب القوة والسرعة..."
                                />
                            </div>

                            <div>
                                <label className="block font-cairo font-bold text-xs text-white mb-1.5">الوصف الكوني</label>
                                <textarea
                                    rows={3}
                                    value={newPlanetForm.description}
                                    onChange={(e) => setNewPlanetForm({ ...newPlanetForm, description: e.target.value })}
                                    className="w-full bg-[#1b1b22] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-tajawal focus:outline-none focus:border-red-500"
                                    placeholder="اكتب وصفاً جذاباً لعالم هذا الكوكب..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleCreatePlanet}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-xs font-cairo font-bold text-white shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                <span>إضافة الكوكب</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: View Associated Animes */}
            {viewingAnimesPlanet && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#131317] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{viewingAnimesPlanet.badge}</span>
                                <div>
                                    <h3 className="font-cairo font-black text-lg text-white">
                                        الأعمال المصنفة في {viewingAnimesPlanet.name}
                                    </h3>
                                    <span className="font-tajawal text-xs text-amber-400 font-bold">
                                        {animesList.length} عملاً مطابقاً
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingAnimesPlanet(null)}
                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#94a3b8] hover:text-white transition-all cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {loadingAnimes ? (
                            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                                <Loader2 className="animate-spin text-red-500" size={28} />
                                <span className="font-cairo text-xs text-[#94a3b8]">جاري جلب قائمة الأعمال...</span>
                            </div>
                        ) : animesList.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                <Tv size={36} className="mx-auto text-[#94a3b8]/40" />
                                <p className="font-cairo font-bold text-sm text-white">لا توجد أعمال مرتبطة بهذا الكوكب حالياً</p>
                                <p className="font-tajawal text-xs text-[#94a3b8]">
                                    يمكنك تعيين التصنيف &quot;{viewingAnimesPlanet.genreKey}&quot; لأي أنمي من مكتبة الأعمال ليظهر هنا تلقائياً.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                                {animesList.map((anime) => (
                                    <div 
                                        key={anime.id}
                                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 flex items-center justify-between gap-3 transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                                                <img 
                                                    src={anime.coverImage} 
                                                    alt={anime.title} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-cairo font-bold text-sm text-white truncate">{anime.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] text-[#ffb4ab] font-bold">★ {anime.rating || 9.5}</span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="text-[11px] text-[#94a3b8]">{anime.totalEpisodes || "?"} حلقة</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link
                                                href={`/admin/animes/${anime.id}`}
                                                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-cairo font-bold text-white transition-all"
                                            >
                                                تعديل الأنمي
                                            </Link>
                                            <Link
                                                href={`/animes/${anime.id}`}
                                                target="_blank"
                                                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#94a3b8] hover:text-white transition-all"
                                            >
                                                <ExternalLink size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                            <Link
                                href="/admin/animes/new"
                                className="text-xs font-cairo font-bold text-amber-400 hover:underline flex items-center gap-1"
                            >
                                <Plus size={14} />
                                <span>إضافة أنمي جديد إلى الكوكب</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setViewingAnimesPlanet(null)}
                                className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-cairo font-bold text-white transition-all cursor-pointer"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
