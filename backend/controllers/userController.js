const Task = require('../models/Task');
const User = require('../models/User');

// Get all users (admin only)---------------

const getUser = async (req, res) => {
    try {
        const users = await User.find({role:'member'}).select('-password');   

        // Add task count for each user
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {
           const pendingTasks = await Task.countDocuments({ assignedTo: user._id, 
            status: 'Pending' });
           const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, 
            status: 'In Progress' });
           const completedTasks = await Task.countDocuments({ assignedTo: user._id, 
            status: 'Completed' });
           return {
             ...user.toObject(),
            //    ...user._doc, // Include all existing user data
               pendingTasks,
                inProgressTasks,
               completedTasks
           };
        }));
        res.json(usersWithTaskCount);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }  
};

//    Get a specific user by ID

const getUserById = async (req, res) => {  
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Delete a user (admin only)

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    getUser,
    getUserById,
    deleteUser
};
