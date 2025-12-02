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

export async function GET() {
    try {
        const characters = getCharacters();
        return NextResponse.json(characters);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newCharacter: Character = await request.json();
        const characters = getCharacters();

        // Generate ID if not provided
        if (!newCharacter.id) {
            // Simple ID generation for characters
            newCharacter.id = `char-${Date.now()}`;
        }

        characters.push(newCharacter);
        saveCharacters(characters);

        return NextResponse.json(newCharacter, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create character' }, { status: 500 });
    }
}
