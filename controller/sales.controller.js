import Buiness from '../models/business.model.js';
import Product from '../models/product.model.js';
import Sale from '../models/sales.model.js';
import SaleItem from '../models/saleItem.model.js';
import { checkAndUpdateLowStockAlert } from '../services/alert.service.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
        
    try {
        const { items } = req.body;
        const businessId = req.user.businessId;
        const soldBy = req.user._id;

        if ( !items || items.length === 0 ){
            await session.abortTransaction();
            throw new AppError("At least one item is required.", 400);
        }

        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items){
            const product = await Product.findOne({_id: item.productId, businessId }).session(session);

            if (!product){
                await session.abortTransaction();
                throw new AppError("Product not found.", 404);
            }
            if (product.currentStock < item.quantity){
                await session.abortTransaction();
                throw new AppError(`Insufficient stock for ${product.name}. Available stock: ${product.currentStock}`, 400);
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
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        throw new AppError(error.message, 500);
    }
};

const getAllSales = async (req, res) => {
    const businessId = req.user.businessId;
    const { soldBy, minAmount, maxAmount, startDate, endDate, sortBy, order, page=1, limit =5 } = req.query;
    const filter = { businessId };

    if (soldBy) filter.soldBy = soldBy;
    if (minAmount !== undefined || maxAmount !== undefined) {
        filter.totalAmount = {};
        if (minAmount !== undefined) filter.totalAmount.$gte = Number(minAmount);
        if (maxAmount !== undefined) filter.totalAmount.$lte = Number(maxAmount);
    }
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const allowedSortField = ['totalAmount', 'createdAt'];
    const sort = {};
    if (sortBy && allowedSortField.includes(sortBy)) {
        sort[sortBy] = order === 'desc' ? -1 : 1;
    } else {
        sort.createdAt = -1;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const sales = await Sale.find(filter)
    .populate("soldBy", "firstName lastName")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

    res.status(200).json(sales);
};

const getSaleById = async (req, res) => {
    const { saleId } = req.params;
    const businessId = req.user.businessId;

    const sale = await Sale.findOne({_id: saleId, businessId})
    .populate("soldBy", "firstName lastName");

    if (!sale) {
        throw new AppError("Sale not found.", 404);
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
}

export { createSale, getAllSales, getSaleById };