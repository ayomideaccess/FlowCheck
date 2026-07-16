import Product from '../models/product.model.js';
import Businesss from '../models/business.model.js';
import Category from '../models/category.model.js';

const addProduct = async(req, res) => {
    try {
        const { name, unitPrice, costPrice, currentStock, reorderLevel, unit, categoryId } = req.body;
        if (!name || !unitPrice || !costPrice || !currentStock || !reorderLevel || !categoryId){
            return res.status(400).json({ message: "Fields are required!" });
        }
        const category = await Category.findOne({ _id: categoryId, businessId: req.user.businessId });
        if (!category) {
            return res.status(400).json({ message: "Category not found" });
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
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
}

const getAllProducts = async(req, res) => {
    try {
        const businessId = req.user.businessId;
        const products = await Product.find({businessId}).select('name unitPrice costPrice currentStock reorderLevel unit');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error getting products", error: error.message });
    }
}

const getProductById = async(req, res) => {
    try {
        const { productId } = req.params;
        const businessId = req.user.businessId;
        const product = await Product.findOne({businessId, _id:productId}).select('name unitPrice costPrice currentStock reorderLevel unit');
        res.status(200).json(product);  
    } catch (error) {
        res.status(500).json({ message: "Error getting product", error: error.message });
    }
}

const updateProduct = async(req, res) => {
    try {
        const { productId } = req.params;
        const { name, unitPrice, costPrice, currentStock, reorderLevel, unit, categoryId } = req.body;

        const targetProduct = await User.findOne({ _id: productId, businessId: req.user.businessId });
        if (!targetProduct){
            return res.status(404).json({ message: "Not found" })
        }

        const product = await Product.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
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
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

const deleteProduct = async(req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndDelete({ _id: productId, businessId: req.user.businessId });
        if (!product){
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json({ message:"Product deleted succesfully." })
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}

export { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct }