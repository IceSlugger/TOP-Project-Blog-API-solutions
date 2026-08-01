const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// Pass the connection string to the driver adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Pass the adapter into PrismaClient (Required in Prisma 7)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;