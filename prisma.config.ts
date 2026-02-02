import { readFileSync } from 'fs';
import { join } from 'path';

// Manually load DATABASE_URL from .env as Prisma 7 CLI doesn't auto-load for config files
let databaseUrl = process.env.DATABASE_URL;

try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
        databaseUrl = match[1].trim();
    }
} catch (e) {
    // Fallback to process.env
}

export default {
    schema: './prisma/schema.prisma',
    datasource: {
        url: databaseUrl,
    },
}
