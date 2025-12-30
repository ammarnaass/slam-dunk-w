import express, { Request, Response } from 'express';
import next from 'next';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // Enable CORS
    server.use(cors());
    // server.use(express.json()); // Removed to prevent conflict with Next.js App Router body parsing

    // Custom API Route Example: Serving Home Data via Express directly
    // This demonstrates using Express logic instead of Next.js API routes if desired
    server.get('/api/express/home', (req: Request, res: Response) => {
        try {
            const animesPath = path.join(__dirname, '../data/animes.json');
            const settingsPath = path.join(__dirname, '../data/settings.json');

            let animes = [];
            let settings = {};

            if (fs.existsSync(animesPath)) {
                const fileData = fs.readFileSync(animesPath, 'utf-8');
                animes = JSON.parse(fileData);
            }

            if (fs.existsSync(settingsPath)) {
                settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
            }

            // Construct the response similar to the Next.js API
            const responseCallback = {
                success: true,
                data: {
                    slider: animes.slice(0, 5).map((a: any) => ({
                        id: a.id,
                        title: a.title,
                        coverImage: a.coverImage,
                        bannerImage: a.bannerImage || a.coverImage
                    })),
                    latest: animes.slice(0, 10).map((a: any) => ({
                        id: a.id,
                        animeId: a.id,
                        title: `Episode ${a.totalEpisodes}`, // Mock data since episodes are nested usually
                        thumbnail: a.coverImage,
                        animeTitle: a.title,
                        createdAt: "2024"
                    })),
                    settings: settings
                }
            };

            res.json(responseCallback);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    });

    // Default handler for all other routes: Let Next.js handle them
    server.all(/(.*)/, (req: Request, res: Response) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
        console.log(`> Custom Express Server running!`);
    });
});
