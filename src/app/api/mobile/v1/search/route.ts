import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getAnimes } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.toLowerCase();

        if (!query) {
            return mobileSuccess([]);
        }

        const animes = getAnimes();
        const results = animes.filter(a =>
            a.title.toLowerCase().includes(query) ||
            (a.description && a.description.toLowerCase().includes(query))
        );

        const data = results.map(a => ({
            id: a.id,
            title: a.title,
            coverImage: a.coverImage,
            genres: a.genres,
        }));

        return mobileSuccess(data);
    } catch (error) {
        console.error("Mobile V1 Search API Error:", error);
        return mobileError("فشل البحث", 500);
    }
}
