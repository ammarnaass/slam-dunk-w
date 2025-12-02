import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Character } from '@/types';

const dataFilePath = path.join(process.cwd(), 'src/data/characters.json');

function getCharacters(): Character[] {
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(jsonData);
}

function saveCharacters(characters: Character[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(characters, null, 2));
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const updatedData: Partial<Character> = await request.json();
        const characters = getCharacters();

        const index = characters.findIndex(c => c.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        characters[index] = { ...characters[index], ...updatedData };
        saveCharacters(characters);

        return NextResponse.json(characters[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update character' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        let characters = getCharacters();

        const initialLength = characters.length;
        characters = characters.filter(c => c.id !== id);

        if (characters.length === initialLength) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        saveCharacters(characters);

        return NextResponse.json({ message: 'Character deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete character' }, { status: 500 });
    }
}
