import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight, SkipForward } from 'lucide-react';

const AptitudeTest = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testCompleted, setTestCompleted] = useState(false);
  const navigate = useNavigate();

  // Dummy questions for aptitude test
  const questions = [
    {
      id: 1,
      question: 'If a man purchases 10 oranges for Rs. 60, then what is the cost per orange?',
      options: ['Rs. 6', 'Rs. 8', 'Rs. 10', 'Rs. 12'],
      correct: 0,
      category: 'Quantitative'
    },
    {
      id: 2,
      question: 'A train travels 300 km in 3 hours. What is its speed?',
      options: ['100 km/h', '150 km/h', '50 km/h', '200 km/h'],
      correct: 0,
      category: 'Quantitative'
    },
    {
      id: 3,
      question: 'Complete the series: 2, 4, 8, 16, ?',
      options: ['24', '32', '28', '20'],
      correct: 1,
      category: 'Logical Reasoning'
    },
    {
      id: 4,
      question: 'What is the synonym of "Eloquent"?',
      options: ['Silent', 'Fluent', 'Weak', 'Confused'],
      correct: 1,
      category: 'Verbal'
    },
    {
      id: 5,
      question: 'If 5x = 25, then x = ?',
      options: ['4', '5', '2', '3'],
      correct: 1,
      category: 'Quantitative'
    },
  ];

  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTestCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, testCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  if (!testStarted) {
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex-1 flex items-center justify-center py-20 px-4 ${darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-12 max-w-2xl w-full`}
          >
            <h1 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Aptitude Test
            </h1>

            <div className="space-y-6">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                <h2 className="text-xl font-semibold mb-4">📋 Test Details</h2>
                <ul className="space-y-2 text-sm">
                  <li>✓ Total Questions: <span className="font-bold">{questions.length}</span></li>
                  <li>✓ Duration: <span className="font-bold">30 minutes</span></li>
                  <li>✓ Each Question: <span className="font-bold">1 mark</span></li>
                  <li>✓ Type: <span className="font-bold">MCQ</span></li>
                </ul>
              </div>

              <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>
                <h2 className="text-xl font-semibold mb-4">📚 Topics Covered</h2>
                <ul className="space-y-2 text-sm">
                  <li>• Quantitative Aptitude</li>
                  <li>• Logical Reasoning</li>
                  <li>• Verbal Ability</li>
                  <li>• Data Interpretation</li>
                </ul>
              </div>

              <button
                onClick={() => setTestStarted(true)}
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition"
              >
                Start Test Now
              </button>

              <button
                onClick={() => navigate('/')}
                className={`w-full ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-200 text-slate-900'} py-3 rounded-lg font-semibold transition`}
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </motion.section>

        <Footer darkMode={darkMode} />
      </div>
    );
  }

  if (testCompleted) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex-1 flex items-center justify-center py-20 px-4 ${darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              {percentage >= 70 ? (
                <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />
              ) : (
                <XCircle className="mx-auto text-orange-500 mb-4" size={60} />
              )}
            </motion.div>

            <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Test Completed!
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}
              >
                <p className="text-3xl font-bold text-blue-500">{score}/{questions.length}</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Correct</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}
              >
                <p className="text-3xl font-bold text-purple-500">{percentage}%</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Percentage</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <button
                onClick={() => {
                  setTestStarted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setTimeLeft(1800);
                  setTestCompleted(false);
                }}
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
              >
                Retake Test
              </button>

              <button
                onClick={() => navigate('/')}
                className={`w-full ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-200 text-slate-900'} py-3 rounded-lg font-semibold transition`}
              >
                Back to Home
              </button>
            </motion.div>
          </motion.div>
        </motion.section>

        <Footer darkMode={darkMode} />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={`flex-1 py-8 px-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 mb-6 shadow`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="flex items-center gap-2 text-red-500 font-bold">
                <Clock size={20} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-8 mb-8 shadow`}
          >
            <div className={`mb-4 text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {question.category}
            </div>

            <h3 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition ${
                    selectedAnswers[currentQuestion] === idx
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white'
                      : darkMode
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-gray-100 text-slate-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === idx
                          ? 'border-white bg-white'
                          : darkMode
                          ? 'border-gray-400'
                          : 'border-gray-400'
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === idx && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                currentQuestion === 0
                  ? `${darkMode ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                  : `${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-gray-100'}`
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: undefined })}
              className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                darkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-gray-100'
              }`}
            >
              <SkipForward size={18} /> Skip
            </button>

            <button
              onClick={handleNext}
              className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'} <ArrowRight size={18} />
            </button>
          </div>

          {/* Question Navigator */}
          <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow`}>
            <p className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Questions
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {questions.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    idx === currentQuestion
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white'
                      : selectedAnswers[idx] !== undefined
                      ? `${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white`
                      : darkMode
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {idx + 1}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default AptitudeTest;
