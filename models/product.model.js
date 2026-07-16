import mongoose, { Schema } from 'mongoose';
import Business from '../models/business.model.js';
import Category from '../models/category.model.js';
import { generateSKU } from '../services/generateSKU.js';

const productSchema = new Schema({
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    SKU:{
        type: String,
        required: true,
        unique: true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    costPrice:{
        type: Number
    },
    currentStock:{
        type: Number,
        default: 0
    },
    reorderLevel:{
        type: Number,
        default: 0
    },
    unit:{
        type: String
    },
    isActive:{
        type: Boolean,
        default: true
    }
})

productSchema.pre('save', async function(next){
    if (!this.SKU){
        const category = await Category.findById(this.categoryId).select('name');
        const categoryName = category?.name || 'GEN';

        let newSku;
        let exists = true;

        while (exists) {
            newSku = generateSKU(this.name, this.categoryId);
            const found = await this.constructor.findOne({
                businessId: this.businessId,
                SKU: newSku
            });
            exists = !!found;
        }
        this.SKU = newSku;
    }
    next();
});

export default mongoose.model('Product', productSchema);