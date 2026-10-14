"use client";

import React from "react";
import { Character } from "@/types";
import CharacterCard from "@/components/CharacterCard";

interface AnimeCastSectionProps {
    characters: Character[];
}

export function AnimeCastSection({ characters }: AnimeCastSectionProps) {
    if (!characters || characters.length === 0) return null;

    return (
        <section className="w-full max-w-7xl mx-auto px-gutter-lg py-space-xl border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-space-lg">
                <div className="flex items-center gap-space-sm">
                    <span className="w-2.5 h-6 rounded-full bg-secondary"></span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold">الشخصيات وطاقم الدبلجة</h2>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline-block">
                    أداء ثنائي باليابانية والعربية الفصحى
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-space-md">
                {characters.map((char) => (
                    <CharacterCard key={char.id} character={char} variant="circle" />
                ))}
            </div>
        </section>
    );
}
