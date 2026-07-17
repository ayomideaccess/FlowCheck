import mongoose, { Schema } from "mongoose";
import User from './user.model.js';
import Business from './business.model.js';
import Product from './product.model.js';
import Supplier from './supplier.model.js';

const transactionSchema = new Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true  
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    transactionType: {
        type: String,
        enum: ["stock_in", "stock_out", "adjustment"],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unitCost: {
        type: Number
    },
    performedBy: {
        type: String,
        ref: "User"
    },
    note: {
        type: String
    }
}, { timestamps: true })

export default mongoose.model("Transaction", transactionSchema);