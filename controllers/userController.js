import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import UnAuthenticatedError from "../errors/unauthenticated.js";

const getCurrentUser = async (req, res) => {
        const user = await User.findOne({_id: req.user.userId})
       res.status(StatusCodes.OK).json({ user: user.id, email: user.email, token: req.user.token});
}

export {getCurrentUser} 