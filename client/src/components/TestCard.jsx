import React from 'react';
import { motion } from 'framer-motion';

const TestCard = ({ icon: Icon, title, description, stats, onClick, darkMode }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
      className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 cursor-pointer transition`}
      onClick={onClick}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 10 }}
        className="mb-4 inline-block p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
      >
        <Icon className="text-white" size={32} />
      </motion.div>

      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h3>

      <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {description}
      </p>

      <div className="flex justify-between text-xs opacity-75">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <p className="font-bold text-blue-500">{stat.value}</p>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TestCard;
