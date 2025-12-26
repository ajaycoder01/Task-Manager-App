
const Task = require('../models/Task');

// Get all tasks


const getTasks = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};

        //  FIX: ignore empty / All
        if (status && status !== "All" && status.trim() !== "") {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === 'admin') {
            tasks = await Task.find(filter)
                .populate('assignedTo', 'name email profileImageUrl');
        } else {
            tasks = await Task.find({
                ...filter,
                assignedTo: { $in: [req.user._id] }, // ✅ SAFE
            }).populate('assignedTo', 'name email profileImageUrl');
        }

        // completed checklist count
        tasks = tasks.map(task => {
            const completedCount = Array.isArray(task.todoChecklist)
                ? task.todoChecklist.filter(item => item.completed).length
                : 0;
            return { ...task._doc, completedTodoCount: completedCount };
        });

        const baseFilter =
            req.user.role === 'admin'
                ? {}
                : { assignedTo: { $in: [req.user._id] } };

        const [allTasks, pendingTasks, inProgressTasks, completedTasks] =
            await Promise.all([
                Task.countDocuments(baseFilter),
                Task.countDocuments({ ...baseFilter, status: 'Pending' }),
                Task.countDocuments({ ...baseFilter, status: 'In Progress' }),
                Task.countDocuments({ ...baseFilter, status: 'Completed' }),
            ]);

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });
    } catch (error) {
        console.error('Error in getTasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};




// Get task by ID

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);


    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
//  Create a new task
// Private (Admin only)-----------
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo = [],   // default
            attachments = [],
            todoChecklist = [],
        } = req.body;

        const assignedUsers = Array.isArray(assignedTo)
            ? assignedTo.filter(Boolean)   //  remove null/undefined
            : assignedTo
                ? [assignedTo]
                : [];

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo: assignedUsers,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        });

        //  POPULATE BEFORE SENDING RESPONSE
        // task = await task.populate(
        //   "assignedTo",
        //   "name email profileImageUrl"
        // );

        res.status(201).json({ message: 'Task created successfully', task });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
//  Update a task-------

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'assignedTo must be an array of user IDs' });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updateTask = await task.save();
        res.json({ message: 'Task updated successfully', updateTask });


    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
// Delete a task------

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
//  Update task status-----------

const updateTaskStatus = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is assigned
        const isAssigned = Array.isArray(task.assignedTo)
            ? task.assignedTo.some(userId => userId.toString() === req.user._id.toString())
            : task.assignedTo?.toString() === req.user._id.toString();

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Not authorized' });
        }

        // Update status
        task.status = req.body.status || task.status;

        // If completed, mark all checklist items completed
        if (task.status === 'Completed') {
            if (Array.isArray(task.todoChecklist)) {
                task.todoChecklist.forEach(item => (item.completed = true));
            }
            task.progress = 100;
        }

        await task.save();
        res.json({ message: 'Task status updated successfully', task });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}
//  Update task checklist

const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // console.log("assignedTo =", task.assignedTo);

        let isAssigned = false;

        // IF assignedTo is an array
        if (Array.isArray(task.assignedTo)) {
            isAssigned = task.assignedTo.some(
                id => id.toString() === req.user._id.toString()
            );
        }

        // IF assignedTo is a single ObjectId
        else if (task.assignedTo) {
            isAssigned = task.assignedTo.toString() === req.user._id.toString();
        }

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update checklist' });
        }

        task.todoChecklist = todoChecklist; // Replace with updated checklist

        // Auto-update progress based on checklist completion
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Auto-mark task as completed if all checklist items are done
        if (task.progress === 100) {
            task.status = 'Completed';
        } else if (task.progress > 0) {
            task.status = 'In Progress';
        } else {
            task.status = 'Pending';
        }
        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
        res.json({ message: 'Task checklist updated successfully', task: updatedTask });

    } catch (error) {
        console.error("Checklist Update Error:", error);  // <-- REAL error here
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

// Dashboard data
//  Private (Admin only)---------------

const getDashboardData = async (req, res) => {
    try {
        // Fetch statistics 
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ status: 'Completed' });

        const overdueTasks = await Task.countDocuments({
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() },
        });

        // Ensure all possible statuses are included
        const taskStatuses = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRow = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ''); // Remove spaces for response keys
            acc[formattedKey] =
                taskDistributionRow.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution['All'] = totalTasks; // Add total count to taskDistribution

        // Ensure all priority levels are included
        const taskPriorities = ['Low', 'Medium', 'High'];
        const taskPriorityLevelRow = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);
        const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
            acc[priority] =
                taskPriorityLevelRow.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Fetch recent 10 tasks--
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate assignedTo createdAt');
        res.json({
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevel,
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const baseMatch = { assignedTo: { $in: [userId] } };

        const totalTasks = await Task.countDocuments(baseMatch);
        const pendingTasks = await Task.countDocuments({ ...baseMatch, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ ...baseMatch, status: 'In Progress' });
        const completedTasks = await Task.countDocuments({ ...baseMatch, status: 'Completed' });

        const taskStatuses = ['Pending', 'In Progress', 'Completed'];

        const taskDistributionRow = await Task.aggregate([
            { $match: baseMatch },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            acc[status.replace(/\s/g, '')] =
                taskDistributionRow.find(i => i._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution.All = totalTasks;

        const taskPriorities = ['Low', 'Medium', 'High'];
        const taskPriorityLevelRow = await Task.aggregate([
            { $match: baseMatch },
            { $group: { _id: '$priority', count: { $sum: 1 } } },
        ]);

        const taskPriorityLevel = taskPriorities.reduce((acc, p) => {
            acc[p] = taskPriorityLevelRow.find(i => i._id === p)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find(baseMatch)
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevel,
            },
            recentTasks,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};



module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};

