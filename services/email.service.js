import dotenv from 'dotenv';
import { Zindua } from '@zindua/sdk';

dotenv.config();

const zindua = new Zindua({
    apiKey: process.env.ZINDUA_API_KEY,
});

export const sendOTPEmail = async (email, otp) => {
    await zindua.send({
        to: email,
        template: 'verify-otp',
        variables: {
            code: otp,
        },
    });
};

export const sendLoginEmail = async (email, firstName) => {
    await zindua.send({
        to: email,
        template: 'login-notification',
        variables: {
            name: firstName,
            loginTime: new Date().toLocaleString(),
        },
    });
};

export const sendUserEmail = async (
    email,
    firstName,
    role,
    businessName
) => {
    await zindua.send({
        to: email,
        template: 'user-welcome',
        variables: {
            name: firstName,
            role,
            businessName,
            loginUrl: `${process.env.APP_URL}/login`,
        },
    });
};


// Send password reset email
export const sendPasswordResetEmail = async (
    email,
    passwordResetOTP
) => {
    await zindua.send({
        to: email,
        template: 'password-reset',
        variables: {
            code: passwordResetOTP,
        },
    });
};