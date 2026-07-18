import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import suppliersRoutes from './routes/supplier.routes.js';
import transactionRoutes from './routes/inventory-transaction.routes.js';
import salesRoutes from './routes/sales.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
const startConnection = async () => {
    try {
        await connectDB();
        app.on("error", (error)=>{
            console.error(error);
        })

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
startConnection();

app.use('/auth', authRoutes);
app.use('/', userRoutes);
app.use('/', categoryRoutes);
app.use('/products', productRoutes);
app.use('/suppliers', suppliersRoutes);
app.use('/transactions', transactionRoutes);
app.use('/sales', salesRoutes);