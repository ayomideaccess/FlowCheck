import Product from '../models/product.model.js';
import Businesss from '../models/business.model.js';
import Category from '../models/category.model.js';
import AppError from '../utils/AppError.js';

const addProduct = async(req, res) => {
    const { name, unitPrice, costPrice, currentStock, reorderLevel, unit, categoryId } = req.body;
    const category = await Category.findOne({ _id: categoryId, businessId: req.user.businessId });
    if (!category) {
        throw new AppError("Category not found",400);
    }
    const businessId = req.user.businessId;
    const newProduct = await Product.create({
        businessId,
        name,
        SKU,
        categoryId,
        unitPrice,
        costPrice,
        currentStock,
        reorderLevel,
        unit,
        isActive
    });
    res.status(201).json({ message: "Product created successfully", newProduct });
}

const getAllProducts = async(req, res) => {
    const businessId = req.user.businessId;
    const products = await Product.find({businessId}).select('name unitPrice costPrice currentStock reorderLevel unit');
    res.status(200).json(products);
}

const getProductById = async(req, res) => {
    const { productId } = req.params;
    const businessId = req.user.businessId;
    const product = await Product.findOne({businessId, _id:productId}).select('name unitPrice costPrice currentStock reorderLevel unit');
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