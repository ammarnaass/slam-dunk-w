const fs = require('fs');
const path = require('path');

const episodesPath = path.join(__dirname, 'src', 'data', 'episodes.json');

try {
    const rawData = fs.readFileSync(episodesPath, 'utf8');
    const episodes = JSON.parse(rawData);

    const updatedEpisodes = episodes.map(ep => ({
        ...ep,
        animeId: "slam-dunk"
    }));

    fs.writeFileSync(episodesPath, JSON.stringify(updatedEpisodes, null, 2));
    console.log(`Successfully updated ${updatedEpisodes.length} episodes with animeId.`);
} catch (error) {
    console.error("Error migrating episodes:", error);
}
