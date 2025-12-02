"use client";

import { useState, useEffect } from "react";
import CharacterForm from "@/components/admin/CharacterForm";
import { Character } from "@/types";
import { useParams } from "next/navigation";

export default function EditCharacterPage() {
    const params = useParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const res = await fetch(`/api/characters/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCharacter(data);
                }
            } catch (error) {
                console.error("Failed to fetch character", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCharacter();
        }
    }, [params.id]);

    if (loading) return <div className="text-white text-center p-8">جاري التحميل...</div>;
    if (!character) return <div className="text-white text-center p-8">الشخصية غير موجودة</div>;

    return <CharacterForm initialData={character} isEdit={true} />;
}
