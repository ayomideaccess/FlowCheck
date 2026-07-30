import mongoose from 'mongoose';
import { z } from 'zod';

export const registerSchema = z.object({
    businessName: z.string().trim().min(3,"Name must be at least 3 letters"), 
    businessAddress: z.string().trim().min(3,"Address must be at least 3 letters"), 
    businessPhoneNo: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    businessEmail: z.string().trim().email(), 
    firstName: z.string().trim().min(3,"Name must be at least 3 letters"), 
    lastName: z.string().trim().min(3,"Name must be at least 3 letters"), 
    email: z.string().trim().email(), 
    phoneNo: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    password: z.string().min(8,"Password must be at least 8 characters")
});

export const verifySchema = z.object({
    businessId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    }),
    email: z.string().trim().email(), 
    otp: z.string().length(6, "OTP must contain 6 characters")
});

export const loginOwnerSchema = z.object({
    businessId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    }),
    email: z.string().trim().email(), 
    password: z.string().min(8,"Password must be at least 8 characters")
});

export const loginUserSchema = z.object({
    businessId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    }),
    email: z.string().trim().email()
});

export const forgottenSchema = z.object({
    businessId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    }),
    email: z.string().trim().email()
});

export const resetSchema = z.object({
    email:z.string().trim().email(), 
    businessId:  z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    }), 
    passwordResetOTP: z.string().length(6, "OTP must contain 6 characters"), 
    newPassword: z.string().min(8,"Password must be at least 8 characters")
});

export const resendOTPSchema = z.object({
    email: z.string().trim().email(),
    businessId:  z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid business ID"
    })
});
