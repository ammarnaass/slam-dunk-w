import { prisma } from "./src/lib/prismadb";

async function main() {
    console.log("Checking users in database...");

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                subscription: true
            }
        });

        console.log(`Total users found: ${users.length}`);

        if (users.length > 0) {
            console.log("\nUsers:");
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.name || user.email}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Created: ${user.createdAt}`);
                console.log(`   Subscription: ${user.subscription ? 'Yes' : 'No'}`);
                if (user.subscription) {
                    console.log(`   - Plan Type: ${user.subscription.planType}`);
                    console.log(`   - Active: ${user.subscription.isActive}`);
                }
            });
        } else {
            console.log("\nNo users found in database.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
