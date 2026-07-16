import Category from '../models/category.model.js';
import Business from '../models/business.model.js';

const addCategory = async(req, res) =>{
    try {
        const { name, description } = req.body;
        if (!name){
            return res.status(400).json({ message: "Category name is required!" });
        }
        const businessId = req.user.businessId;
        const newCategory = await Category.create({
            businessId,
            name,
            description
        });
        res.status(201).json({ message: "Category created successfully", newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error adding category", error: error.message });
    }
}

const getAllCategories = async(req, res) =>{
    try {
        const businessId = req.user.businessId;
        const categories = await Category.find({businessId}).select('name');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error getting categories", error: error.message });
    }
}

const updateCategory = async(req, res)=>{
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;

        const targetCategory = await User.findOne({ _id:categoryId, businessId: req.user.businessId });
        if (!targetCategory){
            return res.status(404).json({ message: "Not found" })
        }

        const category = await Category.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        res.status(200).json({message: "Category updated successfully.",
            category: {
                id: category._id,
                name: category.name,
                description: category.description
            }
            });

    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
}

const deleteCategory = async (req,res)=>{
    try {
        const { categoryId } = req.params;

        const category = await Category.findByIdAndDelete({ _id:categoryId, businessId: req.user.businessId });
        if (!category){
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json({ message:"Category deleted succesfully." })
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
}

export { addCategory, getAllCategories, updateCategory, deleteCategory };