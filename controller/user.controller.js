import User from '../models/user.model.js';

const addStaff = async (req, res) =>{
    try {
        const { firstName, lastName, email, phoneNo, role } = req.body;
        if (!firstName || !lastName || !email || !phoneNo || !role){
            return res.status(400).json({ message: "All fields are required." });
        }
        const allowedRolesToCreate = {
            owner: ["admin", "manager", "sales-attendant"],
            admin: ["manager", "sales-attendant"]
        };

        const requesterRole = req.user.role;
        const permittedRoles = allowedRolesToCreate[requesterRole] || [];

        if (!permittedRoles.includes(role)){
            return req.status(403).json({
                message: `A ${requesterRole} cannot create a user with ${role}`
            })
        }
        const businessId = req.user.businessId;
        const existingUser = await User.findOne({ businessId, email });
        if (existingUser){
            return res.status(409).json({ message:"This email is already registered under your business." });
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
    } catch (error) {
        res.status(500).json({ message: "Error adding staff", error: error.message });
    }
}

const getAllUsers = async (req, res) =>{
    try {
        if (!["owner","admin"].includes(req.user.role)){
            return res.status(403).json({ message: "You are not allowed to perform this action" })
        }

        const businessId = req.user.businessId;
        const users = await User.find({businessId}).select('firstName lastName email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error getting all users", error: error.message });
    }
}

const updateUserById = async (req, res) =>{
    try {
        const { userId } = req.params;
        const { firstName, lastName, phoneNo, role } = req.body;
        
        const targetUser = await User.findOne({ _id:userId, businessId: req.user.businessId });
        if (!targetUser){
            return res.status(404).json({ message: "Not found" })
        }
        if ( role && role !== targetUser.role) {
            const allowedRolesToAssign = {
                owner: ["admin","manager","sales-attendant"],
                admin:["manager","sales-attendant"]
            };
            const permitted = allowedRolesToAssign[req.user.role] || [];
            if (!permitted.includes(role)) {
                return res.status(403).json({ message: `You are not allowed to assign the role ${role} to ${targetUser}` })
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
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error: error.message });
    }
}

const deleteUser = async (req,res)=>{
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete({ _id:userId, businessId: req.user.businessId });
        if (!user){
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json({ message:"User deleted succesfully." })
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

export { addStaff, getAllUsers, updateUserById, deleteUser };