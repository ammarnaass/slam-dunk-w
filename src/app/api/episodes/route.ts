import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Episode } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/episodes.json');

function getEpisodes(): Episode[] {
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
}

function saveEpisodes(episodes: Episode[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(episodes, null, 2));
}

export async function GET() {
    try {
        const episodes = getEpisodes();
        return NextResponse.json(episodes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newEpisode: Episode = await request.json();
        const episodes = getEpisodes();

        // Generate ID if not provided
        if (!newEpisode.id) {
            const maxId = Math.max(...episodes.map(e => parseInt(e.id) || 0));
            newEpisode.id = (maxId + 1).toString();
        }

        episodes.push(newEpisode);
        saveEpisodes(episodes);

        return NextResponse.json(newEpisode, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create episode' }, { status: 500 });
    }
}
