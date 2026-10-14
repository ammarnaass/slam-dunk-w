"use client";

import React from "react";
import { Loader2, Compass, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdminPlanets } from "./hooks/useAdminPlanets";
import { PlanetsHeader } from "./components/PlanetsHeader";
import { PlanetsStatsCards } from "./components/PlanetsStatsCards";
import { PlanetsDisplayModeCard } from "./components/PlanetsDisplayModeCard";
import { PlanetsFilterBar } from "./components/PlanetsFilterBar";
import { PlanetCardItem } from "./components/PlanetCardItem";
import { PlanetsModalsContainer } from "./components/PlanetsModalsContainer";

export default function AdminPlanetsPage() {
    const {
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
        // Modals state
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
    } = useAdminPlanets();

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
            <PlanetsHeader
                saving={saving}
                onResetDefaults={handleResetDefaults}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />

            {/* Quick KPI Stats Cards */}
            <PlanetsStatsCards
                totalPlanets={totalPlanets}
                activePlanets={activePlanets}
                totalClassifiedWorks={totalClassifiedWorks}
            />

            {/* Planets Display Mode Configuration Card (2D vs 3D) */}
            <PlanetsDisplayModeCard
                settings={settings}
                onSaveSettings={handleSaveSettings}
                saving={saving}
            />

            {/* Filter and Search Bar */}
            <PlanetsFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                totalCount={totalPlanets}
                activeCount={activePlanets}
            />

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
                            onPreview3D={setPreview3DPlanet}
                        />
                    ))}
                </div>
            )}

            {/* Modals Container */}
            <PlanetsModalsContainer
                editingPlanet={editingPlanet}
                onCloseEdit={() => setEditingPlanet(null)}
                onSaveEdit={handleSaveEdit}
                isCreateModalOpen={isCreateModalOpen}
                onCloseCreate={() => setIsCreateModalOpen(false)}
                onCreatePlanet={handleCreatePlanet}
                viewingAnimesPlanet={viewingAnimesPlanet}
                onCloseViewAnimes={() => setViewingAnimesPlanet(null)}
                animesList={animesList}
                loadingAnimes={loadingAnimes}
                preview3DPlanet={preview3DPlanet}
                onClosePreview3D={() => setPreview3DPlanet(null)}
                onPreview3D={setPreview3DPlanet}
                saving={saving}
            />
        </div>
    );
}
