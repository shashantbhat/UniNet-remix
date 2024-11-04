// global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
    var __db: PrismaClient | undefined; // Adjust as needed
}

let db: PrismaClient;

if (!global.__db) {
    global.__db = new PrismaClient();
}

// Assign the instance to the db variable
db = global.__db;

// Export the db instance
export { db };