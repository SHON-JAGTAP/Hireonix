import { AppContent } from '../context/AppContext';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight, SkipForward, RefreshCw, Loader2 } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';
import { toast } from 'react-toastify';

/* ── Open Trivia DB categories ── */
const CATEGORIES = [
  { id: 18, name: 'Computer Science', icon: '💻' },
  { id: 19, name: 'Mathematics',      icon: '📐' },
  { id: 23, name: 'History',          icon: '📜' },
  { id: 24, name: 'Politics',         icon: '🏛️' },
  { id: 17, name: 'Science',          icon: '🔬' },
  { id: 27, name: 'Animals',          icon: '🐾' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

function decodeHTML(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const AptitudeTest = () => {
  const { darkMode, setDarkMode } = useContext(AppContent);
  const [screen, setScreen]           = useState('setup'); // setup | loading | test | result
  const [category, setCategory]       = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty]   = useState('medium');
  const [questions, setQuestions]     = useState([]);
  const [currentQ, setCurrentQ]       = useState(0);
  const [selected, setSelected]       = useState({});
  const [timeLeft, setTimeLeft]       = useState(1800);
  const [fetchError, setFetchError]   = useState('');
  const navigate = useNavigate();
  const { addActivity } = useActivity();

  /* ── Timer ── */
  useEffect(() => {
    if (screen !== 'test') return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { setScreen('result'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ── Fetch questions from Open Trivia DB ── */
  const fetchQuestions = useCallback(async () => {
    setScreen('loading');
    setFetchError('');
    try {
      const url = `https://opentdb.com/api.php?amount=10&category=${category.id}&difficulty=${difficulty}&type=multiple`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.response_code !== 0) throw new Error('No questions available for this combination. Try another category.');
      const parsed = data.results.map((q, i) => ({
        id: i,
        question:  decodeHTML(q.question),
        category:  decodeHTML(q.category),
        options:   shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHTML)),
        correct:   decodeHTML(q.correct_answer),
      }));
      setQuestions(parsed);
      setSelected({});
      setCurrentQ(0);
      setTimeLeft(600);  // 10 min for 10 questions
      setScreen('test');
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch questions. Check your internet connection.');
      setScreen('setup');
      toast.error(err.message || 'Failed to fetch questions');
    }
  }, [category, difficulty]);

  /* ── Score ── */
  const calcScore = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (selected[i] === q.correct) correct++; });
    return { correct, total: questions.length, pct: Math.round((correct / questions.length) * 100) };
  };

  /* ── On test complete ── */
  const finishTest = () => {
    const { correct, total, pct } = calcScore();
    setScreen('result');
    addActivity('aptitude', `Aptitude Test — ${category.name} (${difficulty})`, {
      score: pct, correct, total, category: category.name,
    });
  };

  /* ── Screens ── */
  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 size={56} className="text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-800">Generating questions…</p>
          <p className="text-gray-500 mt-1">Fetching from Open Trivia DB</p>
        </motion.div>
      </div>
    );
  }

  if (screen === 'setup') {
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex-1 flex items-center justify-center py-20 px-4 ${darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-10 max-w-2xl w-full`}
          >
            <h1 className={`text-4xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Aptitude Test
            </h1>
            <p className={`text-center mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Questions are fetched live — every attempt is unique!
            </p>

            {fetchError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{fetchError}</div>
            )}

            {/* Category */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📚 Select Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                      category.id === cat.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : darkMode
                        ? 'border-slate-600 text-gray-300 hover:border-blue-400'
                        : 'border-gray-200 text-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-xl block mb-1">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ⚡ Difficulty
              </label>
              <div className="flex gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold capitalize transition ${
                      difficulty === d
                        ? d === 'easy'   ? 'border-green-500  bg-green-50  text-green-700'
                        : d === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        :                  'border-red-500    bg-red-50    text-red-700'
                        : darkMode
                        ? 'border-slate-600 text-gray-300 hover:border-gray-400'
                        : 'border-gray-200  text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-6 text-sm ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
              ✓ 10 unique questions · ✓ 10 minutes · ✓ Real-time from Open Trivia DB
            </div>

            <button
              onClick={fetchQuestions}
              className="w-full py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:shadow-lg transition"
            >
              Start Test →
            </button>
            <button
              onClick={() => navigate('/')}
              className={`w-full mt-3 py-3 rounded-xl font-semibold transition ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Go Back
            </button>
          </motion.div>
        </motion.section>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  if (screen === 'result') {
    const { correct, total, pct } = calcScore();
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex-1 flex items-center justify-center py-20 px-4 ${darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'}`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center`}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mb-6">
              {pct >= 70
                ? <CheckCircle className="mx-auto text-green-500" size={64} />
                : <XCircle className="mx-auto text-orange-500" size={64} />}
            </motion.div>
            <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {pct >= 70 ? 'Great Job! 🎉' : 'Keep Practicing! 💪'}
            </h1>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category.name} · {difficulty}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                <p className="text-4xl font-bold text-blue-500">{correct}/{total}</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Correct</p>
              </div>
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-purple-50'}`}>
                <p className="text-4xl font-bold text-purple-500">{pct}%</p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Percentage</p>
              </div>
            </div>
            <button
              onClick={fetchQuestions}
              className="w-full mb-3 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold hover:shadow-lg flex items-center justify-center gap-2 transition"
            >
              <RefreshCw size={18} /> Retake with New Questions
            </button>
            <button
              onClick={() => setScreen('setup')}
              className={`w-full py-3 rounded-xl font-semibold ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Change Category
            </button>
          </motion.div>
        </motion.section>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  /* ── Active Test Screen ── */
  const q = questions[currentQ];
  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className={`flex-1 py-8 px-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">

          {/* Header bar */}
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-5 mb-6 shadow-sm flex justify-between items-center`}>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {category.name} · {difficulty}
              </p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Q {currentQ + 1} / {questions.length}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : darkMode ? 'bg-slate-700 text-white' : 'bg-blue-50 text-blue-700'}`}>
              <Clock size={18} /> {fmt(timeLeft)}
            </div>
          </div>

          {/* Progress */}
          <div className={`w-full h-2 rounded-full mb-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-8 mb-6 shadow-sm`}
            >
              <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{q.category}</p>
              <h3 className={`text-xl font-bold mb-8 leading-relaxed ${darkMode ? 'text-white' : 'text-slate-900'}`}>{q.question}</h3>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelected(p => ({ ...p, [currentQ]: opt }))}
                    className={`w-full p-4 rounded-xl text-left font-medium transition ${
                      selected[currentQ] === opt
                        ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : darkMode
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-gray-50 text-slate-900 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${selected[currentQ] === opt ? 'border-white text-white' : darkMode ? 'border-slate-500 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentQ(p => p - 1)}
              disabled={currentQ === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition ${currentQ === 0 ? 'opacity-40 cursor-not-allowed bg-gray-200' : darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-gray-100 border'}`}
            >
              ← Prev
            </button>
            <button
              onClick={() => setSelected(p => { const n = {...p}; delete n[currentQ]; return n; })}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition ${darkMode ? 'bg-slate-800 text-white' : 'bg-white border text-slate-900 hover:bg-gray-100'}`}
            >
              <SkipForward size={16} /> Skip
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(p => p + 1)}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg transition"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={finishTest}
                className="px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-teal-600 text-white font-bold flex items-center gap-2 hover:shadow-lg transition"
              >
                Submit <CheckCircle size={16} />
              </button>
            )}
          </div>

          {/* Question navigator */}
          <div className={`mt-6 p-5 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
            <p className={`text-xs font-semibold mb-3 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Jump to question</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentQ(i)}
                  className={`w-9 h-9 rounded-lg font-semibold text-sm transition ${
                    i === currentQ
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow'
                      : selected[i] !== undefined
                      ? 'bg-green-500 text-white'
                      : darkMode
                      ? 'bg-slate-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
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
