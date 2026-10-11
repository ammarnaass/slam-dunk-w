process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const { Pool } = require('pg');

async function checkRaw() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query('SELECT COUNT(*) FROM "Anime"');
        console.log(`Total animes (Raw SQL): ${res.rows[0].count}`);

        const featuredRes = await pool.query('SELECT count(*) FROM "Anime" WHERE "isFeatured" = true');
        console.log(`Featured animes (Raw SQL): ${featuredRes.rows[0].count}`);

        const sample = await pool.query('SELECT * FROM "Anime"');
        console.log(`Total animes: ${sample.rows.length}`);
        sample.rows.forEach(r => {
            console.log(`[${r.id}] ${r.title}`);
            console.log(`  Featured: ${r.isFeatured}`);
            console.log(`  Cover: ${r.coverImage}`);
            console.log(`  Banner: ${r.bannerImage}`);
        });

    } catch (err) {
        console.error('Raw DB Error:', err);
    } finally {
        await pool.end();
    }
}

checkRaw();
