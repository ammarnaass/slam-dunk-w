"use client";

import { useState, useEffect } from "react";
import EpisodeForm from "@/components/admin/EpisodeForm";
import { Episode } from "@/types";
import { useParams } from "next/navigation";

export default function EditEpisodePage() {
    const params = useParams();
    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEpisode = async () => {
            try {
                const res = await fetch(`/api/episodes/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEpisode(data);
                }
            } catch (error) {
                console.error("Failed to fetch episode", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEpisode();
        }
    }, [params.id]);

    if (loading) return <div className="text-white text-center p-8">جاري التحميل...</div>;
    if (!episode) return <div className="text-white text-center p-8">الحلقة غير موجودة</div>;

    return <EpisodeForm initialData={episode} isEdit={true} />;
}
