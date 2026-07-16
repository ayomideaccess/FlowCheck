import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});


// Send OTP
export const sendOTPEmail = async (email, otp) =>{
    await transporter.sendMail({
        from: `"FlowCheck" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for FlowCheck',
        html: `
        <h2>Welcome to FlowCheck!</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="color: #6366f1">${otp}</h1>
        <p>This codes expires in <strong>10 minutes</strong>.</p> 
        <p>If you didn't request this, please ignore this email.</p>
        `
    });
};

export const sendLoginEmail = async (email, firstName)=>{
    await transporter.sendMail({
        from: `"FlowCheck" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'New login to your FlowCheck account',
        html: `
        <h2>Welcome back, ${firstName}👋</h2>
        <p>You just logged in to your FlowCheck account at <strong>${new Date().toLocaleString()}</strong></p>
        <p>If this wasn't you, please reset your password immediately.</p>
        `
    });
};

export const sendPasswordResetEmail = async (email, passwordResetOTP)=>{
    await transporter.sendMail({
        from: `"FlowCheck" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password for your FlowCheck account.</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #6366f1">${passwordResetOTP}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        `
    });
};
