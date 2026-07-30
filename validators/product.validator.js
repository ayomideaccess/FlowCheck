import { z } from 'zod';

export const addProductSchema = z.object({
    name: z.string().trim().min(3,"Name must contain at least 3 letters"), 
    unitPrice: z.number().positive(), 
    costPrice: z.number().positive(), 
    currentStock: z.number().positive(), 
    reorderLevel: z.number().positive(), 
    unit: z.number().positive(), 
    categoryId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid category ID"
    })
})

export const updateSchema = z.object({
    name: z.string().trim().min(3,"Name must contain at least 3 letters"), 
    unitPrice: z.number().positive(), 
    costPrice: z.number().positive(), 
    currentStock: z.number().positive(), 
    reorderLevel: z.number().positive(), 
    unit: z.number().positive(), 
    categoryId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid category ID"
    })
})