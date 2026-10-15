"use client";

import { useEffect, useState } from "react";
import { Anime, Episode } from "@/types";

export interface EpisodeFormData {
    title: string;
    episodeNumber: string;
    servers: { name: string; url: string; quality?: string | null }[];
}

export function useAdminEditAnime(id: string) {
    const [anime, setAnime] = useState<Anime | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"details" | "episodes">("details");

    // Episode Form State
    const [showEpisodeForm, setShowEpisodeForm] = useState(false);
    const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
    const [epFormData, setEpFormData] = useState<EpisodeFormData>({
        title: "",
        episodeNumber: "",
        servers: [{ name: "Mega", url: "", quality: "HD" }],
    });
    const [epSaving, setEpSaving] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch Anime
                const animeRes = await fetch(`/api/admin/animes/${id}`);
                if (animeRes.ok) {
                    const data = await animeRes.json();
                    setAnime(data);
                }

                // Fetch Episodes
                const epsRes = await fetch(`/api/admin/animes/${id}/episodes`);
                if (epsRes.ok) {
                    const data = await epsRes.json();
                    setEpisodes(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const handleEpisodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEpSaving(true);

        const url = editingEpisode
            ? `/api/admin/episodes/${editingEpisode.id}`
            : `/api/admin/animes/${id}/episodes`;

        const method = editingEpisode ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(epFormData),
            });

            if (res.ok) {
                const newEp = await res.json();
                if (editingEpisode) {
                    setEpisodes(prev => prev.map(ep => ep.id === newEp.id ? newEp : ep));
                } else {
                    setEpisodes(prev => [...prev, newEp].sort((a, b) => a.episodeNumber - b.episodeNumber));
                }
                setShowEpisodeForm(false);
                setEditingEpisode(null);
                setEpFormData({ title: "", episodeNumber: "", servers: [{ name: "Mega", url: "", quality: "HD" }] });
            } else {
                alert("حدث خطأ");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEpSaving(false);
        }
    };

    const handleDeleteEpisode = async (epId: string) => {
        if (!confirm("هل أنت متأكد من حذف الحلقة؟")) return;
        try {
            const res = await fetch(`/api/admin/episodes/${epId}`, { method: "DELETE" });
            if (res.ok) {
                setEpisodes(prev => prev.filter(ep => ep.id !== epId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const startEditEpisode = (ep: Episode) => {
        setEditingEpisode(ep);
        setEpFormData({
            title: ep.title,
            episodeNumber: ep.episodeNumber.toString(),
            servers: ep.servers && ep.servers.length > 0
                ? ep.servers.map(s => ({ name: s.name, url: s.url, quality: s.quality || "HD" }))
                : [{ name: "Mega", url: ep.mega_link || "", quality: "HD" }],
        });
        setShowEpisodeForm(true);
    };

    const openNewEpisodeForm = () => {
        setEditingEpisode(null);
        setEpFormData({
            title: "",
            episodeNumber: (episodes.length + 1).toString(),
            servers: [{ name: "Mega", url: "", quality: "HD" }],
        });
        setShowEpisodeForm(true);
    };

    const closeEpisodeForm = () => {
        setShowEpisodeForm(false);
        setEditingEpisode(null);
    };

    const addServerField = () => {
        setEpFormData({
            ...epFormData,
            servers: [...epFormData.servers, { name: "", url: "", quality: "HD" }]
        });
    };

    const removeServerField = (index: number) => {
        setEpFormData({
            ...epFormData,
            servers: epFormData.servers.filter((_, i) => i !== index)
        });
    };

    const updateServerField = (index: number, field: string, value: string) => {
        const nextServers = [...epFormData.servers];
        nextServers[index] = { ...nextServers[index], [field]: value };
        setEpFormData({ ...epFormData, servers: nextServers });
    };

    return {
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
    };
}
