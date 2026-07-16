import mongoose, { Schema } from "mongoose";
import Business from '../models/business.model.js';
import validator from "validator";

const userSchema = new Schema({
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email"
        }
    },
    phoneNo:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["owner", "admin", "manager", "sales-attendant"],
        required: true
    },
    password:{
        type: String,
        required: true
    },
    otp:{
        type: String
    },
    otpExpiry:{
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    passwordResetOTP:{
        type: String
    },
    passwordResetOTPExpiry: {
        type: Date
    }
}, {
    timestamps: true
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);