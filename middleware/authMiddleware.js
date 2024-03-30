import jwt from 'jsonwebtoken';
import UnAuthenticatedError from '../errors/unauthenticated.js';
import { verifyJWT } from '../utils/tokenUtils.js';

const authMiddleware = async (req, res, next) => {
  const {token} = req.cookies;
  if (!token) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
  try {
    const {userId, email} = verifyJWT(token)
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default authMiddleware;