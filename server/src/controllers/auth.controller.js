import pool from '../config/db.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"



// POST /api/login

const loginUser = async (req, res) => {
    console.log("SOMEONE WANTS TO SIGN IN AS ADMIN")
    console.log(req.body)
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Query user from database
        const query = 'SELECT id, email, password_hash FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email.toLowerCase().trim()]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check password against stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

export default loginUser