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

  /* ================================
     FETCH USER SKILLS (MOVED UP)
     ================================ */
  const fetchUserSkills = async () => {
    try {
      const response = await skillsAPI.getAll();
      const userSkills = response.data.skills.filter(
        skill => skill.postedBy?._id === user?.id
      );
      setSkills(userSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     USE EFFECT
     ================================ */
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

  /* ================================
     HANDLERS
     ================================ */
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

  /* ================================
     LOADING STATE
     ================================ */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  /* ================================
     JSX
     ================================ */
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
                  <p className="text-gray-500 text-sm">
                    {user.course} - {user.year}
                  </p>
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
                {['name', 'college', 'course', 'year'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-200 px-6 py-2 rounded-lg"
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
          <button
            onClick={() => setShowSkillForm(!showSkillForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> Post New Skill
          </button>
        </div>

        {/* Skills List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium">{skill.category}</span>
                <button onClick={() => handleDeleteSkill(skill._id)}>
                  <FiTrash2 />
                </button>
              </div>
              <h3 className="text-xl font-semibold">{skill.title}</h3>
              <p className="text-gray-600 mb-4">{skill.description}</p>
              <Link to={`/skills/${skill._id}`} className="text-primary-600">
                View →
              </Link>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No skills posted yet. Post your first skill!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
