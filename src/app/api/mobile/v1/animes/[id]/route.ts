import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getAnimes } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const animes = getAnimes();
        const anime = animes.find(a => a.id === id);

        if (!anime) {
            return mobileError("العمل غير موجود", 404);
        }

        return mobileSuccess(anime);
    } catch (error) {
        console.error("Mobile V1 Anime Details API Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل العمل", 500);
    }
}
