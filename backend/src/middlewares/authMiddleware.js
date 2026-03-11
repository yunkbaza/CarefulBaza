const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'careful_baza_super_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Access denied." });
  
  jwt.verify(authHeader.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Session expired." });
    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;