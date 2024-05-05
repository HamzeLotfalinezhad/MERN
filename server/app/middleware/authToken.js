import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from "../../config.js";

export default (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json('Unauthorized - No token provided');

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json('Forbidden - Invalid token');

    req.user = user; // Attach the decoded user information to the request object
    next();
  });
}