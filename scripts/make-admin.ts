process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function makeAdmin(email: string, password?: string) {
    try {
        console.log(`Setting up admin with email: ${email}`);

        const updateData: any = { role: 'ADMIN' };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.upsert({
            where: { email },
            update: updateData,
            create: {
                email,
                name: email.split('@')[0],
                password: password ? await bcrypt.hash(password, 10) : await bcrypt.hash('admin123', 10),
                role: 'ADMIN',
            },
        });
        console.log(`Success! ${user.email} is now an ADMIN with the provided password.`);
    } catch (error) {
        console.error("Error setting up admin account:", error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2] || "amarnaas1981@gmail.com";
const password = process.argv[3] || "0674784859";
makeAdmin(email, password);
