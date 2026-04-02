import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Mic2, Send, Phone, PhoneOff, MessageCircle, User, Zap } from 'lucide-react';

const InterviewPractice = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'interviewer',
      text: "Hello! Welcome to the interview. Let's start with a simple question: Tell me about yourself.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const interviewTypes = [
    {
      id: 1,
      title: 'Technical Interview',
      description: 'Focus on coding, DSA, and technical concepts',
      duration: '45 min',
      difficulty: 'Hard',
      icon: Zap
    },
    {
      id: 2,
      title: 'HR Interview',
      description: 'Focus on communication and behavioral questions',
      duration: '30 min',
      difficulty: 'Medium',
      icon: MessageCircle
    },
    {
      id: 3,
      title: 'Mock Group Discussion',
      description: 'Practice group discussion skills',
      duration: '60 min',
      difficulty: 'Medium',
      icon: Mic2
    }
  ];

  const startInterview = () => {
    setInterviewStarted(true);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      // Add user message
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: input,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Simulate bot response after 1 second
      setTimeout(() => {
        const responses = [
          "That's great! Can you tell me about a challenging project you've worked on?",
          "I see. What are your strengths as a developer?",
          "Interesting perspective. How would you handle this situation: [scenario]?",
          "Can you walk us through your approach to solving a complex problem?",
          "What have you learned from your failures?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const botMessage = {
          id: messages.length + 2,
          sender: 'interviewer',
          text: randomResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  if (!interviewStarted) {
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex-1 py-16 px-4 ${
            darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-16"
            >
              <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Interview Practice
              </h1>
              <p className={`text-lg opacity-75 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Perfect your interview skills with our AI-powered mock interviews
              </p>
            </motion.div>

            {/* Interview Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {interviewTypes.map((type, idx) => {
                const IconComponent = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8 cursor-pointer transition`}
                    onClick={startInterview}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="mb-4 inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                    >
                      <IconComponent className="text-white" size={32} />
                    </motion.div>

                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {type.title}
                    </h3>

                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {type.description}
                    </p>

                    <div className="flex justify-between text-xs opacity-75 mb-4">
                      <span>⏱️ {type.duration}</span>
                      <span className={`font-bold ${
                        type.difficulty === 'Hard'
                          ? 'text-red-500'
                          : 'text-orange-500'
                      }`}>
                        {type.difficulty}
                      </span>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                      Start Interview
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Why Practice Here?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🤖', title: 'AI-Powered', desc: 'Real-time feedback and evaluation' },
                  { icon: '📊', title: 'Analytics', desc: 'Track your progress and improvements' },
                  { icon: '🎯', title: 'Targeted Practice', desc: 'Focus on weak areas' },
                  { icon: '⭐', title: 'Expert Tips', desc: 'Learn from industry experts' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-lg text-center ${
                      darkMode ? 'bg-slate-700' : 'bg-gray-50'
                    }`}
                  >
                    <p className="text-3xl mb-2">{feature.icon}</p>
                    <p className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {feature.title}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <Footer darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Interview Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${darkMode ? 'bg-slate-800' : 'bg-white'} border-b ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          } p-4 flex justify-between items-center`}
        >
          <div className="flex items-center gap-3">
            <Mic2 className="text-blue-500" size={24} />
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Technical Interview
            </h2>
          </div>

          <div className="flex gap-4">
            <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <Phone size={20} />
            </button>
            <button
              onClick={() => setInterviewStarted(false)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.sender === 'interviewer' ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white ${
                    darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <User size={20} />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    darkMode ? 'bg-slate-700' : 'bg-white'
                  }`}>
                    👤
                  </div>
                )}

                <div
                  className={`p-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : darkMode
                      ? 'bg-slate-800 text-gray-300'
                      : 'bg-white text-slate-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user'
                      ? 'text-blue-100'
                      : darkMode
                      ? 'text-gray-500'
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${darkMode ? 'bg-slate-800' : 'bg-white'} border-t ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          } p-4`}
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your answer here..."
              className={`flex-1 px-4 py-3 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-slate-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewPractice;
