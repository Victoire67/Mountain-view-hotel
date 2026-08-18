// controllers/itemController.js
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../models/Item.model.js';

// GET /api/menu  (public — supports ?type=... and ?isFood=true/false)
export async function listItems(req, res) {
  try {
    const { type, isFood } = req.query;
    const filters = {};
    if (type) filters.type = type;
    if (isFood !== undefined) filters.isFood = isFood === 'true';

    const items = await getAllItems(filters);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

// GET /api/menu/:id  (public)
export async function getItem(req, res) {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
}

// POST /api/menu  (admin only)
export async function addItem(req, res) {
  console.log("ADDING AN ITEM")
  try {
    const { name, name_fr, price, type, description, isFood } = req.body;

    if (!name || price === undefined || !type || isFood === undefined) {
      return res.status(400).json({
        error: 'name, price, type, and isFood are required',
      });
    }

    const newItem = await createItem({ name, name_fr, price, type, description, isFood });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
}

// PUT /api/menu/:id  (admin only)
export async function editItem(req, res) {
  try {
    const updated = await updateItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

// DELETE /api/menu/:id  (admin only)
export async function removeItem(req, res) {
  try {
    const deleted = await deleteItem(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted', item: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}