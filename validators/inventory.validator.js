import { z } from 'zod';

export const addStockSchema = z.object({
    productId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
             message: "Invalid product ID"
         }), 
    supplierId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
            message: "Invalid supplier ID"
        }), 
    quantity: z.number().positive().min(1), 
    unitCost: z.number().positive(), 
    note: z.string().trim().optional()
})

export const adjustSchema = z.object({
    productId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
             message: "Invalid product ID"
         }), 
    supplierId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
            message: "Invalid supplier ID"
        }), 
    quantity: z.number().positive().min(1), 
    unitCost: z.number().positive(), 
    note: z.string().trim().min(3),
    adjustmentType: z.enum(["increase", "decrease"])
})