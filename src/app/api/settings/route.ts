import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src/data/settings.json');

function getSettings() {
    if (!fs.existsSync(settingsPath)) {
        return {
            siteName: "سلام دانك",
            siteDescription: "شاهد جميع حلقات أنمي سلام دانك بجودة عالية",
            logoUrl: "/logoep.jpg"
        };
    }
    const jsonData = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(jsonData);
}

function saveSettings(settings: any) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

export async function GET() {
    try {
        const settings = getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newSettings = await request.json();
        saveSettings(newSettings);
        return NextResponse.json(newSettings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
