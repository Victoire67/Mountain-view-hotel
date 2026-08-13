// routes/menuRoutes.js
import express from 'express';
import {
  listItems,
  getItem,
  addItem,
  editItem,
  removeItem,
} from '../controllers/Item.controller.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

// Public routes — anyone can view the menu
router.get('/', listItems);
router.get('/:id', getItem);

// Admin-only routes — require a valid JWT
router.post('/', verifyAdmin, addItem);
router.put('/:id', verifyAdmin, editItem);
router.delete('/:id', verifyAdmin, removeItem);

export default router;