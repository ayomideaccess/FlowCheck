import { z } from 'zod';

export const addCategorySchema = z.object({
    name: z.string().trim().min(3,"Name must have at least 3 letters"), 
    description: z.string().trim().min(3)
});

export const updateCategorySchema = z.object({
    name: z.string().trim().min(3,"Name must have at least 3 letters"), 
    description: z.string().trim().min(3)
});