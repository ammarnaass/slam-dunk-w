import { NextRequest } from "next/server";
import { mobileSuccess, mobileError } from "@/lib/mobile-api";
import { getEpisodes } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const episodes = getEpisodes();
        const episode = episodes.find(ep => ep.id === id);

        if (!episode) {
            return mobileError("الحلقة غير موجودة", 404);
        }

        return mobileSuccess({
            ...episode,
            // Include extra fields if needed for the player
        });
    } catch (error) {
        console.error("Mobile V1 Episode Details API Error:", error);
        return mobileError("حدث خطأ أثناء جلب تفاصيل الحلقة", 500);
    }
}
