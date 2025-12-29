import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getAnimes } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search")?.toLowerCase();
        const genre = searchParams.get("genre");
        const status = searchParams.get("status");

        let animes = getAnimes();

        if (search) {
            animes = animes.filter(a =>
                a.title.toLowerCase().includes(search) ||
                (a.description && a.description.toLowerCase().includes(search))
            );
        }

        if (genre && genre !== "الكل") {
            animes = animes.filter(a => a.genres.includes(genre));
        }

        if (status) {
            animes = animes.filter(a => a.status === status);
        }

        const data = animes.map(a => ({
            id: a.id,
            title: a.title,
            coverImage: a.coverImage,
            status: a.status,
            genres: a.genres,
            releaseYear: a.releaseYear,
        }));

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile V1 Animes API Error:", error);
        return mobileError("Failed to fetch animes", 500);
    }
}
