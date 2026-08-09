import mongoose, { Schema } from "mongoose";
import User from './user.model.js';
import Business from './business.model.js';

const saleSchema = new Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    soldBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        "required":true
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });


saleSchema.index({ businessId: 1, createdAt: -1 });
saleSchema.index({ businessId: 1, soldBy: 1, createdAt: -1 });
saleSchema.index({ businessId: 1, totalAmount: 1 });
export default mongoose.model("Sale", saleSchema);