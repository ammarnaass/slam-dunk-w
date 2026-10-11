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

async function finalAudit() {
    await fixSingle('SELECT id, name, email, gender, "phoneNumber", "birthDate", avatar FROM "User" LIMIT 5', 'Audit Users');
    await fixSingle('SELECT id, title, "isFeatured", "bannerImage" FROM "Anime" LIMIT 5', 'Audit Animes');
}

finalAudit();
