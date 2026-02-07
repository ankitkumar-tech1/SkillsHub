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
// Footer Component
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import EditSkill from './pages/EditSkill';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import ManageStudents from './pages/ManageStudents';
import ManageSkills from './pages/ManageSkills';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/:id" element={<SkillDetail />} />
              <Route path="/skills/:id/edit" element={<EditSkill />} />

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
              <Route
                path="/admin/skills"
                element={
                  <AdminRoute>
                    <ManageSkills />
                  </AdminRoute>
                }
              />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
