process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import dns from 'node:dns';
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import pg from 'pg';
import { execSync } from 'child_process';

async function setupDatabase() {
    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    console.log('Connecting to database...');

    const pool = new pg.Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Generating DDL script from Prisma schema...');
        const rawOutput = execSync('npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script', {
            encoding: 'utf-8',
            env: { ...process.env, NODE_OPTIONS: '--dns-result-order=ipv4first' }
        });

        // Remove non-SQL lines before the first SQL statement or comment
        const sqlIndex = rawOutput.indexOf('-- Create');
        const ddl = sqlIndex !== -1 ? rawOutput.substring(sqlIndex) : rawOutput;

        console.log('Applying DDL script to PostgreSQL database...');
        await pool.query(ddl);
        console.log('Database tables created successfully!');
    } catch (err: any) {
        console.error('Full Error:', err);
    } finally {
        await pool.end();
    }
}

setupDatabase();
