// middleware/verifyAdmin.js
import jwt from 'jsonwebtoken';

export function verifyAdmin(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set — rejecting admin request.');
    return res.status(500).json({ error: 'Server authentication is not configured' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, username }
    next();
  
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}