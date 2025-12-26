📝 Task Manager App (MERN Stack)

A full-stack Task Manager Application built using the MERN Stack that allows users to create, assign, track, and manage tasks efficiently with role-based access control.

🚀 Live Demo

Frontend: https://task-manager-app-hpgs.onrender.com

Backend API: https://task-manager-backend-kl5t.onrender.com

🛠 Tech Stack
Frontend

React.js (Vite)

Tailwind CSS

Axios

React Router DOM

Context API

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (for image uploads)

bcryptjs

Deployment

Render (Frontend & Backend)

MongoDB Atlas

✨ Features
👤 Authentication & Authorization

User Signup & Login

JWT-based authentication

Role-based access (Admin / Member)

Admin Invite Token support

📋 Task Management

Create, Update, Delete tasks

Assign tasks to multiple users

Task status tracking (Pending / In Progress / Completed)

Priority levels (Low / Medium / High)

Due date support

✅ Todo Checklist

Add checklist items per task

Mark checklist items as completed

Auto task progress calculation

📎 Attachments

Add external links as task attachments

Attachment count shown on task cards

👥 User Management (Admin)

View all users

Delete users (Admin only)

Prevent self-deletion

🖼 Profile Handling

Profile image upload (local)

Default avatar fallback

Letter-based avatar fallback for production safety

📊 Reports

Export task reports (Excel format)

📂 Project Structure
task-manager/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── uploads/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── main.jsx

🔐 Environment Variables
Backend .env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
ADMIN_INVITE_TOKEN=your_admin_secret
CLIENT_URL=https://task-manager-app-hpgs.onrender.com

2️⃣ Backend Setup
cd backend
npm install
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧠 Important Notes

Render uses ephemeral storage, so uploaded files may not persist.

Avatar fallback system is implemented for production stability.

For permanent image storage, Cloudinary or S3 can be integrated.

⭐ Show Your Support

If you like this project, please ⭐ the repository!

🔥 Final Note

This project is built to demonstrate real-world MERN stack skills, clean architecture, and production-ready practices.
