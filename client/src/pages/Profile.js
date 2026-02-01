/**
 * Profile Page
 * 
 * User profile management and skill posting.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { skillsAPI, usersAPI } from '../utils/api';
import { FiUser, FiEdit, FiPlus, FiTrash2, FiBook } from 'react-icons/fi';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    year: user?.year || '',
    bio: user?.bio || ''
  });
  const [skillData, setSkillData] = useState({
    title: '',
    description: '',
    category: 'Other',
    type: 'teaching',
    level: 'Beginner',
    availability: 'Flexible'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        course: user.course || '',
        year: user.year || '',
        bio: user.bio || ''
      });
      fetchUserSkills();
    }
  }, [user]);

  const fetchUserSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      const userSkills = response.data.skills.filter(
        skill => skill.postedBy._id === user?.id
      );
      setSkills(userSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.updateProfile(formData);
      await fetchUser();
      setShowEditForm(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      await skillsAPI.create(skillData);
      setSkillData({
        title: '',
        description: '',
        category: 'Other',
        type: 'teaching',
        level: 'Beginner',
        availability: 'Flexible'
      });
      setShowSkillForm(false);
      fetchUserSkills();
      alert('Skill posted successfully!');
    } catch (error) {
      alert('Error posting skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await skillsAPI.delete(id);
      fetchUserSkills();
    } catch (error) {
      alert('Error deleting skill');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-12 h-12 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-gray-600 mb-1">{user?.email}</p>
                {user?.college && <p className="text-gray-600">{user.college}</p>}
                {user?.course && (
                  <p className="text-gray-500 text-sm">{user.course} - {user.year}</p>
                )}
                {user?.bio && (
                  <p className="text-gray-700 mt-3">{user.bio}</p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditForm(!showEditForm)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiEdit />
              <span>Edit Profile</span>
            </motion.button>
          </div>

          {/* Edit Profile Form */}
          {showEditForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleProfileUpdate}
              className="mt-6 border-t pt-6 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>

        {/* Skills Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Skills</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <FiPlus />
            <span>Post New Skill</span>
          </motion.button>
        </div>

        {/* Post Skill Form */}
        {showSkillForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSkillSubmit}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Post a New Skill</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={skillData.title}
                  onChange={(e) => setSkillData({ ...skillData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., JavaScript Programming"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={skillData.description}
                  onChange={(e) => setSkillData({ ...skillData, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe what you can teach or want to learn..."
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={skillData.category}
                    onChange={(e) => setSkillData({ ...skillData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Languages</option>
                    <option>Music</option>
                    <option>Sports</option>
                    <option>Academics</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={skillData.type}
                    onChange={(e) => setSkillData({ ...skillData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="teaching">Teaching</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={skillData.level}
                    onChange={(e) => setSkillData({ ...skillData, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <input
                  type="text"
                  value={skillData.availability}
                  onChange={(e) => setSkillData({ ...skillData, availability: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Weekends, Evening, Flexible"
                />
              </div>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                >
                  Post Skill
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowSkillForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Skills List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {skill.category}
                </span>
                <button
                  onClick={() => handleDeleteSkill(skill._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
              <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{skill.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm px-2 py-1 rounded ${
                  skill.type === 'teaching' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                </span>
                <Link
                  to={`/skills/${skill._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No skills posted yet. Post your first skill!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
