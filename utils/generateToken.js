import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, businessId, role) =>{
    return jwt.sign(
        { userId, businessId, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m'}
    );
};

export const generateRefreshToken = (userId, businessId, role) => {
  return jwt.sign({ userId, businessId, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
