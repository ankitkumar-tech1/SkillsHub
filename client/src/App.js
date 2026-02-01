/**
 * Main App Component
 * 
 * Sets up routing and wraps the app with authentication context.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import ManageStudents from './pages/ManageStudents';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/:id" element={<SkillDetail />} />

            {/* Private Routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminRoute>
                  <ManageStudents />
                </AdminRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
