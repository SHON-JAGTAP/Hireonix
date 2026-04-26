import React from 'react';
import { Code2, Briefcase, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <motion.div whileHover={{ y: -5 }}>
            <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              PlacementHub
            </h3>
            <p className="text-sm opacity-75">
              Helping students prepare for placements with aptitude tests, coding challenges, and mock interviews.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div whileHover={{ y: -5 }}>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="/" className="hover:text-blue-500 transition">Home</a></li>
              <li><a href="/aptitude" className="hover:text-blue-500 transition">Tests</a></li>
              <li><a href="/resume" className="hover:text-blue-500 transition">Resume Checker</a></li>
              <li><a href="/interview" className="hover:text-blue-500 transition">Interview Practice</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div whileHover={{ y: -5 }}>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li><a href="#" className="hover:text-blue-500 transition">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Guides</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition">Contact</a></li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div whileHover={{ y: -5 }}>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-blue-600' : 'bg-white hover:bg-blue-600'} transition hover:text-white`}>
                <Code2 size={20} />
              </a>
              <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-blue-500' : 'bg-white hover:bg-blue-500'} transition hover:text-white`}>
                <Briefcase size={20} />
              </a>
              <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-blue-400' : 'bg-white hover:bg-blue-400'} transition hover:text-white`}>
                <MessageCircle size={20} />
              </a>
              <a href="#" className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 hover:bg-red-500' : 'bg-white hover:bg-red-500'} transition hover:text-white`}>
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        </div>

        <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-300'} pt-8 text-center text-sm opacity-75`}>
          <p>&copy; 2024 PlacementHub. All rights reserved. | Made with ❤️ for students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
