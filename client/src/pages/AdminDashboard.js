import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Manage Students Card */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-3">Manage Students</h2>
                    <p className="text-gray-600 mb-4">
                        View all registered students and manage their accounts.
                    </p>
                    <Link
                        to="/admin/students"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View Students
                    </Link>
                </div>

                {/* Add more admin cards here in future */}
            </div>
        </div>
    );
};

export default AdminDashboard;
