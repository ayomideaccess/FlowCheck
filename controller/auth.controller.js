import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTPEmail, sendLoginEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { generateOTP, hashOtp } from '../services/otp.service.js'; 
import generateToken from '../utils/generateToken.js';
import User from '../models/user.model.js';
import Business from '../models/business.model.js';
import mongoose from 'mongoose';

const registerBusinessOwner = async (req, res) => {
    const { 
        businessName, 
        businessAddress, 
        businessPhoneNo, 
        businessEmail, 
        firstName, 
        lastName, 
        email, 
        phoneNo, 
        password 
    } = req.body;

    if (!businessName || businessAddress || businessPhoneNo || businessEmail || !firstName || !lastName || !email || !phoneNo || !password){
        return res.status(400).json({ message: "All fields are required" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
        
    try {
        const business = await Business.create(
            [
                { 
                    name: businessName,
                    address: businessAddress,
                    phone: businessPhoneNo,
                    email: businessEmail
                }
            ], 
            { session }
        );

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //generate OTP
        const { otp, hashedOtp } = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); //10 minutes

        const owner = await User.create(
            [
                {
                    businessId: business[0]._id,
                    firstName,
                    lastName,
                    email,
                    phoneNo,
                    password: hashedPassword,
                    role: "owner",
                    isVerified: false,
                    otp: hashedOtp,
                    otpExpiry: otpExpires
                }
            ],
            { session }
        );

        business[0].ownerId = owner[0]._id;
        await business[0].save({ session });

        await session.commitTransaction();
        session.endSession();

        await sendOTPEmail(email, otp);

        res.status(201).json({
            message: "Business and owner registered successfully. Check your email for OTP.",
            businessId: business[0]._id,
            userId: owner[0]._id
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000){
            return res.status(409).json({ message: "Email already in use." });
        }
        return res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

//VERIFY OTP
const verifyOTP = async(req, res) => {
    try{
        const { businessId, email, otp } = req.body;

        const user = await User.findOne({businessId, email});
        if (!user){
            return res.status(400).json({message: "User not found"});
        }

        if (user.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        if (user.otpExpiry < new Date()){
            return res.status(400).json({message: "OTP has expired"});
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({message: "Email verified successfully. You can now log in."});
    } catch(error){
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const loginUser = async(req, res) => {
    try {
        const { businessId, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        if (!businessId){
            const matches = await User.find({email}).select("businessId role").populate("businessId", "businessName");

            if (matches.length === 0){
                return res.status(400).json({ message: "Invalid email or password." });
            }
            if (matches.length > 1) {
                return res.status(300).json({
                    message: "Multiple businesses found for this email. Please select one",
                    businesses: matches.map((m)=>({
                        businessId: m.businessId._id,
                        businessName: m.businessId.businessName
                    }))
                });
            }
            req.body.businessId = matches[0].businessId._id;
        }

        const user = await User.findOne({businessId, email});

        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        if(!user.isVerified){
            return res.status(400).json({message: "Email not verified. Please verify your email first."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateToken(user._id, user.businessId, user.role);

        await sendLoginEmail(email, user.firstName);
        res.status(200).json({message: "Login successful", token});

    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const logoutUser = async(req, res) => {
    try {
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const forgottenPassword = async(req,res) => {
    try {
        const { businessId, email } = req.body;

        if (!email){
            return res.status(400).json({ message: "Email is required." });    
        }
        if (!businessId) {
            const matches = await User.find({ email }).select("businessId").populate("businessId", "businessName");

            if (matches.length === 0) {
                return res.status(200).json({ message: "If this email exists, a reset code has been sent. " });
            }
            if (matches.length > 1) {
                return res.status(200).json({
                    message: "Multiple businesses found for this email",
                    businesses: matches.map((m) =>({
                        businessId: m.businessId._id,
                        businessName: m.businessId.businessName
                    }))
            });
        }
        req.body.businessId = matches[0].businessId,_id;
    }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        
        const passwordResetOTP = generateOTP();
        const passResetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); //10 minutes

        const hashedpasswordResetOtp = hashOtp(passwordResetOTP);

        await user.updateOne({
            $set:{
                passwordResetOTP: hashedpasswordResetOtp,
                passwordResetOTPExpiry: passResetOTPExpires
            }
        });

        await sendPasswordResetEmail(email, passwordResetOTP);
        res.status(200).json({message: "Password reset email sent. Check your email for OTP."});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

const resetPassword = async(req, res) => {
    try {
        const { email, businessId, passwordResetOTP, newPassword } = req.body;

        if (!email || !passwordResetOTP || !newPassword){
            return res.status(400).json({ message: "All details are required." });    
        }
        if (!businessId) {
            const matches = await User.find({ email }).select("businessId").populate("businessId", "businessName");

            if (matches.length === 0) {
                return res.status(200).json({ message: "Invalid email " });
            }
            if (matches.length > 1) {
                return res.status(200).json({
                    message: "Multiple businesses found for this email",
                    businesses: matches.map((m) =>({
                        businessId: m.businessId._id,
                        businessName: m.businessId.businessName
                    }))
            });
        }
        req.body.businessId = matches[0].businessId,_id;
    }


        const user = await User.findOne({email, businessId});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        if (user.passwordResetOTP !== passwordResetOTP){
            return res.status(400).json({message: "Invalid OTP"});
        }

        if (user.passwordResetOTPExpiry < new Date()){
            return res.status(400).json({message: "OTP has expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpiry = undefined;
        await user.save();

        res.status(200).json({message: "Password reset successful"});
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

export { registerBusinessOwner, forgottenPassword, verifyOTP, loginUser, logoutUser, resetPassword };