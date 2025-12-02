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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const updatedData: Partial<Episode> = await request.json();
        const episodes = getEpisodes();

        const index = episodes.findIndex(e => e.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        episodes[index] = { ...episodes[index], ...updatedData };
        saveEpisodes(episodes);

        return NextResponse.json(episodes[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        let episodes = getEpisodes();

        const initialLength = episodes.length;
        episodes = episodes.filter(e => e.id !== id);

        if (episodes.length === initialLength) {
            return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
        }

        saveEpisodes(episodes);

        return NextResponse.json({ message: 'Episode deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete episode' }, { status: 500 });
    }
}
