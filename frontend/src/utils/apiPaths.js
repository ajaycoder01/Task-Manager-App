
export const BASE_URL = "https://task-manager-backend-kl5t.onrender.com";

//utils/apiPath.js

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Register a new user (Admin or Memeber)
        LOGIN: "/api/auth/login", // Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile" // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Get all users (Admin only) 
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID 
        CREATE_USER: "/api/users", // Create a new user (Admin only)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
        DELETE_USER: (userId) => `/api/users/${userId}`, // Dalete a user
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
        GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned tasks)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
        CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

        UPDATE_TASK_STATUS: ({ taskId }) => `/api/tasks/${taskId}/status`, // Update task status
        // UPDATE_TODO_CHECKLIST: ({taskId})=> `/api/tasks/${taskId}/todo`, // Update todo checklist
        UPDATE_TODO_CHECKLIST: ({ taskId }) => {
            if (!taskId) throw new Error("Task ID is required for updating checklist");
            return `/api/tasks/${taskId}/todo`;
        },

    },
    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Download all task as an Excel/PDF report
        EXPORT_USERS: "/api/reports/export/users", // Doenload user-task report
    },
    IMAGE: {
        UPLOAD_IMGAGE: "api/auth/upload-image",
    },
}
