import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, teaching, learning
    const { token } = useAuth();
    const [error, setError] = useState(null);

    const fetchSkills = React.useCallback(async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.get('https://skillshub-backend.onrender.com/api/skills/admin/all', config);
            setSkills(res.data.skills);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch skills');
            setLoading(false);
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this skill?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`https://skillshub-backend.onrender.com/api/skills/${id}`, config);
                setSkills(skills.filter(skill => skill._id !== id));
            } catch (err) {
                alert('Failed to delete skill');
                console.error(err);
            }
        }
    };

    const filteredSkills = skills.filter(skill => {
        const matchesSearch =
            skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.postedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.postedBy.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || skill.type === filter;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Skills</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-1/3">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search skills or users..."
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-500" />
                    <select
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="teaching">Teaching</option>
                        <option value="learning">Learning</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSkills.map(skill => (
                                <tr key={skill._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{skill.postedBy?.name || 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">{skill.postedBy?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 font-semibold">{skill.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs" title={skill.description}>
                                            {skill.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {skill.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${skill.type === 'teaching' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(skill.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(skill._id)}
                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredSkills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No skills found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSkills;
