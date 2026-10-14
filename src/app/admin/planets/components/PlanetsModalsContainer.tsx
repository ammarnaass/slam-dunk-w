"use client";

import React from "react";
import { AdminPlanetItem } from "@/lib/planets-presets";
import { Anime } from "@/types";
import { EditPlanetModal } from "./EditPlanetModal";
import { CreatePlanetModal } from "./CreatePlanetModal";
import { ViewPlanetAnimesModal } from "./ViewPlanetAnimesModal";
import { Planet3DPreviewModal } from "./Planet3DPreviewModal";

interface PlanetsModalsContainerProps {
    editingPlanet: AdminPlanetItem | null;
    onCloseEdit: () => void;
    onSaveEdit: (planet: AdminPlanetItem) => Promise<void>;
    isCreateModalOpen: boolean;
    onCloseCreate: () => void;
    onCreatePlanet: (planet: AdminPlanetItem) => Promise<void>;
    viewingAnimesPlanet: AdminPlanetItem | null;
    onCloseViewAnimes: () => void;
    animesList: Anime[];
    loadingAnimes: boolean;
    preview3DPlanet: AdminPlanetItem | null;
    onClosePreview3D: () => void;
    onPreview3D: (planet: AdminPlanetItem) => void;
    saving: boolean;
}

export const PlanetsModalsContainer: React.FC<PlanetsModalsContainerProps> = ({
    editingPlanet,
    onCloseEdit,
    onSaveEdit,
    isCreateModalOpen,
    onCloseCreate,
    onCreatePlanet,
    viewingAnimesPlanet,
    onCloseViewAnimes,
    animesList,
    loadingAnimes,
    preview3DPlanet,
    onClosePreview3D,
    onPreview3D,
    saving,
}) => {
    return (
        <>
            {/* Modal: Edit Planet */}
            <EditPlanetModal
                planet={editingPlanet}
                isOpen={!!editingPlanet}
                onClose={onCloseEdit}
                onSave={onSaveEdit}
                saving={saving}
                onPreview3D={onPreview3D}
            />

            {/* Modal: Create Planet */}
            <CreatePlanetModal
                isOpen={isCreateModalOpen}
                onClose={onCloseCreate}
                onCreate={onCreatePlanet}
                saving={saving}
            />

            {/* Modal: View Associated Animes */}
            <ViewPlanetAnimesModal
                planet={viewingAnimesPlanet}
                onClose={onCloseViewAnimes}
                animesList={animesList}
                loading={loadingAnimes}
            />

            {/* Modal: Live 3D Planet Preview */}
            <Planet3DPreviewModal
                planet={preview3DPlanet}
                isOpen={!!preview3DPlanet}
                onClose={onClosePreview3D}
            />
        </>
    );
};
