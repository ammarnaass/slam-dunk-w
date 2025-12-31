import { prisma } from "./src/lib/prismadb";

async function fixSliderData() {
    try {
        // Mark existing animes as featured for testing
        const result = await prisma.anime.updateMany({
            data: { isFeatured: true }
        });
        console.log(`Updated ${result.count} animes to be featured.`);

        // Ensure Slam Dunk has a banner (it already does, but just in case)
        const slamDunk = await prisma.anime.findUnique({
            where: { id: "slam-dunk" }
        });

        if (slamDunk && !slamDunk.bannerImage) {
            await prisma.anime.update({
                where: { id: "slam-dunk" },
                data: { bannerImage: slamDunk.coverImage }
            });
            console.log("Updated Slam Dunk banner image.");
        }

    } catch (error) {
        console.error("Error fixing slider data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixSliderData();
