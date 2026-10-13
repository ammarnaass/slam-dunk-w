"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SPACETOON_PLANETS } from "@/lib/anime-presets";
import { Anime } from "@/types";
import { PlanetsCosmicHero } from "./components/PlanetsCosmicHero";
import { PlanetsMatrixGrid } from "./components/PlanetsMatrixGrid";
import { PlanetsControlsBar } from "./components/PlanetsControlsBar";
import { PlanetAnimeGrid, PlanetAnimeWork } from "./components/PlanetAnimeGrid";
import { PlanetsTropesCloud } from "./components/PlanetsTropesCloud";
import { PlanetsViewModeToggle } from "./components/PlanetsViewModeToggle";
import { STITCH_PLANETS } from "./components/planets-stitch-data";
import { DEFAULT_ADMIN_PLANETS, AdminPlanetItem } from "@/lib/planets-presets";
import dynamic from "next/dynamic";

const Spacetoon3DPlanetarium = dynamic(
  () => import("./components/Spacetoon3DPlanetarium").then((mod) => mod.Spacetoon3DPlanetarium),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl bg-[#0d0d15] border border-amber-500/20 flex flex-col items-center justify-center gap-3 text-amber-300 font-cairo">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        <span className="text-sm">جاري محاكاة مدار كواكب سبيستون ثلاثي الأبعاد 3D...</span>
      </div>
    ),
  }
);

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

