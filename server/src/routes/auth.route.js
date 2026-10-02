import  loginUser from '../controllers/auth.controller.js';

import express from "express"


const router = express.Router();

// POST /api/auth/login
router.post('/', loginUser);
export default router