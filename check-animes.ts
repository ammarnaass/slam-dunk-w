import { prisma } from "./src/lib/prismadb";

async function checkAnimes() {
    try {
        const count = await prisma.anime.count();
        console.log(`Total animes: ${count}`);

        const featured = await prisma.anime.findMany({
            where: { isFeatured: true }
        });
        console.log(`Featured animes: ${featured.length}`);
        featured.forEach(a => console.log(`- ${a.title} (Featured)`));

        const all = await prisma.anime.findMany({
            take: 5
        });
        console.log(`First 5 animes:`);
        all.forEach(a => console.log(`- ${a.title} (isFeatured: ${a.isFeatured})`));

    } catch (error) {
        console.error("Error checking animes:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAnimes();
