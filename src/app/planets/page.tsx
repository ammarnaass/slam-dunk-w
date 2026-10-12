"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SPACETOON_PLANETS, PLANET_SHOWCASE_WORKS } from "@/lib/anime-presets";
import { Anime } from "@/types";
import { PlanetsCosmicHero } from "./components/PlanetsCosmicHero";
import { PlanetsMatrixGrid } from "./components/PlanetsMatrixGrid";
import { PlanetsControlsBar } from "./components/PlanetsControlsBar";
import { PlanetAnimeGrid, PlanetAnimeWork } from "./components/PlanetAnimeGrid";
import { PlanetsTropesCloud } from "./components/PlanetsTropesCloud";
import { STITCH_PLANETS } from "./components/planets-stitch-data";

// Mapping between Stitch English IDs and Spacetoon Arabic presets
const PLANET_ID_MAP: Record<string, string> = {
  action: "أكشن",
  adventure: "مغامرات",
  comedy: "كوميديا",
  emerald: "زمردة",
  sports: "رياضة",
  mystery: "غموض",
  scifi: "علوم",
  classics: "تاريخ",
};

const REVERSE_PLANET_ID_MAP: Record<string, string> = {
  "أكشن": "action",
  "مغامرات": "adventure",
  "كوميديا": "comedy",
  "زمردة": "emerald",
  "رياضة": "sports",
  "غموض": "mystery",
  "علوم": "scifi",
  "تاريخ": "classics",
};

const PLANET_NAME_DISPLAY: Record<string, string> = {
  all: "جميع الكواكب والمجرّات الكونية",
  action: "كوكب الأكشن والقتال الشونين",
  adventure: "كوكب المغامرات والأساطير",
  comedy: "كوكب الكوميديا والمرح",
  emerald: "كوكب الزمرد والدراما الراقية",
  sports: "كوكب الرياضة والتحدي",
  mystery: "كوكب الغموض والتحقيق",
  scifi: "كوكب الخيال العلمي والميكا",
  classics: "أرشيف الزهرة الذهبي والنوستالجيا",
};

function PlanetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawPlanet = searchParams.get("planet") || searchParams.get("genre") || "";

  // Resolve incoming URL parameter
  const resolvedPlanet = useMemo(() => {
    if (!rawPlanet || rawPlanet === "all") return "all";
    const clean = rawPlanet.trim().replace(/^كوكب\s*/, "");
    if (PLANET_ID_MAP[clean]) return clean;
    if (REVERSE_PLANET_ID_MAP[clean]) return REVERSE_PLANET_ID_MAP[clean];
    return clean;
  }, [rawPlanet]);

  const [selectedPlanetId, setSelectedPlanetId] = useState<string>(resolvedPlanet);
  const [dbAnimes, setDbAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterChip, setActiveFilterChip] = useState("all");
  const [activeTropeQuery, setActiveTropeQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "latest" | "episodes">("popular");

  // Sync state with URL parameter
  useEffect(() => {
    if (resolvedPlanet && resolvedPlanet !== selectedPlanetId) {
      setSelectedPlanetId(resolvedPlanet);
    }
  }, [resolvedPlanet]);

  // Fetch site animes from API
  useEffect(() => {
    fetch("/api/animes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbAnimes(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Change planet and update URL
  const handleSelectPlanet = (planetId: string) => {
    setSelectedPlanetId(planetId);
    if (planetId === "all") {
      router.push("/planets", { scroll: false });
    } else {
      router.push(`/planets?planet=${encodeURIComponent(planetId)}`, { scroll: false });
    }
  };

  // Find active planet display title
  const activePlanetName = useMemo(() => {
    return PLANET_NAME_DISPLAY[selectedPlanetId] || `كوكب ${selectedPlanetId}`;
  }, [selectedPlanetId]);

  // Aggregate and filter works
  const displayedWorks = useMemo(() => {
    const arabicId = PLANET_ID_MAP[selectedPlanetId] || selectedPlanetId;
    const sPlanet = STITCH_PLANETS.find((p) => p.id === selectedPlanetId);

    // 1. Gather matching works from DB
    const fromDb: PlanetAnimeWork[] = dbAnimes
      .filter((a) => {
        const matchesPlanet =
          selectedPlanetId === "all" ||
          (a as any).planet === selectedPlanetId ||
          (a as any).planet === arabicId ||
          (a.genres &&
            a.genres.some((g) => {
              const gLower = g.toLowerCase();
              return (
                gLower.includes(selectedPlanetId) ||
                gLower.includes(arabicId) ||
                (sPlanet && sPlanet.subtitle.includes(g))
              );
            }));

        return matchesPlanet;
      })
      .map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: (a as any).planet ? `كوكب ${(a as any).planet}` : "أنمي دايز",
        coverImage: a.coverImage || "/hero-bg.jpg",
        rating: a.rating ? a.rating.toFixed(1) : "9.5",
        episodes: a.totalEpisodes ? `${a.totalEpisodes} حلقة` : "كامل",
        year: a.releaseYear?.toString() || "1993",
        badge: "4K HDR",
        badgeColor: "bg-[#dc2626] text-white",
        link: a.id === "slam-dunk" ? "/watch/slam-dunk-101" : `/animes/${a.id}`,
        desc: a.description || "",
      }));

    // 2. Gather curated showcase works from presets
    let showcaseList: any[] = [];
    if (selectedPlanetId === "all") {
      Object.values(PLANET_SHOWCASE_WORKS).forEach((list) => {
        showcaseList = [...showcaseList, ...list];
      });
    } else {
      if (PLANET_SHOWCASE_WORKS[arabicId]) {
        showcaseList = PLANET_SHOWCASE_WORKS[arabicId];
      } else if (PLANET_SHOWCASE_WORKS[selectedPlanetId]) {
        showcaseList = PLANET_SHOWCASE_WORKS[selectedPlanetId];
      }
    }

    // Merge without duplicating IDs
    const existingIds = new Set(fromDb.map((d) => d.id));
    const combined: PlanetAnimeWork[] = [...fromDb];
    showcaseList.forEach((sc) => {
      if (!existingIds.has(sc.id)) {
        combined.push({
          id: sc.id,
          title: sc.title,
          subtitle: sc.subtitle,
          coverImage: sc.coverImage,
          rating: sc.rating,
          episodes: sc.episodes,
          year: sc.year,
          badge: sc.badge || "VIP",
          desc: sc.desc,
          link: sc.link,
        });
      }
    });

    // 3. Search query filter
    const q = searchQuery.trim().toLowerCase();
    let filtered = combined;
    if (q) {
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          (w.desc && w.desc.toLowerCase().includes(q)) ||
          (w.subtitle && w.subtitle.toLowerCase().includes(q))
      );
    }

    // 4. Trope query filter
    if (activeTropeQuery) {
      const tq = activeTropeQuery.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.title.toLowerCase().includes(tq) ||
          (w.desc && w.desc.toLowerCase().includes(tq)) ||
          (w.subtitle && w.subtitle.toLowerCase().includes(tq))
      );
    }

    // 5. Filter Chips
    if (activeFilterChip === "top_rated") {
      filtered = filtered.filter((w) => parseFloat(w.rating || "0") >= 9.0);
    } else if (activeFilterChip === "dubbed") {
      filtered = filtered.filter(
        (w) =>
          (w.desc && (w.desc.includes("دبلج") || w.desc.includes("سبيستون"))) ||
          w.title.includes("سلام دانك") ||
          w.title.includes("كونان") ||
          w.title.includes("ماجد") ||
          w.title.includes("القناص")
      );
    } else if (activeFilterChip === "completed") {
      filtered = filtered.filter(
        (w) => (w.episodes && w.episodes.includes("مكتمل")) || w.episodes?.includes("كامل")
      );
    }

    // 6. Sorting
    if (sortBy === "rating") {
      filtered.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));
    } else if (sortBy === "latest") {
      filtered.sort((a, b) => parseInt(b.year || "0", 10) - parseInt(a.year || "0", 10));
    }

    return filtered;
  }, [selectedPlanetId, dbAnimes, searchQuery, activeTropeQuery, activeFilterChip, sortBy]);

  return (
    <div
      className="min-h-screen bg-[#0b0b0f] text-[#e4e1e7] selection:bg-[#dc2626] selection:text-white relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Cosmic Breadcrumb & Hero Header */}
        <PlanetsCosmicHero />

        {/* Section 2: Interactive Planet Matrix Grid */}
        <PlanetsMatrixGrid
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={handleSelectPlanet}
        />

        {/* Section 3: Active Planet Controls Bar (Search, Chips, Sort) */}
        <PlanetsControlsBar
          activePlanetName={activePlanetName}
          worksCount={displayedWorks.length}
          activeFilterChip={activeFilterChip}
          onSelectFilterChip={setActiveFilterChip}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Section 4: 2:3 Vertical Aspect Poster Cards Grid */}
        <PlanetAnimeGrid works={displayedWorks} loading={loading} />

        {/* Section 5: Narrative Tropes & Micro-Categories Cloud */}
        <PlanetsTropesCloud
          activeTropeQuery={activeTropeQuery}
          onSelectTrope={setActiveTropeQuery}
        />
      </div>
    </div>
  );
}

export default function PlanetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-white font-cairo">
          جاري تحميل مدار الكواكب...
        </div>
      }
    >
      <PlanetsContent />
    </Suspense>
  );
}
