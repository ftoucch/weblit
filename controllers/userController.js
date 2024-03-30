import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user: user });
};

export { getCurrentUser };
