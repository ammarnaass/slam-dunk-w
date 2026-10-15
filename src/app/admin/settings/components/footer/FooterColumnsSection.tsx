"use client";

import { Link as LinkIcon, HelpCircle, Plus, Trash2 } from "lucide-react";
import { FooterConfig, FooterLinkItem } from "@/server/types/settings.types";

interface FooterColumnsSectionProps {
    data: FooterConfig;
    updateField: <K extends keyof FooterConfig>(field: K, value: FooterConfig[K]) => void;
    updateExploreLink: (id: string, field: keyof FooterLinkItem, value: any) => void;
    addExploreLink: () => void;
    removeExploreLink: (id: string) => void;
    updateHelpLink: (id: string, field: keyof FooterLinkItem, value: any) => void;
    addHelpLink: () => void;
    removeHelpLink: (id: string) => void;
}

export function FooterColumnsSection({
    data,
    updateField,
    updateExploreLink,
    addExploreLink,
    removeExploreLink,
    updateHelpLink,
    addHelpLink,
    removeHelpLink,
}: FooterColumnsSectionProps) {
    return (
        <div className="space-y-6">
            {/* Explore Column Links */}
            <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <LinkIcon size={18} className="text-[#dc2626]" />
                        <h3 className="font-cairo font-bold text-white text-sm">عمود: {data.exploreTitle}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={addExploreLink}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-cairo font-bold transition-colors cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>إضافة رابط</span>
                    </button>
                </div>

                <div>
                    <label className="block text-[11px] font-cairo font-bold text-[#94a3b8] mb-1">عنوان العمود</label>
                    <input
                        type="text"
                        value={data.exploreTitle}
                        onChange={(e) => updateField("exploreTitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div className="space-y-2.5 pt-2">
                    {(data.exploreLinks || []).map((link) => (
                        <div key={link.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-2.5">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateExploreLink(link.id, "label", e.target.value)}
                                    placeholder="نص الرابط"
                                    className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                />
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={(e) => updateExploreLink(link.id, "href", e.target.value)}
                                    placeholder="/animes..."
                                    className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                            <label className="flex items-center gap-1 text-[11px] font-cairo text-[#ffb95f] px-2 py-1 rounded-lg bg-[#ffb95f]/10 cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={!!link.isVip}
                                    onChange={(e) => updateExploreLink(link.id, "isVip", e.target.checked)}
                                    className="rounded bg-[#1f1f23] text-amber-500 focus:ring-0"
                                />
                                <span>VIP</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => removeExploreLink(link.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                                title="حذف الرابط"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help & Support Links */}
            <div className="p-6 rounded-3xl bg-[#181820]/90 border border-white/[0.08] shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <HelpCircle size={18} className="text-[#ffb95f]" />
                        <h3 className="font-cairo font-bold text-white text-sm">عمود: {data.helpTitle}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={addHelpLink}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-cairo font-bold transition-colors cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>إضافة رابط</span>
                    </button>
                </div>

                <div>
                    <label className="block text-[11px] font-cairo font-bold text-[#94a3b8] mb-1">عنوان العمود</label>
                    <input
                        type="text"
                        value={data.helpTitle}
                        onChange={(e) => updateField("helpTitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#131317] border border-white/[0.1] text-xs font-cairo font-bold text-white focus:outline-none focus:border-[#dc2626]"
                    />
                </div>

                <div className="space-y-2.5 pt-2">
                    {(data.helpLinks || []).map((link) => (
                        <div key={link.id} className="p-3 rounded-2xl bg-[#131317] border border-white/5 flex items-center gap-2.5">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateHelpLink(link.id, "label", e.target.value)}
                                    placeholder="نص الرابط"
                                    className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-tajawal text-white focus:outline-none focus:border-[#dc2626]"
                                />
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={(e) => updateHelpLink(link.id, "href", e.target.value)}
                                    placeholder="/terms..."
                                    className="px-3 py-1.5 rounded-xl bg-[#1a1a22] border border-white/5 text-xs font-mono text-white focus:outline-none focus:border-[#dc2626]"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeHelpLink(link.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                                title="حذف الرابط"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
