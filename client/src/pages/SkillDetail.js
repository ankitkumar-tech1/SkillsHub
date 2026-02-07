/**
 * Skill Detail Page
 * 
 * Shows detailed information about a specific skill.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { skillsAPI, messagesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUser, FiTrash2, FiEdit, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchSkill = React.useCallback(async () => {
    try {
      const response = await skillsAPI.getById(id);
      setSkill(response.data.skill);
    } catch (error) {
      console.error('Error fetching skill:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await messagesAPI.send({
        receiver: skill.postedBy._id,
        content: message,
        relatedSkill: skill._id
      });
      setMessage('');
      alert('Message sent successfully!');
      navigate('/messages');
    } catch (error) {
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await skillsAPI.delete(id);
      navigate('/profile');
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

  if (!skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Skill not found</h2>
          <Link to="/skills" className="text-primary-600 hover:text-primary-700">
            ← Back to Skills
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = isAuthenticated && (user?._id || user?.id) === skill.postedBy._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/skills"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Skills
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${skill.type === 'teaching'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
                  }`}>
                  {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {skill.category}
                </span>
                <span className="text-gray-500 text-sm flex items-center">
                  <FiClock className="mr-1" />
                  {new Date(skill.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="flex space-x-3">
                <Link
                  to={`/skills/${id}/edit`}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiEdit className="mr-2" /> Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{skill.description}</p>
          </div>

          {/* Availability */}
          {skill.availability && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Availability</h2>
              <p className="text-gray-700">{skill.availability}</p>
            </div>
          )}

          {/* Posted By */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Posted By</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{skill.postedBy?.name}</h3>
                <p className="text-gray-600">{skill.postedBy?.email}</p>
                {skill.postedBy?.college && (
                  <p className="text-sm text-gray-500">{skill.postedBy?.college}</p>
                )}
                {skill.postedBy?.course && (
                  <p className="text-sm text-gray-500">{skill.postedBy?.course} - {skill.postedBy?.year}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          {isAuthenticated && !isOwner && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Send Message</h2>
              <div className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FiMessageCircle />
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                </motion.button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t pt-6 mt-6 text-center">
              <p className="text-gray-600 mb-4">Want to contact this student?</p>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Login to send a message
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SkillDetail;
