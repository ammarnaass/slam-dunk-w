"use client";

import React from "react";
import { Character } from "@/types";
import {
    useCharacterForm,
    CharacterFormHeader,
    CharacterAnimeSection,
    CharacterNamesSection,
    CharacterRoleSection,
    CharacterVoiceSection,
    CharacterBioSection,
    CharacterImageSection,
} from "./character-form";

interface CharacterFormProps {
    initialData?: Character;
    isEdit?: boolean;
}

export default function CharacterForm({ initialData, isEdit = false }: CharacterFormProps) {
    const {
        loading,
        animes,
        formData,
        selectedAnimeObj,
        handleChange,
        handleRolePreset,
        handleSubmit,
    } = useCharacterForm({ initialData, isEdit });

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <CharacterFormHeader
                isEdit={isEdit}
                characterName={formData.name_ar || formData.name}
                loading={loading}
            />

            {/* Section 1: Anime Association */}
            <CharacterAnimeSection
                animeId={formData.animeId}
                animes={animes}
                selectedAnimeObj={selectedAnimeObj}
                onChange={handleChange}
            />

            {/* Section 2: Multilingual Names */}
            <CharacterNamesSection
                name_ar={formData.name_ar}
                name_en={formData.name_en}
                name_jp={formData.name_jp}
                onChange={handleChange}
            />

            {/* Section 3: Role & Affiliation */}
            <CharacterRoleSection
                role={formData.role}
                team={formData.team}
                position={formData.position}
                onChange={handleChange}
                onSelectPreset={handleRolePreset}
            />

            {/* Section 4: Voice Actors */}
            <CharacterVoiceSection
                voiceActorJa={formData.voiceActorJa}
                voiceActorAr={formData.voiceActorAr}
                onChange={handleChange}
            />

            {/* Section 5: Description & Bio */}
            <CharacterBioSection
                description={formData.description}
                height={formData.height}
                weight={formData.weight}
                number={formData.number}
                onChange={handleChange}
            />

            {/* Section 6: Image & Live Preview */}
            <CharacterImageSection
                image={formData.image}
                name_ar={formData.name_ar}
                role={formData.role}
                animeTitle={selectedAnimeObj?.title}
                onChange={handleChange}
            />
        </form>
    );
}
