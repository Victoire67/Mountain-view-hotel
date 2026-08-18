import  loginUser from '../controllers/auth.controller.js';

import express from "express"


const router = express.Router();

console.log("CONNECTING TO LOGIN FUNX")
// POST /api/auth/login
router.post('/', loginUser);
export default router