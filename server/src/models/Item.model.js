// models/Item.js
import pool from '../config/db.js';

// Get all items, optionally filtered by type (category) or food/drink
export async function getAllItems({ type, isFood } = {}) {
  let query = 'SELECT * FROM items';
  const conditions = [];
  const values = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (isFood !== undefined) {
    values.push(isFood);
    conditions.push(`"isFood" = $${values.length}`);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY type, name';

  const result = await pool.query(query, values);
  return result.rows;
}

// Get a single item by id
export async function getItemById(id) {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return result.rows[0] || null;
}

// Create a new item
export async function createItem({ name, name_fr = '', price, type, description = '', isFood }) {
  const result = await pool.query(
    `INSERT INTO items (name, name_fr, price, type, description, "isFood")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, name_fr, price, type, description, isFood]
  );
  return result.rows[0];
}

// Update an existing item (partial updates supported)
export async function updateItem(id, fields) {
  const allowed = ['name', 'name_fr', 'price', 'type', 'description', 'isFood'];
  const setClauses = [];
  const values = [];

  for (const key of Object.keys(fields)) {
    if (!allowed.includes(key)) continue;
    values.push(fields[key]);
    const column = key === 'isFood' ? '"isFood"' : key;
    setClauses.push(`${column} = $${values.length}`);
  }

  if (setClauses.length === 0) {
    return getItemById(id);
  }

  values.push(id);
  const query = `
    UPDATE items
    SET ${setClauses.join(', ')}
    WHERE id = $${values.length}
    RETURNING *
  `;
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

// Delete an item
export async function deleteItem(id) {
  const result = await pool.query(
    'DELETE FROM items WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}