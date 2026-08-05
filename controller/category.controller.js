import Category from '../models/category.model.js';
import Business from '../models/business.model.js';
import AppError from '../utils/AppError.js';

const addCategory = async(req, res) =>{
        const { name, description } = req.body;
        if (!name){
            throw new AppError("Category name is required!",400);
        }
        const businessId = req.user.businessId;
        const newCategory = await Category.create({
            businessId,
            name,
            description
        });
        res.status(201).json({ message: "Category created successfully", newCategory });
}

const getAllCategories = async(req, res) =>{
        const businessId = req.user.businessId;
        const { search } = req.query;
        const filter = { businessId };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } }
            ];
        }
        const categories = await Category.find(filter).select('name description');
        res.status(200).json(categories);
}

const updateCategory = async(req, res)=>{
        const { categoryId } = req.params;
        const { name, description } = req.body;

        const targetCategory = await Category.findOne({ _id:categoryId, businessId: req.user.businessId });
        if (!targetCategory){
            throw new AppError("Category not found", 404);
        }

        const category = await Category.findByIdAndUpdate(categoryId, req.body, { new: true, runValidators: true });
        res.status(200).json({message: "Category updated successfully.",
            category: {
                id: category._id,
                name: category.name,
                description: category.description
            }
            });
}

const deleteCategory = async (req,res)=>{
        const { categoryId } = req.params;

        const category = await Category.findByIdAndDelete({ _id:categoryId, businessId: req.user.businessId });
        if (!category){
            throw new AppError("Category not found", 404);
        }
        res.status(200).json({ message:"Category deleted succesfully." });
}

export { addCategory, getAllCategories, updateCategory, deleteCategory };