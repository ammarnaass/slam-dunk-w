import { AnimeService } from "./anime.service";
import { EpisodeService } from "./episode.service";
import { CharacterService } from "./character.service";

export class SearchService {
    static async search(query: string, type: "all" | "anime" | "episode" | "character" = "all", limit = 20) {
        const q = query.trim().toLowerCase();
        if (!q) {
            return { animes: [], episodes: [], characters: [] };
        }

        const results: { animes: any[]; episodes: any[]; characters: any[] } = {
            animes: [],
            episodes: [],
            characters: []
        };

        const promises: Promise<any>[] = [];

        if (type === "all" || type === "anime") {
            promises.push(
                AnimeService.getAnimes({ q, limit }).then(res => {
                    results.animes = res.items;
                })
            );
        }

        if (type === "all" || type === "character") {
            promises.push(
                CharacterService.getCharacters({ limit: 50 }).then(res => {
                    results.characters = res.items.filter(c =>
                        (c.id && c.id.toLowerCase().includes(q)) ||
                        (c.name && c.name.toLowerCase().includes(q)) ||
                        (c.name_ar && c.name_ar.toLowerCase().includes(q)) ||
                        (c.name_en && c.name_en.toLowerCase().includes(q)) ||
                        (c.team && c.team.toLowerCase().includes(q)) ||
                        (c.bio && c.bio.toLowerCase().includes(q)) ||
                        (c.role && c.role.toLowerCase().includes(q))
                    ).slice(0, limit);
                })
            );
        }

        if (type === "all" || type === "episode") {
            promises.push(
                EpisodeService.getAnimeEpisodes("slam-dunk", { limit: 101 }).then(res => {
                    results.episodes = res.items.filter(ep =>
                        (ep.title && ep.title.toLowerCase().includes(q)) ||
                        String(ep.episodeNumber) === q
                    ).slice(0, limit);
                })
            );
        }

        await Promise.all(promises);

        return results;
    }
}
