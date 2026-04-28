import { AppContent } from '../context/AppContext';
import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Code2, Play, RotateCcw, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';
import { toast } from 'react-toastify';

/* ── Language configs ── */
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', monacoId: 'javascript', icon: '🟨', template: `// JavaScript\nfunction solution(input) {\n  // Write your solution here\n}\nconsole.log(solution());` },
  { id: 'python',     name: 'Python 3',   monacoId: 'python',     icon: '🐍', template: `# Python 3\ndef solution(input):\n    # Write your solution here\n    pass\n\nprint(solution(""))` },
  { id: 'java',       name: 'Java',       monacoId: 'java',        icon: '☕', template: `public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello, World!");\n    }\n}` },
  { id: 'c++',        name: 'C++',        monacoId: 'cpp',         icon: '⚡', template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello, World!" << endl;\n    return 0;\n}` },
  { id: 'c',          name: 'C',          monacoId: 'c',           icon: '🔧', template: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    printf("Hello, World!\\n");\n    return 0;\n}` },
  { id: 'ruby',       name: 'Ruby',       monacoId: 'ruby',        icon: '💎', template: `# Ruby\ndef solution(input)\n  # Write your solution here\nend\n\nputs solution("")` },
];

/* ── Problem bank ── */
const PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume exactly one solution exists.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6',      output: '[1,2]' },
    ],
    testCases: ['[2,7,11,15], 9 → [0,1]', '[3,2,4], 6 → [1,2]', '[3,3], 6 → [0,1]'],
    hints: ['Use a hash map to store complements', 'For each number x, check if target−x exists'],
  },
  {
    id: 2, title: 'Reverse String', difficulty: 'Easy', category: 'Strings',
    description: 'Write a function that reverses a string. The input string is given as an array of characters. Do it in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    testCases: ['["h","e","l","l","o"] → ["o","l","l","e","h"]', '["H","a","n","n","a","h"] → ["h","a","n","n","a","H"]'],
    hints: ['Use two pointers from both ends', 'Swap while left < right'],
  },
  {
    id: 3, title: 'FizzBuzz', difficulty: 'Easy', category: 'Math',
    description: 'Given an integer n, return a string array where: answer[i] == "FizzBuzz" if i is divisible by 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, i (as string) otherwise.',
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    testCases: ['n=3 → ["1","2","Fizz"]', 'n=5 → ["1","2","Fizz","4","Buzz"]'],
    hints: ['Check divisibility by 15 first', 'Use modulo operator %'],
  },
  {
    id: 4, title: 'Valid Parentheses', difficulty: 'Medium', category: 'Stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if brackets are closed in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    testCases: ['() → true', '()[]{} → true', '(] → false', '([)] → false'],
    hints: ['Use a stack', 'Push opening brackets, pop on closing'],
  },
  {
    id: 5, title: 'Binary Search', difficulty: 'Medium', category: 'Search',
    description: 'Given a sorted array of integers `nums` and an integer `target`, write a function to search for target in nums. Return its index if found, otherwise return -1. You must write an O(log n) algorithm.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    testCases: ['[-1,0,3,5,9,12], 9 → 4', '[-1,0,3,5,9,12], 2 → -1'],
    hints: ['Maintain left and right pointers', 'mid = left + (right-left)/2'],
  },
  {
    id: 6, title: 'Longest Common Prefix', difficulty: 'Medium', category: 'Strings',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""' },
    ],
    testCases: ['["flower","flow","flight"] → "fl"', '["dog","racecar","car"] → ""'],
    hints: ['Compare first string with each subsequent one', 'Trim common prefix iteratively'],
  },
  {
    id: 7, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Dynamic Programming',
    description: 'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has largest sum = 6' },
    ],
    testCases: ['[-2,1,-3,4,-1,2,1,-5,4] → 6', '[1] → 1', '[5,4,-1,7,8] → 23'],
    hints: ["Kadane's Algorithm", 'Track current sum and global max'],
  },
  {
    id: 8, title: 'Merge Two Sorted Lists', difficulty: 'Hard', category: 'Linked Lists',
    description: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
    examples: [
      { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    ],
    testCases: ['[1,2,4] + [1,3,4] → [1,1,2,3,4,4]', '[] + [] → []'],
    hints: ['Use a dummy head node', 'Compare and advance pointer of smaller value'],
  },
];

const DIFF_COLOR = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-700',
};

/* ── Piston execution (emkc.org public API or self-hosted) ── */
const PISTON_API_URL = import.meta.env.VITE_PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';

async function executeCode(sourceCode, langId) {
  const submitRes = await fetch(PISTON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: langId,
      version: '*',
      files: [{ content: sourceCode }],
    }),
  });
  
  const data = await submitRes.json();
  
  if (!submitRes.ok) {
    if (data.message && data.message.includes('whitelist only')) {
      throw new Error('Public API restricted. Please run Piston locally using Docker: docker run -p 2000:2000 ghcr.io/engineer-man/piston and set VITE_PISTON_API_URL=http://localhost:2000/api/v2/execute in your client/.env');
    }
    throw new Error(data.message || 'Execution failed');
  }

  // Format Piston response to match existing Judge0 structure
  const isCompileError = data.compile && data.compile.code !== 0;
  const isRuntimeError = data.run && data.run.code !== 0;
  
  let statusId = 3; // Accepted
  let statusDesc = 'Accepted';
  
  if (isCompileError) {
    statusId = 6;
    statusDesc = 'Compilation Error';
  } else if (isRuntimeError) {
    statusId = 4; // Runtime Error
    statusDesc = data.run?.signal ? `Runtime Error (${data.run.signal})` : 'Runtime Error';
  }

  return {
    status: { id: statusId, description: statusDesc },
    stdout: data.run?.stdout ?? null,
    stderr: data.run?.stderr ?? null,
    compile_output: data.compile?.stderr || data.compile?.stdout || null,
    time: null,
    memory: null,
  };
}

