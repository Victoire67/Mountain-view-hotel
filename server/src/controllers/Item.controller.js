// controllers/itemController.js
import {
  createItem,
  updateItem,
  deleteItem,
} from '../models/Item.model.js';
import { getItemsSnapshot, invalidateItemsCache } from '../cache/itemsCache.js';

// Browsers/CDNs may reuse the menu for 60s, then serve it stale for up to 10 min
// while revalidating in the background (a cheap 304 thanks to the ETag).
const PUBLIC_CACHE = 'public, max-age=60, stale-while-revalidate=600';

// Vercel compresses responses at its edge; sending our own br/gzip there would double up
const PRECOMPRESS = !process.env.VERCEL;

function isValidId(id) {
  return /^\d+$/.test(id);
}

// GET /api/items  (public — supports ?type=... and ?isFood=true/false)
export async function listItems(req, res) {
  try {
    const { snapshot, hit } = await getItemsSnapshot();
    const { type, isFood } = req.query;

    res.set('X-Cache', hit ? 'HIT' : 'MISS');
    res.set('Cache-Control', PUBLIC_CACHE);

    // Filtered views are computed in memory from the cached list — no DB round trip
    if (type || isFood !== undefined) {
      const wantFood = isFood === undefined ? undefined : isFood === 'true';
      const items = snapshot.items.filter(item =>
        (!type || item.type === type) && (wantFood === undefined || item.isFood === wantFood)
      );
      return res.json(items);
    }

    // Full list: answer conditional requests with 304, otherwise send pre-compressed bytes
    res.vary('Accept-Encoding'); // append, so CORS's `Vary: Origin` is kept
    res.set({
      ETag: snapshot.etag,
      'Content-Type': 'application/json; charset=utf-8',
    });
    if (req.fresh) return res.status(304).end();

    if (!PRECOMPRESS) return res.send(snapshot.body);
    const encoding = req.acceptsEncodings('br', 'gzip', 'identity');
    if (encoding === 'br') return res.set('Content-Encoding', 'br').send(snapshot.br);
    if (encoding === 'gzip') return res.set('Content-Encoding', 'gzip').send(snapshot.gzip);
    return res.send(snapshot.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

// GET /api/items/:id  (public)
export async function getItem(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid item id' });
  try {
    const { snapshot, hit } = await getItemsSnapshot();
    const item = snapshot.items.find(i => String(i.id) === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.set({ 'X-Cache': hit ? 'HIT' : 'MISS', 'Cache-Control': PUBLIC_CACHE });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
}

// POST /api/items  (admin only)
export async function addItem(req, res) {
  try {
    const { name, name_fr, price, type, description, isFood } = req.body;

    if (!name || price === undefined || !type || isFood === undefined) {
      return res.status(400).json({
        error: 'name, price, type, and isFood are required',
      });
    }

    const newItem = await createItem({ name, name_fr, price, type, description, isFood });
    invalidateItemsCache();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
}

// PUT /api/items/:id  (admin only)
export async function editItem(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid item id' });
  try {
    const updated = await updateItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    invalidateItemsCache();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

// DELETE /api/items/:id  (admin only)
export async function removeItem(req, res) {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: 'Invalid item id' });
  try {
    const deleted = await deleteItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    invalidateItemsCache();
    res.json({ message: 'Item deleted', item: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}
