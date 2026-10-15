"use client";

import { use } from "react";
import { Loader2, Plus } from "lucide-react";
import AnimeForm from "@/components/admin/AnimeForm";
import { useAdminEditAnime } from "./hooks/useAdminEditAnime";
import {
    EditAnimeHeader,
    EditAnimeTabsNav,
    EpisodeFormCard,
    EpisodesAdminTable,
} from "./components";

export default function AnimeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const {
        anime,
        episodes,
        loading,
        activeTab,
        setActiveTab,
        showEpisodeForm,
        editingEpisode,
        epFormData,
        setEpFormData,
        epSaving,
        handleEpisodeSubmit,
        handleDeleteEpisode,
        startEditEpisode,
        openNewEpisodeForm,
        closeEpisodeForm,
        addServerField,
        removeServerField,
        updateServerField,
    } = useAdminEditAnime(id);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-red-600" />
            </div>
        );
    }

    if (!anime) {
        return <div className="text-white">العمل غير موجود</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Anime Info Header */}
            <EditAnimeHeader anime={anime} />

            {/* Tabs Navigation */}
            <EditAnimeTabsNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                episodesCount={episodes.length}
            />

            {activeTab === "details" ? (
                <AnimeForm initialData={anime} isEdit={true} />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">قائمة الحلقات</h2>
                        <button
                            onClick={openNewEpisodeForm}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer transition-colors"
                        >
                            <Plus size={20} /> إضافة حلقة
                        </button>
                    </div>

                    {showEpisodeForm && (
                        <EpisodeFormCard
                            editingEpisode={editingEpisode}
                            epFormData={epFormData}
                            setEpFormData={setEpFormData}
                            epSaving={epSaving}
                            onSubmit={handleEpisodeSubmit}
                            onCancel={closeEpisodeForm}
                            onAddServer={addServerField}
                            onRemoveServer={removeServerField}
                            onUpdateServer={updateServerField}
                        />
                    )}

                    <EpisodesAdminTable
                        episodes={episodes}
                        onStartEdit={startEditEpisode}
                        onDelete={handleDeleteEpisode}
                    />
                </div>
            )}
        </div>
    );
}
