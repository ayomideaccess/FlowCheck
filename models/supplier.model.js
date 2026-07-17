import mongoose, { Schema } from "mongoose";
import Business from './business.model.js';

const supplierSchema = new Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String
    },
    phone: {
        type: String
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

export default mongoose.model("Supplier", supplierSchema);