import Product from '../models/product.model.js';
import Businesss from '../models/business.model.js';
import Category from '../models/category.model.js';
import AppError from '../utils/AppError.js';
import { generateSKU } from '../services/generateSKU.js';

const addProduct = async(req, res) => {
    const { name, unitPrice, costPrice, currentStock, reorderLevel, unit, categoryId } = req.body;
    const category = await Category.findOne({ _id: categoryId, businessId: req.user.businessId });
    if (!category) {
        throw new AppError("Category not found",400);
    }
    const businessId = req.user.businessId;
    const sku = generateSKU(name, category.name);

    const existingProduct = await Product.findOne({ businessId, SKU: sku });
    if (existingProduct) {
        throw new AppError("Product with the same SKU already exists", 409);
    }
    const newProduct = await Product.create({
        businessId,
        name,
        SKU: sku,
        categoryId,
        unitPrice,
        costPrice,
        currentStock,
        reorderLevel,
        unit
    });
    res.status(201).json({ message: "Product created successfully", newProduct });
}

const getAllProducts = async(req, res) => {
    const businessId = req.user.businessId;
    const { categoryId, isActive, minPrice, maxPrice } = req.query;

    const filter = { businessId };
    if (categoryId) filter.categoryId = categoryId;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.unitPrice = {};
        if (minPrice !== undefined) filter.unitPrice.$gte = Number(minPrice);
        if (maxPrice !== undefined) filter.unitPrice.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).select('name unitPrice costPrice currentStock reorderLevel unit');

    res.status(200).json(products);
}

const getProductById = async(req, res) => {
    const { productId } = req.params;
    const businessId = req.user.businessId;
    const product = await Product.findOne({businessId, _id:productId}).select('name unitPrice costPrice SKU currentStock reorderLevel unit');
    res.status(200).json(product);  
}

const updateProduct = async(req, res) => {
    const { productId } = req.params;
    const { name, unitPrice, costPrice, currentStock, reorderLevel, unit, categoryId } = req.body;

    const targetProduct = await Product.findOne({ _id: productId, businessId: req.user.businessId });
    if (!targetProduct){
        throw new AppError("Not found",404)
    }

    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true });
    res.status(200).json({message: "Product updated successfully.",
        product: {
            id: product._id,
            name: product.name,
            unitPrice: product.unitPrice,
            costPrice: product.costPrice,
            currentStock: product.currentStock,
            reorderLevel: product.reorderLevel,
            SKU: product.SKU,
            unit: product.unit
        }
        });
}

const deleteProduct = async(req, res) => {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete({ _id: productId, businessId: req.user.businessId });
    if (!product){
        throw new AppError("Not found",404)
    }
    res.status(200).json({ message:"Product deleted succesfully." })
}

export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct }