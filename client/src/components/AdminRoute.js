import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if user is logged in and has admin role AND is the specific admin
    if (!user || user.role !== 'admin' || user.email !== 'ankitkumar2431967@gmail.com') {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
