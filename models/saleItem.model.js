import mongoose, { Schema } from 'mongoose';
import Sale from './sales.model.js';
import Business from './business.model.js';
import Product from './product.model.js';

const saleItemSchema = new Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });