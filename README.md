# Skills Marketplace for Students

A modern web application where students can exchange skills and learn collaboratively.

## 🎯 Project Overview

This is a MERN stack application that allows students to:
- Register and login securely
- Create and manage profiles
- Post skills they can teach
- Search for skills posted by others
- Connect and chat with other students
- Learn collaboratively through skill-for-skill exchanges

## 🛠️ Tech Stack

**Frontend:**
- React.js (Functional Components + Hooks)
- Tailwind CSS
- Framer Motion (Animations)

**Backend:**
- Node.js
- Express.js
- JWT Authentication
- REST APIs

**Database:**
- MongoDB with Mongoose

## 📁 Project Structure

```
project mini_1/
├── server/          # Backend (Node.js + Express)
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware (auth, etc.)
│   └── server.js    # Main server file
├── client/          # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server` folder:
   ```env
   MONGO_URI=mongodb://localhost:27017/skills-marketplace
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```
   
   Then start the server:
   ```bash
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   npm install
   npm start
   ```

   The frontend will run on `http://localhost:5002` and the backend on `http://localhost:5000`

### MongoDB Setup

**Option 1: Local MongoDB**
- Install MongoDB locally
- Use connection string: `mongodb://localhost:27017/skills-marketplace`

**Option 2: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGO_URI` in `.env` file

## 📝 Development Notes

- This project is built incrementally, one feature at a time
- Code is written to be beginner-friendly and well-commented
- Follows modern best practices suitable for BCA final year projects

## 👨‍💻 Author

BCA Student - Final Year Project
