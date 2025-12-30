import dotenv from 'dotenv';
dotenv.config();

export default {
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
};
