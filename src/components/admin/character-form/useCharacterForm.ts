import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Character, Anime } from "@/types";

export const ROLE_PRESETS = [
    "بطل رئيسي (Main Protagonist)",
    "بطل مشارك (Deuteragonist)",
    "شخصية مساندة (Supporting Character)",
    "خصم ومنافس (Rival / Antagonist)",
    "شرير رئيسي (Main Villain)",
    "معلم ومرشد (Mentor / Sensei)",
];

interface UseCharacterFormProps {
    initialData?: Character;
    isEdit?: boolean;
}

export function useCharacterForm({ initialData, isEdit = false }: UseCharacterFormProps = {}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [formData, setFormData] = useState<Partial<Character> & { voiceActorJa?: string; voiceActorAr?: string }>({
        animeId: "",
        name: "",
        name_ar: "",
        name_en: "",
        name_jp: "",
        role: "بطل رئيسي",
        team: "",
        position: "",
        number: "",
        height: "",
        weight: "",
        description: "",
        image: "/hero-bg.jpg",
        voiceActorJa: "",
        voiceActorAr: "",
        ...(initialData as any),
    });

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                const res = await fetch("/api/admin/animes").catch(() => fetch("/api/animes"));
                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data) ? data : (data?.items || []);
                    setAnimes(list);
                    if (!isEdit && list.length > 0 && !formData.animeId) {
                        setFormData(prev => ({ ...prev, animeId: list[0].id }));
                    }
                }
            } catch (err) {
                console.error("Failed to load animes for character form", err);
            }
        };
        fetchAnimes();
    }, [isEdit]);

    const selectedAnimeObj = animes.find(a => a.id === formData.animeId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRolePreset = (preset: string) => {
        const clean = preset.split(" (")[0];
        setFormData(prev => ({ ...prev, role: clean }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/characters/${initialData?.id}` : "/api/characters";
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                ...formData,
                name: formData.name_ar || formData.name || formData.name_en,
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/characters");
                router.refresh();
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || "حدث خطأ أثناء حفظ الشخصية");
            }
        } catch (error) {
            console.error("Error saving character", error);
            alert("حدث خطأ أثناء حفظ الشخصية");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        animes,
        formData,
        selectedAnimeObj,
        handleChange,
        handleRolePreset,
        handleSubmit,
    };
}
