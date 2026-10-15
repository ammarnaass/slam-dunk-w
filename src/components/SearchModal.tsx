"use client";

import {
    useSearchModal,
    SearchModalBar,
    SearchModalAnimeResults,
    SearchModalCharacterResults,
    SearchModalEpisodeResults,
    SearchModalIdleState,
    SearchModalNoResults,
} from "./search";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const {
        query,
        setQuery,
        results,
        loading,
        inputRef,
        hasResults,
        handleLinkClick,
    } = useSearchModal({ isOpen, onClose });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4" dir="rtl">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0e0e12]/85 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-2xl bg-[#131317] border border-white/[0.1] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Bar Header */}
                <SearchModalBar
                    query={query}
                    setQuery={setQuery}
                    onClose={onClose}
                    inputRef={inputRef}
                />

                {/* Results & Suggestions Panel */}
                <div className="max-h-[62vh] overflow-y-auto p-4 sm:p-5 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[#94a3b8] gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-[#dc2626] border-t-transparent animate-spin" />
                            <span className="font-tajawal text-xs font-bold text-[#e4e1e7]">
                                جاري البحث الفوري في مكتبة أنمي دايز...
                            </span>
                        </div>
                    ) : query.trim().length > 0 ? (
                        <div className="space-y-6">
                            <SearchModalAnimeResults
                                animes={results.animes}
                                onItemClick={handleLinkClick}
                            />
                            <SearchModalCharacterResults
                                characters={results.characters}
                                onItemClick={handleLinkClick}
                            />
                            <SearchModalEpisodeResults
                                episodes={results.episodes}
                                onItemClick={handleLinkClick}
                            />
                            {!hasResults && <SearchModalNoResults query={query} />}
                        </div>
                    ) : (
                        <SearchModalIdleState onSelectChip={(chip) => setQuery(chip)} />
                    )}
                </div>
            </div>
        </div>
    );
}
