import Supplier from '../models/supplier.model.js';
import Business from '../models/business.model.js';

const addSupplier = async(req, res) => {
    try {
        const { name, contactPerson, phone, email, address } = req.body;
        if (!name || !contactPerson || !phone || !email || !address) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const businessId = req.user.businessId;
        const newSupplier = new Supplier.create({
            businessId: businessId,
            name,
            contactPerson,
            phone,
            email,
            address
        });
        res.status(201).json({ message: "Supplier created successfully", newSupplier });
    } catch (error) {
        res.status(500).json({ message: "Error adding supplier", error: error.message });
    }
}

const getAllSuppliers = async(req, res) => {
    try {
        const businessId = req.user.businessId;
        const suppliers = await Supplier.find({businessId}).select('name contactPerson phone email address');
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Error getting suppliers", error: error.message });
    }
}

const getSupplierById = async(req, res) => {
    try {
        const { supplierId } = req.params;
        const businessId = req.user.businessId;
        const supplier = await Supplier.findOne({businessId, _id: supplierId}).select('name contactPerson phone email address');
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Error getting suppliers", error: error.message });
    }
}

const updateSupplier = async(req, res) => {
    try {
        const { supplierId } = req.params;
        const { name, contactPerson, phone, email, address } = req.body;

        const targetSupplier = await Supplier.findOne({ _id: supplierId, businessId: req.user.businessId });
        if (!targetSupplier){
            return res.status(404).json({ message: "Not found" })
        }

        const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, { new: true, runValidators: true });
        res.status(200).json({message: "Supplier updated successfully.", supplier});   
    } catch (error) {
        res.status(500).json({ message: "Error updating supplier", error: error.message });
    }
}

const deleteSupplier = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Error deleting supplier", error: error.message });
    }
}

export { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };