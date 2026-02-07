import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { skillsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const EditSkill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        type: 'teaching',
        level: 'Beginner',
        availability: 'Flexible'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const response = await skillsAPI.getById(id);
                const skill = response.data.skill;

                // Check ownership
                const userId = user._id || user.id;
                if (user && skill.postedBy._id !== userId) {
                    setError("You don't have permission to edit this skill.");
                    setLoading(false);
                    return;
                }

                setFormData({
                    title: skill.title,
                    description: skill.description,
                    category: skill.category,
                    type: skill.type,
                    level: skill.level,
                    availability: skill.availability
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch skill details.');
                setLoading(false);
                console.error(err);
            }
        };

        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else {
                fetchSkill();
            }
        }
    }, [id, user, authLoading, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await skillsAPI.update(id, formData);
            navigate(`/skills/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update skill');
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => navigate('/skills')}
                    className="text-primary-600 hover:underline"
                >
                    Back to Skills
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            >
                <FiArrowLeft className="mr-2" /> Back
            </button>

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Skill</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Programming">Programming</option>
                                <option value="Design">Design</option>
                                <option value="Language">Language</option>
                                <option value="Music">Music</option>
                                <option value="Academics">Academics</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            >
                                <option value="teaching">Teaching</option>
                                <option value="learning">Learning</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                            <select
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            >
                                <option value="Flexible">Flexible</option>
                                <option value="Weekdays">Weekdays</option>
                                <option value="Weekends">Weekends</option>
                                <option value="Evenings">Evenings</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            'Saving...'
                        ) : (
                            <>
                                <FiSave className="mr-2" /> Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditSkill;
