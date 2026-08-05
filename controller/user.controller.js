import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { sendUserEmail } from '../services/email.service.js';
import Business from '../models/business.model.js';

const addStaff = async (req, res) =>{
        const { firstName, lastName, email, phoneNo, role } = req.body;
        
        const allowedRolesToCreate = {
            owner: ["admin", "manager", "sales-attendant"],
            admin: ["manager", "sales-attendant"]
        };

        const requesterRole = req.user.role;
        const permittedRoles = allowedRolesToCreate[requesterRole] || [];

        if (!permittedRoles.includes(role)){
            throw new AppError(`A ${requesterRole} cannot create a user with ${role}`,403)
        }
        const businessId = req.user.businessId;
        const business = await Business.findById(businessId);
        const existingUser = await User.findOne({ businessId, email });
        if (existingUser){
            throw new AppError("This email is already registered under your business.",409);
        }

        const newStaff = await User.create({
            businessId,
            firstName,
            lastName,
            email,
            phoneNo,
            role,
            isVerified: true
        });

        await sendUserEmail(email, firstName, role, business.businessName);
        return res.status(201).json({ 
            message: "Staff member added successfully.",
            user: {
                id: newStaff._id,
                firstName: newStaff.firstName,
                lastName: newStaff.lastName,
                email: newStaff.email,
                role: newStaff.role
            }
         });
}

const getAllUsers = async (req, res) =>{
        const businessId = req.user.businessId;
        const { role, isActive, search } = req.query;
        const filter = { businessId };
        if (role) {
            filter.role = role;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        const business = await Business.findById(businessId);
        if (!business){
            throw new AppError("Business not found",404)
        }
        if (!["owner","admin"].includes(req.user.role)){
            throw new AppError("You are not allowed to perform this action",403)
        }
        const users = await User.find(filter).select('firstName lastName email role');
        res.status(200).json({
            success: true,
            users,
            name: business.businessName
        });
}

const updateUserById = async (req, res) =>{
        const { userId, businessId } = req.params;
        const { firstName, lastName, phoneNo, role } = req.body;

        if (businessId !== req.user.businessId.toString()){
            throw new AppError("You are not allowed to update users of this business",403)
        }

        const targetUser = await User.findOne({ _id:userId, businessId });
        if (!targetUser){
            throw new AppError("Not found",404)
        }
        if ( role && role !== targetUser.role) {
            const allowedRolesToAssign = {
                owner: ["admin","manager","sales-attendant"],
                admin:["manager","sales-attendant"]
            };
            const permitted = allowedRolesToAssign[req.user.role] || [];
            if (!permitted.includes(role)) {
                throw new AppError(`You are not allowed to assign the role ${role} to ${targetUser}`,403)
            }
        }

        const updates = { firstName, lastName, phoneNo, role };
        Object.keys(updates).forEach((key)=> updates[key] === undefined && delete updates[key]);

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        res.status(200).json({message: "User updated successfully.",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
         });
}

const deleteUser = async (req,res)=>{
        const { userId, businessId } = req.params;

        if (businessId !== req.user.businessId.toString()){
            throw new AppError("You are not allowed to delete users of this business",403)
        }
        if (userId === req.user._id.toString() ){
            throw new AppError("You cannot delete yourself",403)
        }

        const user = await User.findOne({ _id:userId, businessId });
        if ( user && user.role === "owner" ){
            throw new AppError("You are not allowed to delete the owner of the business",403)
        }
        if (!user){
            throw new AppError("Not found",404)
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message:"User deleted succesfully." })
}

export { addStaff, getAllUsers, updateUserById, deleteUser };