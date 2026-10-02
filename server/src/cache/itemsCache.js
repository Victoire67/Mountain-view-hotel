// cache/itemsCache.js
//
// In-memory cache for the public menu.
//
// The menu is small and read far more often than it is written, so we keep the
// whole list in memory together with ready-to-send JSON, gzip and brotli
// buffers and a content-hash ETag. Reads never touch the database while the
// cache is fresh; once it is older than the TTL we keep serving the stale copy
// and refresh it in the background (stale-while-revalidate). Any admin write
// calls invalidateItemsCache(), so changes show up immediately.
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { getAllItems } from '../models/Item.model.js';

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

// On Vercel several instances may run at once and an admin write only clears the
// instance that handled it, so the others refresh sooner.
const TTL_MS = Number(process.env.ITEMS_CACHE_TTL_MS) || (process.env.VERCEL ? 60 * 1000 : 5 * 60 * 1000);

let snapshot = null; // { items, body, gzip, br, etag, loadedAt }
let loading = null; // in-flight build, shared by concurrent callers
let generation = 0; // bumped on invalidation so stale builds are discarded

async function build() {
  const startedAt = generation;
  const items = await getAllItems();
  const body = Buffer.from(JSON.stringify(items));

  const [gz, br] = await Promise.all([
    gzip(body, { level: zlib.constants.Z_BEST_COMPRESSION }),
    brotli(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }),
  ]);

  const next = {
    items,
    body,
    gzip: gz,
    br,
    // Content-based, so the ETag survives restarts and identical rebuilds
    etag: `"${createHash('sha1').update(body).digest('base64url')}"`,
    loadedAt: Date.now(),
  };

  // An admin write happened while we were querying: don't publish old data
  if (startedAt === generation) snapshot = next;
  return next;
}

function refresh() {
  if (!loading) {
    const p = build().finally(() => {
      if (loading === p) loading = null;
    });
    loading = p;
  }
  return loading;
}

/**
 * Returns the cached menu snapshot and whether it was served from memory.
 * Only the very first request (or the first after an invalidation) waits on the DB.
 */
export async function getItemsSnapshot() {
  if (snapshot) {
    if (Date.now() - snapshot.loadedAt > TTL_MS) {
      refresh().catch(err => console.error('[itemsCache] background refresh failed:', err.message));
    }
    return { snapshot, hit: true };
  }
  return { snapshot: await refresh(), hit: false };
}

/** Drop the cache after a write and start rebuilding it right away. */
export function invalidateItemsCache() {
  generation++;
  snapshot = null;
  loading = null;
  refresh().catch(err => console.error('[itemsCache] rebuild after write failed:', err.message));
}

/** Fill the cache at startup so the first visitor doesn't wait on the DB. */
export function warmItemsCache() {
  return refresh();
}
