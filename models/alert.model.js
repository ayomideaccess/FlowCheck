import mongoose, { Schema } from "mongoose";

const alertSchema = new Schema({
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
    alertType: {
        type: String,
        enum: ["low-stock"]
    },
    isResolved: {
        type: Boolean,
        default: false
    }
})

alertSchema.index({ businessId: 1, alertType: 1, isResolved: 1 });
export default mongoose.model("Alert", alertSchema);