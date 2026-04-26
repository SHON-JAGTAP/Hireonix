import { AppContent } from '../context/AppContext';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Send, PhoneOff, User, Bot, Loader2, RefreshCw, ChevronDown } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';
import { toast } from 'react-toastify';

const ROLES = [
  { id: 'swe',       label: 'Software Engineer',     icon: '💻', topics: 'DSA, System Design, OOP' },
  { id: 'hr',        label: 'HR / Behavioral',        icon: '🤝', topics: 'Strengths, Conflicts, Leadership' },
  { id: 'ml',        label: 'ML / Data Science',      icon: '🧠', topics: 'ML Concepts, Stats, Python' },
  { id: 'frontend',  label: 'Frontend Developer',     icon: '🎨', topics: 'React, CSS, Browser APIs' },
  { id: 'fullstack', label: 'Full-Stack Developer',   icon: '🌐', topics: 'Node, Databases, REST APIs' },
];

/* ── Smart offline question bank keyed by role ── */
const QUESTION_BANK = {
  swe: [
    'Tell me about yourself and your background in software engineering.',
    'Explain the difference between a stack and a queue with an example.',
    'What is the time complexity of binary search and why?',
    'How would you design a URL shortener like bit.ly?',
    'Describe a challenging bug you fixed. What was your debugging approach?',
    'What is the difference between process and thread?',
    'Explain SOLID principles with an example.',
    'How does garbage collection work in Java or Python?',
  ],
  hr: [
    'Tell me about yourself.',
    'What is your greatest professional achievement?',
    'Describe a time you handled a conflict with a teammate.',
    'Where do you see yourself in 5 years?',
    'What are your greatest strengths and areas for improvement?',
    'Tell me about a time you failed and what you learned.',
    'Why do you want to join our company?',
    'How do you prioritize tasks when you have multiple deadlines?',
  ],
  ml: [
    'Explain the difference between supervised and unsupervised learning.',
    'What is overfitting and how do you prevent it?',
    'Describe the bias-variance tradeoff.',
    'What is gradient descent and how does it work?',
    'How would you handle missing data in a dataset?',
    'Explain precision vs recall — when would you prioritize each?',
    'What is the difference between L1 and L2 regularization?',
    'How would you approach a binary classification problem end-to-end?',
  ],
  frontend: [
    'Explain the virtual DOM and how React uses it.',
    'What is the difference between `useMemo` and `useCallback`?',
    'How does CSS specificity work?',
    'What are Web Workers and when would you use them?',
    'Explain the event loop in JavaScript.',
    'What is the difference between `null` and `undefined`?',
    'How would you optimize a React application for performance?',
    'Explain CORS and how to handle it.',
  ],
  fullstack: [
    'Explain the difference between SQL and NoSQL databases.',
    'What are RESTful API design best practices?',
    'How does JWT authentication work?',
    'What is the difference between horizontal and vertical scaling?',
    'Explain the difference between monolith and microservices architecture.',
    'How would you implement caching in a web application?',
    'What is a race condition and how do you prevent it?',
    'How do you ensure database consistency in distributed systems?',
  ],
};

/* ── AI feedback generator (calls Gemini if key set, falls back smart offline) ── */
const AI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

async function getAIFeedback(question, answer, role) {
  if (!AI_KEY) {
    // Smart offline feedback
    const len = answer.trim().split(/\s+/).length;
    let feedback = '';
    if (len < 15)
      feedback = '⚠️ Your answer is too brief. Aim for 3-5 sentences covering the key concepts. Give concrete examples where possible.';
    else if (len < 40)
      feedback = '✅ Good start! You covered the basics. Try expanding with a real-world example or dive deeper into the "why" behind your answer to make it memorable.';
    else
      feedback = "🎉 Well-structured answer! It's detailed and covers the topic thoroughly. Make sure to pause clearly between sections so the interviewer can follow your reasoning.";
    return { text: feedback, score: len < 15 ? 45 : len < 40 ? 72 : 88 };
  }

  const prompt = `You are an expert technical interviewer for a ${role} role. 
Question asked: "${question}"
Candidate answered: "${answer}"

Provide: 1) Constructive feedback (2-3 sentences), 2) A score out of 100, 3) One specific improvement suggestion.
Reply in JSON: { "feedback": "...", "score": 0-100, "tip": "..." }`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return { text: `${parsed.feedback}\n\n💡 Tip: ${parsed.tip}`, score: parsed.score };
  } catch {
    return { text: raw, score: 70 };
  }
}

