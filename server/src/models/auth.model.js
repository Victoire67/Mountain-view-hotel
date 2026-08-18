const pool = require('../config/db'); // Your NeonDB Pool instance

const UserModel = {
    /**
     * Find a single user by their email address
     * Used during login verification
     */
    findByEmail: async (email) => {
        const query = `
            SELECT id, name, email, password_hash, role 
            FROM users 
            WHERE LOWER(email) = LOWER($1);
        `;
        const { rows } = await pool.query(query, [email.trim()]);
        return rows[0] || null;
    },

    /**
     * Find a user by their Primary Key ID
     * Used by auth middleware to verify active users from JWT payload
     */
    findById: async (id) => {
        const query = `
            SELECT id, name, email, role, created_at 
            FROM users 
            WHERE id = $1;
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0] || null;
    },

    /**
     * Create a new user record
     * Note: password_hash must be hashed using bcrypt before passing it here
     */
    createUser: async ({ name, email, passwordHash, role = 'admin' }) => {
        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at;
        `;
        const values = [name, email.trim().toLowerCase(), passwordHash, role];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
};

module.exports = UserModel;