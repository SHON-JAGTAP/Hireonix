import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestCard from '../components/TestCard';
import { motion } from 'framer-motion';
import { Zap, Code2, FileText, Mic2, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: Zap,
      title: 'Aptitude Test',
      description: 'Master quantitative aptitude, logical reasoning, and verbal ability',
      stats: [{ value: '50+', label: 'Tests' }, { value: '30min', label: 'Avg' }],
      path: '/aptitude',
    },
    {
      icon: Code2,
      title: 'Coding Test',
      description: 'Solve real-world coding problems with built-in code editor',
      stats: [{ value: '100+', label: 'Problems' }, { value: 'All', label: 'Languages' }],
      path: '/coding',
    },
    {
      icon: FileText,
      title: 'Resume Analyzer',
      description: 'Get instant feedback and score on your resume',
      stats: [{ value: '5min', label: 'Analysis' }, { value: '/100', label: 'Score' }],
      path: '/resume',
    },
    {
      icon: Mic2,
      title: 'Interview Practice',
      description: 'Practice mock interviews with AI-powered feedback',
      stats: [{ value: '1000+', label: 'Videos' }, { value: 'Live', label: 'Chat' }],
      path: '/interview',
    },
  ];

  const benefits = [
    'Comprehensive test coverage',
    'Real-time performance analytics',
    'Expert solutions and explanations',
    'Personalized learning path',
    'Leaderboard and achievements',
    'Offline access to resources',
  ];

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'} py-24 px-4 text-center`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Placement Practice <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Hub
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`text-xl mb-8 opacity-75 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Prepare, Practice, and Get Placed
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={() => navigate('/aptitude')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              Start Test <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/resume')}
              className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} border-2 border-blue-500 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105`}
            >
              Upload Resume <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-xl text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105"
            >
              Start Interview <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={`inline-block px-6 py-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white shadow-lg'}`}
          >
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              🎯 Join <span className="font-bold text-blue-500">5000+</span> students preparing for placements
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Our Features
            </h2>
            <p className={`text-lg opacity-75 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to crack your placements
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <TestCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  stats={feature.stats}
                  onClick={() => navigate(feature.path)}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Why Choose <span className="text-blue-500">PlacementHub</span>?
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-4">🚀 Ready to Get Started?</h3>
                <p className="mb-6 text-blue-100">
                  Join thousands of students who are already preparing with PlacementHub
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition transform hover:scale-105"
                >
                  Create Account Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5000+', label: 'Active Students' },
              { value: '500+', label: 'Problems' },
              { value: '99%', label: 'Success Rate' },
              { value: '50+', label: 'Companies' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <p className="text-4xl font-bold text-blue-500 mb-2">{stat.value}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home;
