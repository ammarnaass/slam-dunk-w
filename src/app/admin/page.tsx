import {
    AdminDashboardHeader,
    AdminDashboardMetrics,
    AdminRecentAnimesTable,
    getAdminDashboardStats,
} from "./components/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="flex flex-col w-full gap-space-lg text-on-surface font-body-md">
            {/* 1. Top Command & Action Bar */}
            <AdminDashboardHeader />

            {/* 2. Key Metrics Grid (4 Bento Columns) */}
            <AdminDashboardMetrics
                animeCount={stats.animeCount}
                featuredCount={stats.featuredCount}
                episodeCount={stats.episodeCount}
                characterCount={stats.characterCount}
                userCount={stats.userCount}
            />

            {/* 3. Recent Animes Management Table */}
            <AdminRecentAnimesTable latestAnimes={stats.latestAnimes} />
        </div>
    );
}
