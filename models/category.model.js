import mongoose, { Schema } from 'mongoose';
import Business from '../models/business.model.js';

const categorySchema = new Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

categorySchema.index({ businessId: 1, name: 1 });

export default mongoose.model('Category', categorySchema);