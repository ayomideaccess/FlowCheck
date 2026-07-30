import { z } from 'zod';

export const addSupplierSchema = z.object({
    name: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    contactPerson: z.string().trim(), 
    phone: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    email: z.string().trim().email(), 
    address: z.string().trim().min(3)
});

export const updateSupplierSchema = z.object({
    name: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    contactPerson: z.string().trim(), 
    phone: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    email: z.string().trim().email(), 
    address: z.string().trim().min(3)
});