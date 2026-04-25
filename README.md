🚀 SkillHub – Skill Sharing Web Application

A modern MERN stack web application where students can exchange skills and learn collaboratively.

🎯 Project Overview

SkillHub is a full-stack web application that enables students to connect, share, and learn new skills through peer-to-peer collaboration.

👨‍🎓 Users can:
Register and login securely
Create and manage profiles
Post skills they can teach
Search and explore skills from other users
Connect and chat in real-time
Learn collaboratively via skill exchange
🛡️ Admin Features:
Secure admin login
View all registered users
Delete users from the platform
Remove inappropriate or unwanted skills
Automatic deletion of all associated skills when a user is removed
🛠️ Tech Stack
🔹 Frontend
React.js (Functional Components & Hooks)
Tailwind CSS
Framer Motion (Animations)
🔹 Backend
Node.js
Express.js
JWT Authentication
RESTful APIs
🔹 Database
MongoDB with Mongoose
📁 Project Structure
project mini_1/
├── server/              # Backend (Node.js + Express)
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & custom middleware
│   └── server.js        # Main server file
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── context/     # State management
│   │   └── App.js       # Main React app
│   └── package.json
│
└── README.md
🚀 Getting Started
📌 Prerequisites
Node.js (v14 or higher)
MongoDB (Local or Atlas)
npm or yarn
⚙️ Backend Setup
cd server
npm install

Create a .env file in the server folder:

MONGO_URI=mongodb://localhost:27017/skills-marketplace
PORT=5000
JWT_SECRET=your_super_secret_jwt_key

Start the backend server:

npm run dev
💻 Frontend Setup
cd client
npm install
npm start
Frontend runs on: http://localhost:5002
Backend runs on: http://localhost:5000
🗄️ MongoDB Setup
Option 1: Local MongoDB
Install MongoDB locally
Use connection string:
mongodb://localhost:27017/skills-marketplace
Option 2: MongoDB Atlas
Create a cluster on MongoDB Atlas
Replace MONGO_URI in .env with your cloud connection string
🔐 Key Features
👤 User Features
Authentication using JWT
Skill posting and browsing
Real-time communication
Responsive UI
🛠️ Admin Dashboard
Admin authentication
Manage all users
Delete users and their data
Remove skills posted by users
Cascade deletion: removing a user automatically deletes their skills
🧪 Testing & Quality Focus
UI tested for responsiveness and layout issues
Authentication flows verified
API responses validated
Bug identification and resolution implemented
📝 Development Notes
Built using modern MERN stack architecture
Follows clean code and modular structure
Beginner-friendly and scalable
Suitable for BCA final year project
👨‍💻 Author

Ankit Kumar
BCA Final Year Student