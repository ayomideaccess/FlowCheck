import crypto from 'crypto';

export const generateOTP =()=>{
    const otp = crypto.randomInt(100000,999999).toString(); //6-digits
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    return { otp, hashedOtp };
};

export const hashOtp = (otp) =>{
    return crypto.createHash("sha256").update(otp).digest("hex");
};