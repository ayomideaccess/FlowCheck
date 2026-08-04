import mongoose from 'mongoose';
import Alert from '../models/alert.model.js';
import Product from '../models/product.model.js';
import AppError from '../utils/AppError.js';
import Sale from '../models/sales.model.js';
import { getDateRange } from '../utils/dateRange.js';

const getLowStock = async (req, res) => {
    const businessId = req.user.businessId;

    const lowStockAlerts = await Alert.find({
        businessId,
        alertType: "low-stock",
        isResolved: false
    }).populate("productId", "name SKU currentStock reorderLevel");

    res.status(200).json({
        count: lowStockAlerts.length,
        alerts: lowStockAlerts
    })
}

const getStockValuation = async (req, res) => {
    const businessId = req.user.businessId;

    const result = await Product.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(businessId), isActive: true } },
        {
            $project: {
                name: 1,
                currentStock: 1,
                costPrice: 1,
                lineValue: { $multiply: ["$currentStock", "$costPrice"] }
            }
        },
        {
            $group: {
                _id: null,
                totalValue: { $sum: "$lineValue"},
                totalProduts: { $sum: 1 }
            }
        }
    ]);

    const summary = result[0] || { totalValue: 0, totalProducts: 0 };
    res.status(200).json(summary);
}

const getSalesSummary = async (req, res) => {
    const businessId = req.user.businessId;
    const { period } = req.query;

    const range = getDateRange(period);
    if (!range) {
        throw new AppError("period must be daily or monthly.", 404);
    }

    const result = await Sale.aggregate([
        {
            $match: {
                businessId: new mongoose.Types.ObjectId(businessId),
                createdAt: { $gte: range.start, $lte: range.end }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalSales: { $sum: 1 },
                averageSaleValue: { $avg: "$totalAmount" }
            }
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalSales: 1,
                averageSaleValue: 1
            }
        }
    ]);

    const summary = result[0] || { totalRevenue: 0, totalSales: 0, averageSaleValue: 0 };

    res.status(200).json({ period, ...summary });
}

export { getLowStock, getStockValuation, getSalesSummary };

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTZiYTYwY2I0YWNhYmM0ZmQzOWNkODMiLCJidXNpbmVzc0lkIjoiNmE2YmE2MGFiNGFjYWJjNGZkMzljZDgyIiwicm9sZSI6Im93bmVyIiwiaWF0IjoxNzg1ODU4MzE2LCJleHAiOjE3ODY0NjMxMTZ9.U_KRCRRZofVQOyQRBDCdDl6JAthOpfmab6MAVYxXRj8