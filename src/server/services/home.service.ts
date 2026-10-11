import { AnimeService } from "./anime.service";
import { EpisodeService } from "./episode.service";
import { CharacterService } from "./character.service";
import { SettingsService } from "./settings.service";

export class HomeService {
    static async getHomeData() {
        const [
            animesResult,
            episodesResult,
            charactersResult,
            settings
        ] = await Promise.all([
            AnimeService.getAnimes({ limit: 10, sort: "latest" }),
            EpisodeService.getAnimeEpisodes("slam-dunk", { limit: 12 }),
            CharacterService.getCharacters({ limit: 8 }),
            SettingsService.getSettings()
        ]);

        // Featured slider items
        const sliderIds = settings.sliderAnimeIds || ["slam-dunk"];
        const sliders = animesResult.items.filter(a => sliderIds.includes(a.id));
        const finalSliders = sliders.length > 0 ? sliders : animesResult.items.slice(0, 3);

        return {
            sliders: finalSliders,
            latestEpisodes: episodesResult.items,
            latestAnimes: animesResult.items,
            characters: charactersResult.items,
            settings: {
                siteName: settings.siteName,
                siteDescription: settings.siteDescription,
                maintenanceMode: settings.maintenanceMode,
                socialLinks: settings.socialLinks
            }
        };
    }
}
