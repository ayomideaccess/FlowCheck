import { z } from 'zod';

export const addStaffSchema = z.object({
    firstName: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    lastName: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    email: z.string().trim().email(), 
    phoneNo: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    role: z.enum(["owner","admin","manager","sales-attendant"])
});

export const updateSchema = z.object({
    firstName: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    lastName: z.string().trim().min(3, "Name must contain at least 3 letters"), 
    phoneNo: z.string().regex(/^0\d{10}$/, "Please enter a valid phone number"), 
    role: z.enum(["owner","admin","manager","sales-attendant"])
});