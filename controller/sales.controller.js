import Buiness from '../models/business.model.js';
import Product from '../models/product.model.js';
import Sale from '../models/sales.model.js';
import SaleItem from '../models/saleItem.model.js';
import { checkAndUpdateLowStockAlert } from '../services/alert.service.js';

const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
        
    try {
        const { items } = req.body;
        const businessId = req.user.businessId;
        const soldBy = req.user.userId;

        if ( !items || items.length === 0 ){
            await session.abortTransaction();
            return res.status(400).json({ message: "At least one item is required." })
        }

        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items){
            const product = await Product.findOne({_id: item.productId, businessId }).session(session);

            if (!product){
                await abortTransaction();
                return res.status(404).json({ message: `${product.name} not found.`});
            }
            if (product.currentStock < item.quantity){
                await abortTransaction();
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available stock: ${product.currentStock}` });
            }
            const lineTotal = product.unitPrice * item.quantity;
            totalAmount+=lineTotal;

            validatedItems.push({
                productId: product._id,
                quantity: item.quantity,
                unitPrice: product.unitPrice
            });
        }

        const sale = await Sale.create(
            [{ businessId, soldBy, totalAmount }], { session }
        );

        for (const item of validatedItems) {
            await SaleItem.create(
                [
                    {
                        saleId: sale[0]._id,
                        businessId,
                        soldBy,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    }
                ], { session }
            );

        await Product.updateOne(
            { _id: item.productId },
            { $inc: { currentStock: -item.quantity } },
            { session }
        );
        await checkAndUpdateLowStockAlert(item.productId, businessId, session);
        }
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Sale recorded successfully.",
            saleId: sale[0]._id,
            totalAmount
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Error recording sale", error: error.message });
    }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find({ businessId: req.user.businessId })
        .populate("soldBy", "firstName lastName")
        .sort({ createdAt: -1 });

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error getting sales", error: error.message });
    }
};

const getSaleById = async (req, res) => {
    try {
        const { saleId } = req.params;
        const businessId = req.user.businessId;

        const sale = await Sale.findOne({_id: saleId, businessId})
        .populate("soldBy", "firstName lastName");

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        const items = await SaleItem.find({ saleId })
        .populate("productId", "name SKU");

        const calculatedTotal = items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice, 0
        );

        const isConsistent = calculatedTotal === sale.totalAmount;
        
        res.status(200).json({
            sale,
            items,
            calculatedTotal,
            isConsistent
        })
    } catch (error) {
        res.status(500).json({ message: "Error getting sale", error: error.message });
    }
}

export { createSale, getAllSales, getSaleById };