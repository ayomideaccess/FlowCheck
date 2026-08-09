import mongoose, { Schema } from "mongoose";
import Business from './business.model.js';
import validator from 'validator';

const supplierSchema = new Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Please, enter a valid email"
        }
    },
    address: {
        type: String
    }
})

supplierSchema.index({ businessId: 1, name: 1, email: 1 });

export default mongoose.model("Supplier", supplierSchema);