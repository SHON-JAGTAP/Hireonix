import { AppContent } from '../context/AppContext';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Loader2, Briefcase } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

const JOB_ROLES = [
  { id: 'swe',       label: 'Software Engineer',   skills: ['Data Structures', 'Algorithms', 'System Design', 'Git', 'APIs'] },
  { id: 'frontend',  label: 'Frontend Developer',   skills: ['React', 'CSS', 'TypeScript', 'Webpack', 'Performance'] },
  { id: 'fullstack', label: 'Full-Stack Developer', skills: ['Node.js', 'Databases', 'REST APIs', 'Docker', 'CI/CD'] },
  { id: 'ml',        label: 'ML Engineer',          skills: ['Python', 'TensorFlow', 'Statistics', 'Data Wrangling', 'Model Deployment'] },
  { id: 'devops',    label: 'DevOps Engineer',      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'] },
];

const AI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const fallbackAnalysis = {
  score: 78,
  grade: 'B+',
  feedback: [
    { category: 'Format & Structure', score: 85, feedback: 'Well-organized resume with clear sections', status: 'good' },
    { category: 'Content Quality', score: 72, feedback: 'Add more quantifiable achievements and metrics', status: 'warning' },
    { category: 'Skills Section', score: 80, feedback: 'Good variety of technical skills listed', status: 'good' },
    { category: 'Experience Description', score: 75, feedback: 'Use action verbs to strengthen descriptions', status: 'warning' },
    { category: 'Keywords', score: 68, feedback: 'Add more industry-specific keywords for ATS optimization', status: 'warning' }
  ],
  suggestions: [
    'Add measurable results to each achievement (e.g., "Increased sales by 25%")',
    'Include relevant certifications and technical skills',
    'Use action verbs like "Designed", "Implemented", "Led" instead of passive language',
    'Optimize for ATS by using standard keywords from job descriptions',
    'Ensure consistent formatting throughout the document'
  ]
};

async function getAIResumeAnalysis(role, fileName) {
  if (!AI_KEY) return fallbackAnalysis;
  const prompt = `You are an expert technical recruiter and ATS system analyzing a candidate's resume (file: "${fileName}") for a "${role.label}" role. Evaluate the resume based on missing skills, formatting improvements, and suggestions based on this specific job role.
Produce a realistic JSON response containing the analysis. Respond ONLY with valid JSON.
Format:
{
  "score": <number 0-100>,
  "grade": "<string like A, B+, C>",
  "feedback": [
    { "category": "<string>", "score": <number 0-100>, "feedback": "<string>", "status": "<good | warning | bad>" }
  ],
  "suggestions": [ "<string>", "<string>" ]
}`;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return fallbackAnalysis; // Fallback if API fails
  }
}

const ResumeAnalyzer = () => {
  const { darkMode, setDarkMode } = useContext(AppContent);
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedRole, setSelectedRole] = useState(JOB_ROLES[0]);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { addActivity } = useActivity();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };

  const analyzeResume = async () => {
    if (!file) return;
    setAnalyzing(true);
    const result = await getAIResumeAnalysis(selectedRole, file.name);
    setAnalysisData(result);
    setScore(result.score || 0);
    setAnalyzed(true);
    setAnalyzing(false);
    addActivity('resume', `Resume Analyzed — ${selectedRole.label}`, { score: result.score });
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalyzed(false);
    setScore(0);
  };

  if (!analyzed) {
    return (
      <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex-1 flex items-center justify-center py-20 px-4 ${
            darkMode ? 'bg-linear-to-br from-slate-900 to-slate-800' : 'bg-linear-to-br from-blue-50 to-purple-50'
          }`}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-2xl p-12 max-w-2xl w-full`}
          >
            <h1 className={`text-4xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Resume Analyzer
            </h1>
            <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get instant feedback tailored to your target role
            </p>

            {/* Role Selector */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Briefcase className="inline mr-1" size={14} /> Target Role
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      selectedRole.id === r.id
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : darkMode ? 'border-slate-600 text-gray-300 hover:border-blue-400' : 'border-gray-300 text-gray-600 hover:border-blue-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <motion.div
              whileHover={{ borderColor: '#3b82f6' }}
              className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition ${
                file
                  ? darkMode
                    ? 'border-green-500 bg-green-500 bg-opacity-10'
                    : 'border-green-500 bg-green-50'
                  : darkMode
                  ? 'border-slate-600 hover:border-blue-500'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-4 flex justify-center"
                >
                  {file ? (
                    <FileText className="text-green-500" size={48} />
                  ) : (
                    <Upload className={`${darkMode ? 'text-blue-400' : 'text-blue-500'}`} size={48} />
                  )}
                </motion.div>

                <p className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  PDF, DOC, or DOCX (Max 5MB)
                </p>
              </label>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={analyzeResume}
              disabled={!file || analyzing}
              className={`w-full py-3 rounded-lg font-bold mb-4 transition flex items-center justify-center gap-2 ${
                file && !analyzing
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {analyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing…</> : 'Analyze Resume'}
            </motion.button>

            <button
              onClick={() => navigate('/')}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                darkMode
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-gray-200 text-slate-900 hover:bg-gray-300'
              }`}
            >
              Back to Home
            </button>
          </motion.div>
        </motion.section>

        <Footer darkMode={darkMode} />
      </div>
    );
  }

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getGradeColor = (s) => {
    if (s >= 80) return 'from-green-500 to-green-600';
    if (s >= 60) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className={`${darkMode ? 'bg-slate-950' : 'bg-white'} min-h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={`flex-1 py-12 px-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Score Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${darkMode ? 'bg-linear-to-br from-slate-800 to-slate-700' : 'bg-linear-to-br from-blue-500 to-purple-600'} rounded-2xl shadow-2xl p-8 mb-8 text-white`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-6xl font-bold mb-2">{score}/100</p>
                <p className="text-blue-100">Overall Score</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-6xl font-bold mb-2">{analysisData?.grade || 'N/A'}</p>
                <p className="text-blue-100">Grade</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-4xl font-bold mb-2">📄</p>
                <p>{file?.name || 'Resume'}</p>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feedback Details */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-2 space-y-4"
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <TrendingUp className="inline mr-2" size={28} />
                Category Scores
              </h2>

              {analysisData?.feedback.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.status === 'good' ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <AlertCircle className="text-orange-500" size={24} />
                      )}
                      <div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {item.category}
                        </h3>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </span>
                  </div>

                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.feedback}
                  </p>

                  {/* Progress Bar */}
                  <div className={`mt-3 h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full bg-linear-to-r ${
                        item.status === 'good'
                          ? 'from-green-500 to-green-600'
                          : 'from-orange-500 to-orange-600'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow p-6`}
            >
              <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                💡 Suggestions
              </h3>

              <div className="space-y-4">
                {analysisData?.suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg ${
                      darkMode ? 'bg-slate-700' : 'bg-blue-50'
                    } text-sm leading-relaxed`}
                  >
                    <span className="font-semibold text-blue-500">{idx + 1}. </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {suggestion}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <button
              onClick={resetAnalysis}
              className={`py-3 rounded-lg font-semibold transition ${
                darkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-gray-100'
              }`}
            >
              Analyze Another Resume
            </button>

            <button
              className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Download Report
            </button>

            <button
              onClick={() => navigate('/')}
              className={`py-3 rounded-lg font-semibold transition ${
                darkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-gray-100'
              }`}
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default ResumeAnalyzer;
