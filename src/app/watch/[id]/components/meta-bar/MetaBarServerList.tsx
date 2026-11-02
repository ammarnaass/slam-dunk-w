"use client";

import { ServerItem } from "./meta-bar.types";

interface MetaBarServerListProps {
  displayedServers: ServerItem[];
  allServers: ServerItem[];
  activeServerIndex: number;
  onSelectServer: (idx: number) => void;
}

export function MetaBarServerList({
  displayedServers,
  allServers,
  activeServerIndex,
  onSelectServer,
}: MetaBarServerListProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x py-1 max-w-full">
      {displayedServers.map((srv) => {
        const actualIdx = allServers.findIndex(
          (s) => (s.id && s.id === srv.id) || s.url === srv.url
        );
        const isActive = activeServerIndex === actualIdx;
        const pingText = srv.ping || "24ms";

        return (
          <button
            key={srv.id || srv.url}
            onClick={() => onSelectServer(actualIdx >= 0 ? actualIdx : 0)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 border shrink-0 text-xs sm:text-sm ${
              isActive
                ? "bg-primary-container text-on-primary-container border-primary-container shadow-md font-bold scale-[1.02]"
                : "bg-surface-container-high text-on-surface hover:text-primary border-white/5"
            }`}
          >
            {/* Status Indicator */}
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-white animate-ping" : "bg-emerald-400"
              }`}
            />

            {/* Server Name */}
            <span>{srv.name}</span>

            {/* Latency & Quality Tag */}
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {srv.quality || "FHD"} • {pingText}
            </span>
          </button>
        );
      })}
    </div>
  );
}