const CodingTest = () => {
  const { darkMode, setDarkMode } = useContext(AppContent); // default dark for editor
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // description | hints
  const navigate = useNavigate();
  const { addActivity } = useActivity();
  const editorRef = useRef(null);

  const problem = PROBLEMS[selectedProblemIdx];

  const changeProblem = (idx) => {
    setSelectedProblemIdx(idx);
    setOutput(null);
    setCode(selectedLang.template);
  };

  const changeLang = (lang) => {
    setSelectedLang(lang);
    setCode(lang.template);
    setOutput(null);
  };

  const runCode = async () => {
    const src = editorRef.current?.getValue() || code;
    if (!src.trim()) { toast.warning('Write some code first!'); return; }
    setRunning(true);
    setOutput(null);
    try {
      const result = await executeCode(src, selectedLang.id);
      setOutput(result);
      if (result.status?.id === 3) { // Accepted
        addActivity('coding', `Coding: ${problem.title} (${selectedLang.name})`, {
          language: selectedLang.name, category: problem.category,
        });
        toast.success('Code ran successfully!');
      }
    } catch (err) {
      toast.error('Execution failed: ' + err.message);
    }
    setRunning(false);
  };

  const resetCode = () => { setCode(selectedLang.template); setOutput(null); };

  return (
    <div className={`${darkMode ? 'bg-slate-900' : 'bg-gray-50'} min-h-screen flex flex-col`}>
      <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>

        {/* ── Left: Problem List ── */}
        <div className={`w-64 shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
          <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <Code2 className="inline mr-2" size={16} />
              Problems ({PROBLEMS.length})
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {PROBLEMS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => changeProblem(i)}
                className={`w-full text-left p-3 rounded-lg transition ${
                  selectedProblemIdx === i
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white'
                    : darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-sm">{p.title}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${selectedProblemIdx === i ? 'bg-white/20 text-white' : DIFF_COLOR[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                  <span className={`text-xs ${selectedProblemIdx === i ? 'text-blue-100' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {p.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Middle: Problem Description + Editor ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Problem Panel */}
          <div className={`w-80 shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-r overflow-y-auto`}>
            <div className={`border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="flex">
                {['description', 'hints'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
                        : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              {activeTab === 'description' ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{problem.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLOR[problem.difficulty]}`}>{problem.difficulty}</span>
                  </div>
                  <p className={`text-sm leading-relaxed mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.description}</p>
                  <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Examples:</h4>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className={`rounded-lg p-3 mb-3 text-xs font-mono ${darkMode ? 'bg-slate-700' : 'bg-gray-50 border'}`}>
                      <p className={darkMode ? 'text-blue-300' : 'text-blue-700'}>Input: {ex.input}</p>
                      <p className={darkMode ? 'text-green-300' : 'text-green-700'}>Output: {ex.output}</p>
                      {ex.explanation && <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>// {ex.explanation}</p>}
                    </div>
                  ))}
                  <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Test Cases:</h4>
                  {problem.testCases.map((tc, i) => (
                    <div key={i} className={`text-xs font-mono p-2 rounded mb-1 ${darkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-50 text-gray-600 border'}`}>{tc}</div>
                  ))}
                </>
              ) : (
                <>
                  <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>💡 Hints</h3>
                  {problem.hints.map((hint, i) => (
                    <div key={i} className={`p-3 rounded-lg mb-3 text-sm ${darkMode ? 'bg-slate-700 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                      {i + 1}. {hint}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Editor Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className={`flex items-center gap-3 px-4 py-2 border-b shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
              {/* Language picker */}
              <div className="flex gap-1 overflow-x-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => changeLang(lang)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedLang.id === lang.id
                        ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white'
                        : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{lang.icon}</span> {lang.name}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={resetCode} className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title="Reset">
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={runCode}
                  disabled={running}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-60"
                >
                  {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                  {running ? 'Running…' : 'Run Code'}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={selectedLang.monacoId}
                value={code}
                theme={darkMode ? 'vs-dark' : 'light'}
                onChange={val => setCode(val || '')}
                onMount={editor => { editorRef.current = editor; }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  tabSize: 2,
                  padding: { top: 16 },
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            {/* Output Panel */}
            {output && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className={`shrink-0 border-t ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className={`flex items-center gap-3 px-4 py-2 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  {output.status?.id === 3
                    ? <CheckCircle size={16} className="text-green-500" />
                    : <XCircle size={16} className="text-red-500" />}
                  <span className={`text-sm font-semibold ${output.status?.id === 3 ? 'text-green-500' : 'text-red-500'}`}>
                    {output.status?.description}
                  </span>
                  {output.time && <span className={`text-xs ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>⏱ {output.time}s · 🧠 {Math.round((output.memory || 0) / 1024)}KB</span>}
                </div>
                <pre className={`p-4 text-xs font-mono max-h-40 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {output.stdout || output.stderr || output.compile_output || 'No output'}
                  {output.stderr && <span className="text-red-400">{'\n' + output.stderr}</span>}
                  {output.compile_output && <span className="text-yellow-400">{'\n' + output.compile_output}</span>}
                </pre>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