const InterviewPractice = () => {
  const { darkMode, setDarkMode } = useContext(AppContent);
  const [screen, setScreen]             = useState('setup'); // setup | interview
  const [role, setRole]                 = useState(ROLES[0]);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [qIndex, setQIndex]             = useState(0);
  const [sessionScores, setSessionScores] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const chatEndRef  = useRef(null);
  const { addActivity } = useActivity();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startInterview = () => {
    const qs = [...QUESTION_BANK[role.id]].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestionList(qs);
    setQIndex(0);
    setSessionScores([]);
    setMessages([
      {
        id: 1, sender: 'bot',
        text: `👋 Hello! I'm your AI interviewer for the **${role.label}** role.\n\nWe'll go through 6 questions. Answer clearly and thoroughly — I'll give you feedback after each one.\n\nLet's begin!\n\n**Q1:** ${qs[0]}`,
        timestamp: new Date(),
      }
    ]);
    setScreen('interview');
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const currentQ = questionList[qIndex];
    setInput('');

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { text: feedback, score } = await getAIFeedback(currentQ, text, role.label);
      setSessionScores(prev => [...prev, score]);

      const nextIdx = qIndex + 1;
      const isLast  = nextIdx >= questionList.length;

      const botText = isLast
        ? `📊 **Feedback on Q${qIndex + 1}:**\n${feedback}\n\n---\n🎉 **Interview Complete!**\nYour average score: **${Math.round([...sessionScores, score].reduce((a, b) => a + b, 0) / (sessionScores.length + 1))}%**\n\nGreat job! Click "New Session" to try again with a different role.`
        : `📊 **Feedback on Q${qIndex + 1}:**\n${feedback}\n\n---\n**Q${nextIdx + 1}:** ${questionList[nextIdx]}`;

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText, timestamp: new Date() }]);

      if (isLast) {
        const avg = Math.round([...sessionScores, score].reduce((a, b) => a + b, 0) / (sessionScores.length + 1));
        addActivity('interview', `Interview Session — ${role.label}`, { score: avg, category: role.label });
        toast.success(`Interview complete! Avg score: ${avg}%`);
      } else {
        setQIndex(nextIdx);
      }
    } catch (err) {
      toast.error('Failed to get AI feedback: ' + err.message);
    }
    setLoading(false);
  };

  const endSession = () => {
    const avg = sessionScores.length
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0;
    if (avg > 0) addActivity('interview', `Interview Session — ${role.label} (ended early)`, { score: avg });
    setScreen('setup');
  };

  /* ── Message renderer ── */
  function MsgBubble({ msg }) {
    const isBot = msg.sender === 'bot';
    const lines = msg.text.split('\n');
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white' : darkMode ? 'bg-slate-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>
        <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${isBot
          ? darkMode ? 'bg-slate-700 text-gray-200' : 'bg-white text-slate-900 shadow-sm border border-gray-100'
          : 'bg-linear-to-r from-blue-500 to-purple-600 text-white'}`}>
          {lines.map((line, i) => {
            const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            if (line.startsWith('---')) return <hr key={i} className="my-2 border-current opacity-20" />;
            return <p key={i} className={line === '' ? 'h-2' : 'mb-1'} dangerouslySetInnerHTML={{ __html: bold }} />;
          })}
          <p className="text-xs mt-2 opacity-50">{msg.timestamp.toLocaleTimeString()}</p>
        </div>
      </motion.div>
    );
  }

  /* ── Setup Screen ── */
  if (screen === 'setup') {
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex-1 py-16 px-4 ${darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'}`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Interview Practice
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                6 real questions · AI feedback after each · Score tracking
              </p>
              {!AI_KEY && (
                <p className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
                  ⚡ Smart offline mode — add VITE_GEMINI_API_KEY to .env for AI-powered feedback
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {ROLES.map(r => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRole(r)}
                  className={`p-5 rounded-2xl text-left border-2 transition ${
                    role.id === r.id
                      ? 'border-blue-500 bg-linear-to-br from-blue-50 to-purple-50'
                      : darkMode ? 'border-slate-700 bg-slate-800 hover:border-blue-400' : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="text-3xl block mb-2">{r.icon}</span>
                  <p className={`font-bold mb-1 ${darkMode && role.id !== r.id ? 'text-white' : 'text-slate-900'}`}>{r.label}</p>
                  <p className="text-xs text-gray-500">{r.topics}</p>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startInterview}
              className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:shadow-xl transition"
            >
              Start {role.label} Interview →
            </motion.button>
          </div>
        </motion.section>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  /* ── Interview Screen ── */
  const progressPct = questionList.length ? Math.round((qIndex / questionList.length) * 100) : 0;

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-gray-50'} h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b px-6 py-3 flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{role.icon}</span>
          <div>
            <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{role.label} Interview</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Question {Math.min(qIndex + 1, questionList.length)} of {questionList.length}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex-1 mx-8">
          <div className={`h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {sessionScores.length > 0 && (
            <div className={`text-sm font-semibold px-3 py-1 rounded-lg ${darkMode ? 'bg-slate-700 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
              Avg: {Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)}%
            </div>
          )}
          <button
            onClick={endSession}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-semibold transition"
          >
            <PhoneOff size={16} /> End
          </button>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map(msg => <MsgBubble key={msg.id} msg={msg} />)}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className={`px-5 py-4 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-white border border-gray-100 shadow-sm'}`}>
              <Loader2 size={20} className="animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-t px-6 py-4 shrink-0`}>
        <div className="flex gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className={`flex-1 px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-slate-900'
            }`}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-40 flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;
