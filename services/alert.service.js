import Alert from '../models/alert.model.js';
import Product from '../models/product.model.js';

export const checkAndUpdateLowStockAlert = async (productId, businessId, session = null) => {
    const product = await Product.findById(productId).session(session);

    if (!product) return;

    if (product.currentStock <= product.reorderLevel) {
        await Alert.findByIdAndUpdate(
        { businessId, productId, alertType: "low-stock", isResolved: false },
        { businessId, productId, alertType: "low-stock", isResolved: false },
        { upsert: true, session  }
        )
    } else {
        await Alert.updateMany(
            { businessId, productId, alertType: "low-stock", isResolved: false },
            { isResolved: true },
            { session }
        );
    }
};