import jwt from 'jsonwebtoken';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import { verifyJWT } from '../utils/tokenUtils.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
  const token = authHeader.split(' ')[1];

  try {
    const { userId, email } = verifyJWT(token);
    req.user = { userId, email, token };
    next();

    
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default authMiddleware;
