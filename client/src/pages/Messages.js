/**
 * Messages Page
 * 
 * Chat interface for messaging between students.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { messagesAPI } from '../utils/api';
import { FiSend, FiMessageCircle } from 'react-icons/fi';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversations = React.useCallback(async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.conversations);
      if (response.data.conversations.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data.conversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation]);

  const fetchMessages = React.useCallback(async (userId) => {
    try {
      const response = await messagesAPI.getConversation(userId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);


  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.user._id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation, fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await messagesAPI.send({
        receiver: selectedConversation.user._id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedConversation.user._id);
      fetchConversations();
    } catch (error) {
      alert('Error sending message');
    } finally {
      setSending(false);
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
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div>
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.user._id}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b cursor-pointer ${selectedConversation?.user._id === conv.user._id
                        ? 'bg-primary-50'
                        : ''
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{conv.user.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage?.content}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-semibold text-lg">{selectedConversation.user.name}</h2>
                    <p className="text-sm text-gray-500">{selectedConversation.user.email}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender._id === selectedConversation.user._id
                          ? 'justify-start'
                          : 'justify-end'
                          }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender._id === selectedConversation.user._id
                            ? 'bg-gray-200 text-gray-800'
                            : 'bg-primary-600 text-white'
                            }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender._id === selectedConversation.user._id
                            ? 'text-gray-500'
                            : 'text-primary-100'
                            }`}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <FiSend />
                        <span>Send</span>
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
