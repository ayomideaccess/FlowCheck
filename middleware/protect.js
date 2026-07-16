import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) =>{
    try {
        //get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if(!token){
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attain admin to request
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};