const PLANET_ALIASES: Record<string, string> = {
  sports: "sports",
  sport: "sports",
  action: "action",
  adventure: "adventure",
  comedy: "comedy",
  emerald: "emerald",
  zomoroda: "emerald",
  drama: "emerald",
  romance: "emerald",
  scifi: "scifi",
  "sci-fi": "scifi",
  science: "scifi",
  mystery: "mystery",
  classics: "classics",
  history: "classics",
  historical: "classics",
  shounen: "action",
  movies: "action",
  "رياضة": "sports",
  "أكشن": "action",
  "مغامرات": "adventure",
  "كوميديا": "comedy",
  "زمردة": "emerald",
  "دراما": "emerald",
  "علوم": "scifi",
  "خيال علمي": "scifi",
  "غموض": "mystery",
  "تاريخ": "classics",
  "أفلام": "action",
  "سبيستون": "classics",
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

  // Resolve incoming URL parameter with robust aliasing
  const resolvedPlanet = useMemo(() => {
    if (!rawPlanet || rawPlanet === "all") return "all";
    const cleanLower = rawPlanet.trim().toLowerCase().replace(/^كوكب\s*/, "");
    if (PLANET_ALIASES[cleanLower]) return PLANET_ALIASES[cleanLower];
    const rawClean = rawPlanet.trim().replace(/^كوكب\s*/, "");
    if (PLANET_ALIASES[rawClean]) return PLANET_ALIASES[rawClean];
    if (PLANET_ID_MAP[cleanLower]) return cleanLower;
    if (REVERSE_PLANET_ID_MAP[rawClean]) return REVERSE_PLANET_ID_MAP[rawClean];
    return cleanLower;
  }, [rawPlanet]);

  const rawMode = searchParams.get("mode");

  const [selectedPlanetId, setSelectedPlanetId] = useState<string>(resolvedPlanet);
  const [adminPlanets, setAdminPlanets] = useState<AdminPlanetItem[]>(DEFAULT_ADMIN_PLANETS);
  const [viewMode, setViewMode] = useState<"3d" | "2d">(rawMode === "2d" ? "2d" : "3d");
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

  useEffect(() => {
    if (rawMode === "3d" || rawMode === "2d") {
      setViewMode(rawMode);
    }
  }, [rawMode]);

  // Fetch site animes from API and planets settings
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

    // Fetch stored planets and site display mode settings
    fetch("/api/planets")
      .then((res) => res.json())
      .then((json) => {
        const payload = json.data || json;
        if (payload?.planets && Array.isArray(payload.planets)) {
          setAdminPlanets(payload.planets);
          if (payload.settings?.displayMode === "2d_grid") {
            setViewMode("2d");
          } else if (payload.settings?.displayMode === "3d_spacetoon") {
            setViewMode("3d");
          }
        } else if (Array.isArray(payload)) {
          setAdminPlanets(payload);
        }
      })
      .catch(() => {});

    // Restore local user view preference if available
    try {
      const saved = localStorage.getItem("planets_view_mode");
      if (saved === "2d" || saved === "3d") {
        setViewMode(saved);
      }
    } catch (_) {}
  }, []);

  const handleToggleViewMode = (mode: "3d" | "2d") => {
    setViewMode(mode);
    try {
      localStorage.setItem("planets_view_mode", mode);
    } catch (_) {}
  };

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

    // 1. Gather matching works ONLY from real site database
    const fromDb: PlanetAnimeWork[] = dbAnimes
      .filter((a) => {
        if (selectedPlanetId === "all") return true;

        const matchesPlanet =
          (a as any).planet === selectedPlanetId ||
          (a as any).planet === arabicId;

        const pLower = selectedPlanetId.toLowerCase();
        const pClean = pLower.replace(/[-\s]/g, "");
        const matchesGenre =
          a.genres &&
          a.genres.some((g) => {
            const gLower = g.toLowerCase().replace(/[-\s]/g, "");
            const isMatch =
              gLower.includes(pClean) ||
              g.includes(arabicId) ||
              (pClean === "sports" && (gLower.includes("sport") || g.includes("رياضة"))) ||
              (pClean === "action" && (gLower.includes("action") || gLower.includes("shounen") || g.includes("أكشن"))) ||
              (pClean === "adventure" && (gLower.includes("adventure") || g.includes("مغامر"))) ||
              (pClean === "comedy" && (gLower.includes("comedy") || g.includes("كوميدي"))) ||
              (pClean === "emerald" && (gLower.includes("drama") || gLower.includes("romance") || g.includes("دراما") || g.includes("زمردة"))) ||
              (pClean === "scifi" && (gLower.includes("scifi") || gLower.includes("mecha") || g.includes("علوم") || g.includes("خيال علمي") || g.includes("ميكا"))) ||
              (pClean === "mystery" && (gLower.includes("mystery") || g.includes("غموض") || g.includes("تحقيق"))) ||
              (pClean === "classics" && (gLower.includes("classic") || gLower.includes("history") || g.includes("تاريخ") || g.includes("كلاسيك")));
            return isMatch || (sPlanet && sPlanet.subtitle.toLowerCase().includes(g.toLowerCase()));
          });

        return matchesPlanet || matchesGenre;
      })
      .map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: (a as any).planet ? `كوكب ${(a as any).planet}` : "أنمي دايز",
        coverImage: a.coverImage || "/hero-bg.jpg",
        rating: a.rating ? a.rating.toFixed(1) : "9.5",
        episodes: a.totalEpisodes ? `${a.totalEpisodes} حلقة` : "كامل",
        year: a.releaseYear?.toString() || "",
        badge: (a as any).quality || "4K HDR",
        badgeColor: "bg-[#dc2626] text-white",
        link: `/animes/${a.id}`,
        desc: a.description || "",
      }));

    // 2. Real works filtered
    const combined: PlanetAnimeWork[] = fromDb;

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
        <PlanetsCosmicHero totalWorks={dbAnimes.length} />

        {/* View Mode Toggle: 3D Spacetoon vs 2D Normal Grid */}
        <PlanetsViewModeToggle
          viewMode={viewMode}
          onChangeViewMode={handleToggleViewMode}
        />

        {/* Section 2: Celestial 3D Orbit OR Interactive Planet Matrix Grid */}
        {viewMode === "3d" ? (
          <Spacetoon3DPlanetarium
            planets={adminPlanets}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
          />
        ) : (
          <PlanetsMatrixGrid
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={handleSelectPlanet}
            animes={dbAnimes}
          />
        )}

        {/* Anchor for smooth scrolling from 3D HUD */}
        <div id="planet-animes-section" className="scroll-mt-20" />

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
          animes={dbAnimes}
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
