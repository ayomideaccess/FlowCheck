import jwt from 'jsonwebtoken';

const generateToken = (userId, businessId, role) =>{
    return jwt.sign(
        { userId, businessId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );
};

export default generateToken;