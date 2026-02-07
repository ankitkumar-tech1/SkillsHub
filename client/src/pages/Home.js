/**
 * Home Page
 * 
 * Main landing page with featured skills and call-to-action.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { skillsAPI } from '../utils/api';
import { FiSearch, FiPlus, FiBook, FiUsers } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getAll({ limit: 6 });
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-12 px-6 md:py-24 md:px-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exchange Skills, Learn Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Connect with students and share your expertise
            </p>
            <div className="flex justify-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/skills">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2"
                    >
                      <FiSearch />
                      <span>Browse Skills</span>
                    </motion.button>
                  </Link>
                  <Link to="/profile">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2"
                    >
                      <FiPlus />
                      <span>Post a Skill</span>
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold"
                  >
                    Get Started
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiBook className="w-12 h-12" />,
                title: 'Post Your Skills',
                description: 'Share what you can teach with other students'
              },
              {
                icon: <FiSearch className="w-12 h-12" />,
                title: 'Find Skills',
                description: 'Search for skills you want to learn'
              },
              {
                icon: <FiUsers className="w-12 h-12" />,
                title: 'Connect & Learn',
                description: 'Chat with students and exchange skills'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-white hover:bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Skills
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {skill.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {skill.postedBy?.name}
                    </span>
                    <Link
                      to={`/skills/${skill._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {skills.length === 0 && !loading && (
            <p className="text-center text-gray-500">No skills available yet. Be the first to post!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
