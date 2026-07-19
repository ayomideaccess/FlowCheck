import mongoose from 'mongoose';
import Alert from '../models/alert.model.js';

const getLowStock = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Error getting low stock report", error: error.message });
    }
}

const getStockValuation = async (req, res) => {
    try {
        const businessId = req.user.businessId;

        const result = await CSSMathProduct.aggregate([
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

        const summary = result[0] || { totalValue: 0, totalProduts: 0 };
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: "Error calculating stock valuation", error: error.message });
    }
}

const getSalesSummary = async (req, res) => {
    try {
        const businessId = req.user.businessId;
        const { period } = req.query;

        const range = getDateRange(period);
        if (!range) {
            return res.status(404).json({ message: "period must be daily or monthly." });
        }

        const result = await getSalesSummary.aggregate([
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
            }
        ]);

        const summary = result[0] || { totalRevenue: 0, totalSales: 0, averageSaleValue: 0 };

        res.status(200).json({ period, ...summary });
    } catch (error) {
        res.status(500).json({ message: "Error getting sales summary", error: error.message });
    }
}

export { getLowStock, getStockValuation, getSalesSummary };