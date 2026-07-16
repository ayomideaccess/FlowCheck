import mongoose, { mongo, Schema } from "mongoose";
import validator from "validator";
import User from '../models/user.model.js';

const businessSchema = new Schema({
    businessName:{
        type: String,
        required: true,
        trim: true
    },
    businessAddress:{
        type: String,
        required: true
    },
    businessPhoneNo:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isMobilePhone,
            message: "Please enter a valid phone number"
        }
    },
    businessEmail:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email"
        }
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model("Business", businessSchema);