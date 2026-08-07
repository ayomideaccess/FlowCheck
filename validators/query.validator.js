import { z } from "zod";
import mongoose from "mongoose";

export const productQuerySchema = z.object({
    categoryId: z.string().refine((id)=> mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid category ID"
    }).optional(),
    isActive: z.enum(["true", "false"]).optional(),
    minPrice: z.coerce.number().min(0, "Minimum price must be a non-negative number").optional(),
    maxPrice: z.coerce.number().min(0, "Maximum price must be a non-negative number").optional(),
    sortBy: z.enum(["name","unitPrice", "currentStock"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1, "Page number must be a positive integer").default(1),
    limit: z.coerce.number().int().min(1, "Limit must be a positive integer").max(100).default(5)
}).refine(
    (data) => 
        data.minPrice === undefined || 
        data.maxPrice === undefined || 
        data.minPrice <= data.maxPrice,
        {
            message: "minPrice cannot be greater than maxPrice",
            path: ["minPrice"]
        }
);

export const supplierQuerySchema = z.object({
    search: z.string().trim().optional(),
    sortBy: z.enum(["name", "contactPerson", "email"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1, "Page number must be a positive integer").default(1),
    limit: z.coerce.number().int().min(1, "Limit must be a positive integer").max(100).default(5)
});

export const categoryQuerySchema = z.object({
    search: z.string().trim().optional(),
    sortBy: z.enum(["name"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1, "Page number must be a positive integer").default(1),
    limit: z.coerce.number().int().min(1, "Limit must be a positive integer").max(100).default(5)
});

export const userQuerySchema = z.object({
    role: z.enum(["admin","manager","sales-attendant"]).optional(),
    isActive: z.enum(["true", "false"]).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["firstName", "lastName", "role"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1, "Page number must be a positive integer").default(1),
    limit: z.coerce.number().int().min(1, "Limit must be a positive integer").max(100).default(5)
});

export const salesQuerySchema = z.object({
    soldBy: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid salesperson ID"
    }).optional(),
    minAmount: z.coerce.number().min(0, "Minimum amount must be a non-negative number").optional(),
    maxAmount: z.coerce.number().min(0, "Maximum amount must be a non-negative number").optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    sortBy: z.enum(["amount", "date"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1, "Page number must be a positive integer").default(1),
    limit: z.coerce.number().int().min(1, "Limit must be a positive integer").max(100).default(5)
}).refine(
    (data) => 
        data.minAmount === undefined || 
        data.maxAmount === undefined || 
        data.minAmount <= data.maxAmount,
        {
            message: "minAmount cannot be greater than maxAmount",
            path: ["minAmount"]
        }
).refine(
    (data) => 
        data.startDate === undefined || 
        data.endDate === undefined || 
        data.startDate <= data.endDate,
        {
            message: "startDate cannot be later than endDate",
            path: ["startDate"]
        }
);