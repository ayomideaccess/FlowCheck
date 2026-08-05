import Supplier from '../models/supplier.model.js';
import Business from '../models/business.model.js';
import AppError from '../utils/AppError.js';

const addSupplier = async(req, res) => {
    const { name, contactPerson, phone, email, address } = req.body;
    if (!name || !contactPerson || !phone || !email || !address) {
        throw new AppError("All fields are required", 400);
    }
    const businessId = req.user.businessId;

    const supplierExists = await Supplier.findOne({ businessId, name, email });
    if (supplierExists) {
        throw new AppError("Supplier with this name and email already exists", 409);
    };
    const newSupplier = await Supplier.create({
        businessId: businessId,
        name,
        contactPerson,
        phone,
        email,
        address
    });
    res.status(201).json({ message: "Supplier created successfully", newSupplier });
}

const getAllSuppliers = async(req, res) => {
    const businessId = req.user.businessId;
    const { search } = req.query;
    const filter = { businessId };
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { contactPerson: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }
    const suppliers = await Supplier.find(filter).select('name contactPerson phone email address');
    res.status(200).json(suppliers);
}

const getSupplierById = async(req, res) => {
    const { supplierId } = req.params;
    const businessId = req.user.businessId;
    const supplier = await Supplier.findOne({businessId, _id: supplierId}).select('name contactPerson phone email address');
    res.status(200).json(supplier);
}

const updateSupplier = async(req, res) => {
    const { supplierId } = req.params;
    const { name, contactPerson, phone, email, address } = req.body;

    const targetSupplier = await Supplier.findOne({ _id: supplierId, businessId: req.user.businessId });
    if (!targetSupplier){
        throw new AppError("Not found", 404);
    }

    const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, { new: true, runValidators: true });
    res.status(200).json({message: "Supplier updated successfully.", supplier});   
}

const deleteSupplier = async(req, res) => {
    const { supplierId } = req.params;

    const supplier = await Supplier.findByIdAndDelete({ _id:supplierId, businessId: req.user.businessId });
    if (!supplier){
        throw new AppError("Supplier not found", 404);
    }
    res.status(200).json({ message:"Supplier deleted succesfully." });
}

export { addSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };