// server.js — runs the API as a long-lived Node process (local dev or any VPS/PaaS)
import app from './app.js';
import pool from './src/config/db.js';
import { warmItemsCache } from './src/cache/itemsCache.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Load the menu into memory right away so the first visitor gets a cache hit
const warmStart = Date.now();
warmItemsCache()
    .then(({ items }) => console.log(`Menu cache warmed: ${items.length} items in ${Date.now() - warmStart}ms`))
    .catch(err => console.error('Menu cache warm-up failed (will retry on first request):', err.message));

// Graceful shutdown: finish in-flight requests, then close DB connections
function shutdown(signal) {
    console.log(`${signal} received, shutting down...`);
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
