# Setup Guide - Skills Marketplace

## Quick Start Guide

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `server` folder:

```env
MONGO_URI=mongodb://localhost:27017/skills-marketplace
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_12345
```

**For MongoDB Atlas (Cloud):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Update `MONGO_URI` in `.env`

### Step 3: Start MongoDB

**If using local MongoDB:**
- Make sure MongoDB is running on your system
- Default connection: `mongodb://localhost:27017`

**If using MongoDB Atlas:**
- No local installation needed
- Just use the connection string from Atlas

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend will run on `http://localhost:5002`

### Step 5: Test the Application

1. Open `http://localhost:5002` in your browser
2. Click "Sign Up" to create an account
3. Fill in your details and register
4. You'll be automatically logged in
5. Go to Profile to post your first skill
6. Browse Skills to see what others are offering

## Features Available

✅ User Registration & Login
✅ User Profile Management
✅ Post Skills (Teaching/Learning)
✅ Browse & Search Skills
✅ View Skill Details
✅ Send Messages to Other Students
✅ Real-time Chat Interface
✅ Modern UI with Animations

## Troubleshooting

**Backend won't start:**
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

**Frontend won't start:**
- Make sure backend is running first
- Check if port 3000 is available
- Try deleting `node_modules` and running `npm install` again

**Database connection error:**
- Verify MongoDB connection string in `.env`
- Check if MongoDB service is running
- For Atlas: Check IP whitelist settings

## Project Structure

```
project mini_1/
├── server/
│   ├── models/          # Database models (User, Skill, Message)
│   ├── routes/          # API routes (auth, skills, messages, users)
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Main server file
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, PrivateRoute)
│   │   ├── pages/       # Page components (Home, Login, Profile, etc.)
│   │   ├── context/     # React Context (AuthContext)
│   │   ├── utils/       # Utility functions (API calls)
│   │   ├── App.js       # Main app component with routing
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## API Endpoints

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

**Skills:**
- GET `/api/skills` - Get all skills (with filters)
- GET `/api/skills/:id` - Get skill by ID
- POST `/api/skills` - Create new skill (auth required)
- PUT `/api/skills/:id` - Update skill (auth required)
- DELETE `/api/skills/:id` - Delete skill (auth required)

**Messages:**
- POST `/api/messages` - Send message (auth required)
- GET `/api/messages/conversations` - Get all conversations (auth required)
- GET `/api/messages/conversation/:userId` - Get conversation with user (auth required)

**Users:**
- GET `/api/users/:id` - Get user profile
- PUT `/api/users/profile` - Update profile (auth required)

## Technologies Used

- **Frontend:** React.js, React Router, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Database:** MongoDB with Mongoose
- **Icons:** React Icons

## Next Steps for Development

1. Add image upload for user profiles
2. Add skill categories filtering
3. Add notifications for new messages
4. Add skill rating/review system
5. Add email verification
6. Add password reset functionality
