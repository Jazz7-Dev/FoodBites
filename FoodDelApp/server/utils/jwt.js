const jwt = require('jsonwebtoken');

// Secret key to sign the JWT token
const JWT_SECRET = process.env.JWT_SECRET || 'superssecret123'; // Use a strong secret key in production

// Generate a JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
