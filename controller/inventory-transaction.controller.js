import User from '../models/user.model.js';
import Business from '../models/business.model.js';
import Product from '../models/product.model.js';
import Supplier from '../models/supplier.model.js';
import Inventory from '../models/inventory-transaction.model.js';

const addStockIn = async(req,res) => {
    try {
        const { productId, supplierId, quantity, unitCost, note } = req.body;
        if (!productId || !supplierId || !quantity || !unitCost) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const businessId = req.user.businessId;
        const type = "stock_in";
        const newStock = await Inventory.create({
            businessId: businessId,
            productId,
            supplierId,
            transactionType:type,
            quantity,
            unitCost,
            performedBy,
            note
        });
        res.status(201).json({ message: "Stock added successsfully", newStock });
    } catch (error) {
        res.status(500).json({ message: "Error adding stock-in", error: error.message });
    }
}

const adjustInventory = async(req,res) => {
    try {
        const { productId, supplierId, quantity, unitCost, note } = req.body;
        if (!productId || !supplierId || !quantity || !unitCost || !note) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const businessId = req.user.businessId;
        const type = "adjustment";
        const newStock = await Inventory.create({
            businessId: businessId,
            productId,
            supplierId,
            transactionType:type,
            quantity,
            unitCost,
            performedBy,
            note
        });
        res.status(201).json({ message: "Adjustment made successsfully", newStock });
    } catch (error) {
        res.status(500).json({ message: "Error making adjustment", error: error.message });
    }
}

const getInventoryLog = async(req,res) => {
    try {
        const businessId = req.user.businessId;
        const { productId, startDate, endDate, transactionType } = req.query;
        const filter = { businessId };

        if (productId) filter.productId = productId;
        if (transactionType) filter.transactionType = transactionType;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const inventoryLog = await Inventory.find(filter);
        if (!inventoryLog) {
            return res.status(400).json({ message: "Inventory Log not found" });
        }
        res.status(200).json(inventoryLog);
    } catch (error) {
        res.status(500).json({ message: "Error getting inventory log", error: error.message });
    }
}

export { addStockIn, adjustInventory, getInventoryLog };