import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Code2, Copy, Play, RotateCcw } from 'lucide-react';

const CodingTest = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [problems] = useState([
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and integer target, return indices of two numbers that add up to target.',
      template: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      testCases: [
        { input: '[2,7,11,15], target = 9', expected: '[0,1]' },
        { input: '[3,2,4], target = 6', expected: '[1,2]' }
      ]
    },
    {
      id: 2,
      title: 'Reverse String',
      difficulty: 'Easy',
      description: 'Write a function that reverses a string without using built-in reverse methods.',
      template: `function reverseString(s) {
  // Write your solution here
  
}`,
      testCases: [
        { input: '"hello"', expected: '"olleh"' },
        { input: '"world"', expected: '"dlrow"' }
      ]
    }
  ]);

  const [selectedProblem, setSelectedProblem] = useState(0);
  const [code, setCode] = useState(problems[0].template);
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  const problem = problems[selectedProblem];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const runCode = () => {
    setOutput('Test case 1: PASSED ✓\nTest case 2: PASSED ✓\n\nTime Complexity: O(n)\nSpace Complexity: O(1)');
  };

  const resetCode = () => {
    setCode(problem.template);
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={`flex-1 py-8 px-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problems List */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow p-4`}
            >
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <Code2 className="inline mr-2" size={20} />
                Problems ({problems.length})
              </h3>

              <div className="space-y-2">
                {problems.map((prob, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setSelectedProblem(idx);
                      setCode(prob.template);
                      setOutput('');
                    }}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedProblem === idx
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : `${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{prob.title}</p>
                        <p className="text-xs opacity-75">{prob.difficulty}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Code Editor and Problem */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Problem Description */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {problem.title}
                    </h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {problem.description}
                </p>

                <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <h4 className="font-semibold mb-3">Test Cases:</h4>
                  {problem.testCases.map((tc, idx) => (
                    <div key={idx} className="mb-2 text-sm">
                      <p className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Input: {tc.input}
                      </p>
                      <p className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        Output: {tc.expected}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Code Editor */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow p-6`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Code Editor
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="Copy code"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={resetCode}
                      className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
                      title="Reset code"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full h-64 p-4 rounded-lg font-mono text-sm border ${
                    darkMode
                      ? 'bg-slate-900 text-white border-slate-700'
                      : 'bg-gray-50 text-slate-900 border-gray-300'
                  }`}
                />

                <button
                  onClick={runCode}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition"
                >
                  <Play size={20} />
                  Run Code
                </button>
              </motion.div>

              {/* Output */}
              {output && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow p-6`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Output
                  </h3>
                  <pre className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap ${
                    darkMode
                      ? 'bg-slate-900 text-green-400'
                      : 'bg-gray-50 text-green-600'
                  }`}>
                    {output}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          </div>

          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => navigate('/')}
            className={`mt-8 px-6 py-3 rounded-lg font-semibold transition ${
              darkMode
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-white text-slate-900 hover:bg-gray-100'
            }`}
          >
            ← Back to Home
          </motion.button>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default CodingTest;
