/**
 * Skills Page
 * 
 * Browse and search all available skills.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { skillsAPI } from '../utils/api';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  const categories = ['Programming', 'Design', 'Languages', 'Music', 'Sports', 'Academics', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, [category, type]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (type) params.type = type;

      const response = await skillsAPI.getAll(params);
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('');
    setType('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Browse Skills</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Search
              </motion.button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="teaching">Teaching</option>
              <option value="learning">Learning</option>
            </select>

            {(category || type) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <FiX />
                <span>Clear Filters</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {skill.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    skill.type === 'teaching' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {skill.type === 'teaching' ? 'Teaching' : 'Learning'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{skill.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{skill.postedBy?.name}</p>
                    <p className="text-xs text-gray-500">{skill.postedBy?.college}</p>
                  </div>
                  <span className="text-xs text-gray-500">{skill.level}</span>
                </div>
                <Link
                  to={`/skills/${skill._id}`}
                  className="block text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {skills.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No skills found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
