import Task from "../task/task.model.js";
import User from "./user.model.js";
import bcrypt from "bcryptjs";

// Get all users (admin only)

const getUsers = async (req, res) => {
    try {
        const { assignable, search } = req.query;
        const query = {};

        if (assignable === "true") {
            query.role = "user";
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const users = await User.find(query).select("-password").sort({ name: 1 });

        if (assignable === "true") {
            return res.status(200).json(users);
        }

        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "pending",
                });

                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "in-progress",
                });

                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "completed",
                });

                return {
                    ...user._doc, // Include all existing user data [cite: 77, 130]
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        );

        res.status(200).json(usersWithTaskCounts); 

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" ,error: error.message});
    }   
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" ,error: error.message});
    }   
};

export { getUsers, getUserById, deleteUser };