# 📝 Task Manager App (MERN Stack)

A full-stack **Task Manager Application** built using the **MERN Stack** that helps users create, assign, track, and manage tasks efficiently with **role-based access control**.

---

## 📌 Description

This project is a real-world **Task Management System** developed using modern **MERN stack** practices.

It supports **Admin & Member roles**, secure authentication, task assignment, progress tracking, and reporting.

The application is designed with:
- Scalable architecture
- Clean & modern UI
- Production-ready features

---

## 🛠️ Technologies Used

### 🔹 Frontend
- ⚛️ React.js (Vite)
- 🎨 Tailwind CSS
- 🔗 Axios
- 🧭 React Router DOM
- 🌐 Context API

### 🔹 Backend
- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB (Mongoose)
- 🔐 JWT Authentication
- 📁 Multer (Image Uploads)
- 🔑 bcryptjs

### 🔹 Deployment
- ☁️ Render (Frontend & Backend)
- 🗄️ MongoDB Atlas

---

## ✨ Features

### 👤 Authentication & Authorization
- User Signup & Login
- JWT-based authentication
- Role-based access (**Admin / Member**)
- Admin Invite Token support

### 📋 Task Management
- Create, Update & Delete tasks
- Assign tasks to multiple users
- Task status tracking:
  - Pending
  - In Progress
  - Completed
- Priority levels:
  - Low
  - Medium
  - High
- Due date support

### ✅ Todo Checklist
- Add checklist items per task
- Mark checklist items as completed
- Auto task progress calculation

### 📎 Attachments
- Add external links as task attachments
- Attachment count visible on task cards

### 👥 User Management (Admin Only)
- View all users
- Delete users
- Self-deletion prevention

### 🖼️ Profile Handling
- Profile image upload (local storage)
- Default avatar fallback
- Letter-based avatar fallback for production safety

### 📊 Reports
- Export task reports in **Excel format**

---

## 📂 Project Structure

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


---

## 🔐 Environment Variables (Backend)

Create a `.env` file inside the **backend** folder:

.env file-----------
- PORT=5000
- MONGO_URI=your_mongodb_connection
- JWT_SECRET=your_jwt_secret
- ADMIN_INVITE_TOKEN=your_admin_secret

💻 How to Run Locally
1️⃣ Clone the Repository
 - git clone https://github.com/ajaycoder01/task-manager.git
2️⃣ Backend Setup
 -  cd backend
 -  npm install
 -  npm run dev
3️⃣ Frontend Setup
 - cd frontend
 - npm install
 - npm run dev
   
🧠 Important Notes
 - Render uses ephemeral storage, so uploaded files may not persist.
 - Avatar fallback system is implemented for production stability.
 - For permanent image storage, Cloudinary or AWS S3 can be integrated.
   
⭐ Show Your Support
 * Agar project pasand aaye, toh repository ko ⭐ star zaroor kare.

🔥 Final Note
 * This project is built to demonstrate real-world MERN stack skills,
   clean architecture, and production-ready practices.
