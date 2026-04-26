const fs = require('fs');

const files = [
  'd:/HIREONIXF/Hireonix/client/src/pages/ResumeAnalyzer.jsx',
  'd:/HIREONIXF/Hireonix/client/src/pages/InterviewPractice.jsx',
  'd:/HIREONIXF/Hireonix/client/src/pages/IndexHome.jsx',
  'd:/HIREONIXF/Hireonix/client/src/pages/CodingTest.jsx',
  'd:/HIREONIXF/Hireonix/client/src/pages/AptitudeTest.jsx',
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  // Skip if already has AppContent import 
  // We need to add the import carefully.
  if (code.includes('darkMode') && !code.includes('AppContent')) {
      code = "import { AppContent } from '../context/AppContext';\n" + code;
  }
  
  // also verify useContext is there
  if (code.includes('darkMode') && !code.includes('useContext')) {
      code = code.replace(/import React, {/, 'import React, { useContext,');
  }

  // Replace local state with Context context
  code = code.replace(/const\s+\[darkMode,\s*setDarkMode\]\s*=\s*useState\([^)]*\);?/g, 'const { darkMode, setDarkMode } = useContext(AppContent);');

  fs.writeFileSync(file, code);
}
console.log('Fixed themes!');
