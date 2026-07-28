import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOTPEmail, sendLoginEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { generateOTP, hashOtp } from '../services/otp.service.js'; 
import generateToken from '../utils/generateToken.js';
import User from '../models/user.model.js';
import Business from '../models/business.model.js';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

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

    if (!businessName || !businessAddress || !businessPhoneNo || !businessEmail || !firstName || !lastName || !email || !phoneNo || !password){
        throw new AppError("All fields are required",400);
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
            throw new AppError("Email already in use.", 409);
        }
        throw new AppError("Registration failed", 500);
    }
};

//VERIFY OTP
const verifyOTP = async(req, res) => {
        const { businessId, email, otp } = req.body;

        const user = await User.findOne({businessId, email});
        if (!user){
            throw new AppError("User not found", 404);
        }

        if (user.otp !== otp){
            throw new AppError("Invalid OTP",400);
        }

        if (user.otpExpiry < new Date()){
            throw new AppError("OTP has expired", 400);
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({message: "Email verified successfully. You can now log in."});
    }

const loginOwner = async(req, res) =>{
        const { businessId, email, password } = req.body;

        // if (!email || !password) {
        //     return res.status(400).json({ message: "Email and password are required" })
        // }
        if (req.user.role !== "owner") {
            throw new AppError("You cannot login as the owner",400);
        }
        if (!businessId){
            const matches = await User.find({email}).select("businessId role").populate("businessId", "businessName");

            if (matches.length === 0){
                throw new AppError("Invalid credentials", 400);
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
            throw new AppError("User not found",404);
        }
        if(!user.isVerified){
            throw new AppError("Email not verified. Please verify your email first.",400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new AppError("Invalid credentials",400);
        }

        const token = generateToken(user._id, user.businessId, user.role);

        await sendLoginEmail(email, user.firstName);
        res.status(200).json({message: "Login successful", token});
}

const loginUser = async(req, res) => {
        const { businessId, email } = req.body;

        if (!email) {
            throw new AppError("Email is required",400)
        }

        if (req.user.role === "owner") {
            throw new AppError("You need to login as the owner",400);
        }

        if (!businessId){
            const matches = await User.find({email}).select("businessId role").populate("businessId", "businessName");

            if (matches.length === 0){
                throw new AppError("Invalid email",400);
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
            throw new AppError("User not found",404);
        }
        if(!user.isVerified){
            throw new AppError("Email not verified. Please verify your email first.",400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new AppError("Invalid credentials",400);
        }

        const token = generateToken(user._id, user.businessId, user.role);

        await sendLoginEmail(email, user.firstName);
        res.status(200).json({message: "Login successful", token});
}

const logoutUser = async(req, res) => {
        res.status(200).json({message: "Logout successful"});
}

const forgottenPassword = async(req,res) => {
        const { businessId, email } = req.body;

        if (!email){
            throw new AppError("Email is required.",400);    
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
            throw new AppError("User not found",404);
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
}

const resetPassword = async(req, res) => {
        const { email, businessId, passwordResetOTP, newPassword } = req.body;

        if (!email || !passwordResetOTP || !newPassword){
            throw new AppError("All details are required.",400);    
        }
        if (!businessId) {
            const matches = await User.find({ email }).select("businessId").populate("businessId", "businessName");

            if (matches.length === 0) {
                throw new AppError("Invalid email",400);
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
            throw new AppError("User not found",400);
        }

        if (user.passwordResetOTP !== passwordResetOTP){
            throw new AppError("Invalid OTP",400);
        }

        if (user.passwordResetOTPExpiry < new Date()){
            throw new AppError("OTP has expired",400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpiry = undefined;
        await user.save();

        res.status(200).json({message: "Password reset successful"});
}

export { registerBusinessOwner, forgottenPassword, verifyOTP, loginUser, logoutUser, resetPassword };