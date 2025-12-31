process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Pool } = require('pg');

async function fixSingle(query, label) {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        console.log(`\n--- ${label} ---`);
        const res = await pool.query(query);
        console.log(`Success: ${res.rowCount || (res.rows ? res.rows.length : 0)} records affected/retrieved.`);
        return res.rows;
    } catch (err) {
        console.error(`${label} Error:`, err);
    } finally {
        await pool.end();
    }
}

async function runAll() {
    await fixSingle('SELECT * FROM "Settings"', 'Check Settings');
    await fixSingle('UPDATE "Anime" SET "isFeatured" = true', 'Feature All');
    await fixSingle('UPDATE "Anime" SET "bannerImage" = "coverImage" WHERE "bannerImage" LIKE \'%hero-bg.jpg%\'', 'Replace hero-bg');
    await fixSingle('UPDATE "Anime" SET "bannerImage" = "coverImage" WHERE "bannerImage" IS NULL', 'Ensure Banners');
    const finalRows = await fixSingle('SELECT id, title, "isFeatured", "bannerImage" FROM "Anime"', 'Final Check');

    if (finalRows) {
        console.log('\n--- Final Data State ---');
        finalRows.forEach(r => {
            console.log(`[${r.id}] ${r.title} | Featured: ${r.isFeatured} | Banner: ${r.bannerImage ? r.bannerImage.substring(0, 50) + '...' : 'NULL'}`);
        });
    }
}

runAll();
