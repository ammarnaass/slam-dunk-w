process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log('Using connection string:', connectionString ? 'Found' : 'Not Found');

const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
const dataDir = path.join(__dirname, '../src/data');

async function migrate() {
    try {
        console.log('Starting migration to PostgreSQL...');

        // 1. Migrate Settings (Global)
        const settingsPath = path.join(dataDir, 'settings.json');
        if (fs.existsSync(settingsPath)) {
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
            console.log('Migrating settings...');
            await prisma.settings.upsert({
                where: { id: 'global' },
                update: {
                    siteName: settings.siteName,
                    maintenanceMode: settings.maintenanceMode || false,
                    maintenanceMessage: settings.maintenanceMessage,
                    latestVersion: settings.apiApp?.latestVersion,
                    updateUrl: settings.apiApp?.updateUrl,
                    admobEnabled: settings.admob?.isEnabled || false,
                    admobAppId: settings.admob?.appId,
                    admobBannerId: settings.admob?.bannerId,
                    admobInterstitialId: settings.admob?.interstitialId
                },
                create: {
                    id: 'global',
                    siteName: settings.siteName || 'Slam Dunk',
                    maintenanceMode: settings.maintenanceMode || false,
                    latestVersion: settings.apiApp?.latestVersion,
                    updateUrl: settings.apiApp?.updateUrl
                }
            });
        }

        // 2. Migrate Plans
        const plansPath = path.join(dataDir, 'plans.json');
        if (fs.existsSync(plansPath)) {
            const plansData = JSON.parse(fs.readFileSync(plansPath, 'utf-8'));
            const plansList = Array.isArray(plansData) ? plansData : (plansData.plans || []);
            console.log(`Migrating ${plansList.length} plans...`);

            for (const plan of plansList) {
                await prisma.plan.upsert({
                    where: { id: plan.id },
                    update: {
                        name: plan.name,
                        price: parseFloat(plan.price),
                        duration: plan.duration.toString(),
                        description: plan.description,
                        features: plan.features || []
                    },
                    create: {
                        id: plan.id,
                        name: plan.name,
                        price: parseFloat(plan.price),
                        duration: plan.duration.toString(),
                        description: plan.description,
                        features: plan.features || []
                    }
                });
            }
        }

        // 3. Migrate Users
        const usersPath = path.join(dataDir, 'users.json');
        if (fs.existsSync(usersPath)) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
            const usersList = Array.isArray(usersData) ? usersData : (usersData.users || []);
            console.log(`Migrating ${usersList.length} users...`);

            for (const user of usersList) {
                const userName = user.username || user.name || user.email.split('@')[0];

                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {
                        name: userName,
                        password: user.password,
                        role: user.role ? user.role.toLowerCase() : 'user',
                        avatar: user.profileImage || user.avatar,
                        watchlist: user.watchlist || [] // Storing as simple array for now
                    },
                    create: {
                        id: user.id, // Keep existing ID if possible, Prisma handles UUID default if skipped but we want persistent ID
                        email: user.email,
                        name: userName,
                        password: user.password,
                        role: user.role ? user.role.toLowerCase() : 'user',
                        avatar: user.profileImage || user.avatar,
                        watchlist: user.watchlist || []
                    }
                });
            }
        }

        // 4. Migrate Animes & Episodes & Reviews
        const animesPath = path.join(dataDir, 'animes.json');
        if (fs.existsSync(animesPath)) {
            const animesData = JSON.parse(fs.readFileSync(animesPath, 'utf-8'));
            const animesList = Array.isArray(animesData) ? animesData : (animesData.animes || []);
            console.log(`Migrating ${animesList.length} animes...`);

            for (const anime of animesList) {
                // Create Anime
                await prisma.anime.upsert({
                    where: { id: anime.id },
                    update: {
                        title: anime.title,
                        description: anime.description || '',
                        coverImage: anime.coverImage,
                        bannerImage: anime.bannerImage,
                        type: anime.type,
                        status: anime.status ? anime.status.toLowerCase() : 'ongoing',
                        releaseYear: anime.releaseYear ? parseInt(anime.releaseYear) : null,
                        totalEpisodes: anime.totalEpisodes,
                        genres: anime.genres || [],
                        isFeatured: anime.id === 'slam-dunk' // Example logic
                    },
                    create: {
                        id: anime.id,
                        title: anime.title,
                        description: anime.description || '',
                        coverImage: anime.coverImage,
                        bannerImage: anime.bannerImage,
                        type: anime.type,
                        status: anime.status ? anime.status.toLowerCase() : 'ongoing',
                        releaseYear: anime.releaseYear ? parseInt(anime.releaseYear) : null,
                        totalEpisodes: anime.totalEpisodes,
                        genres: anime.genres || []
                    }
                });

                // Migrate Episodes if they exist in a separate file or nested
                // Assuming episodes are stored in `src/data/episodes/{animeId}.json` or similar logic from previous exploration
                // Let's check if there is an episodes.json or multiple files.
                // Based on previous turn, we only saw `animes.json`. 
                // If episodes are missing from JSON, we might skip them or look for them.
                // Wait, looking at `api/mobile/v1/home` response earlier: it showed "latest" episodes.
                // And confirmed `episodes` might be nested in `animes` object in some versions, OR in `episodes.json`.

                // Let's try to find an episodes file for this anime.
                const animeEpisodesPath = path.join(dataDir, `episodes/${anime.id}.json`);
                // Or generic episodes.json
                const genericEpisodesPath = path.join(dataDir, 'episodes.json');

                let episodes = [];
                if (fs.existsSync(animeEpisodesPath)) {
                    episodes = JSON.parse(fs.readFileSync(animeEpisodesPath, 'utf-8'));
                } else if (fs.existsSync(genericEpisodesPath)) {
                    const allEpisodes = JSON.parse(fs.readFileSync(genericEpisodesPath, 'utf-8'));
                    episodes = allEpisodes.filter((e: any) => e.animeId === anime.id);
                } else if (anime.episodes) {
                    episodes = anime.episodes;
                }

                // Fallback: Check for existing episode files pattern
                // If no episodes found, we simply continue.

                if (episodes.length > 0) {
                    console.log(`Migrating ${episodes.length} episodes for ${anime.title}...`);
                    for (const ep of episodes) {
                        await prisma.episode.upsert({
                            where: { id: ep.id.toString() },
                            update: {
                                title: ep.title,
                                thumbnail: ep.thumbnail,
                                duration: ep.duration
                            },
                            create: {
                                id: ep.id.toString(),
                                animeId: anime.id,
                                title: ep.title,
                                thumbnail: ep.thumbnail,
                                duration: ep.duration
                            }
                        });

                        // Add Servers if any
                        if (ep.servers && Array.isArray(ep.servers)) {
                            for (const srv of ep.servers) {
                                await prisma.server.create({
                                    data: {
                                        episodeId: ep.id.toString(),
                                        name: srv.name,
                                        url: srv.url,
                                        quality: srv.quality
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
