import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import attachCookie from '../utils/attachCookie.js';
import { createJWT } from "../utils/tokenUtils.js";
import UnAuthenticatedError from "../errors/unauthenticated.js";

const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        throw new UnAuthenticatedError('please provide all field');
    }
    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists){
        throw new UnAuthenticatedError('email already in use');
    }
    const user = await User.create({name, email, password})

    const token = createJWT({userId: user._id, emaiil: user.email});
    attachCookie({ res, token });

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
            email: user.email,
            message: 'user created successfully'
        }
    })
}

const login = async (req, res) => {
    const {email, password, name} = req.body;
    
    if(!email || !password) {
        throw new UnAuthenticatedError('please provide all field');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
     throw new UnAuthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError('Invalid Credentials');
    }
    const token = createJWT({userId: user._id, emaiil: user.email});
    attachCookie({ res, token });
  
    res.status(StatusCodes.OK).json({ name: user.name, email: user.email, message: 'user created successfully'});

}
    
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
      });
      res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}
        
export {register, login, logout};

