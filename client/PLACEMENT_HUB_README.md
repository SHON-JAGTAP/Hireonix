# PlacementHub - Modern Placement Preparation Website For MIT-ADT Students.

## 🎯 Project Overview

PlacementHub is a modern, responsive React-based platform designed to help college students prepare for campus placements. It combines multiple preparation tools including aptitude tests, coding challenges, resume analysis, and mock interviews.

## ✨ Features Implemented

### 1. **Homepage (Landing Page)**
- ✅ Attractive hero section with title "Placement Practice Hub"
- ✅ Engaging tagline: "Prepare, Practice, and Get Placed"
- ✅ Three action buttons: "Start Test", "Upload Resume", "Start Interview"
- ✅ Feature cards showcasing all modules
- ✅ Benefits section with 6 key advantages
- ✅ Statistics section displaying platform metrics
- ✅ Smooth animations using Framer Motion

### 2. **Responsive Navigation Bar**
- ✅ Logo with gradient styling (PlacementHub)
- ✅ Navigation links: Home, Tests, Resume, Interview, Login
- ✅ Dark/Light mode toggle with Moon/Sun icons
- ✅ User profile dropdown (when logged in)
- ✅ Logout functionality
- ✅ Mobile-friendly hamburger menu
- ✅ Sticky navbar with shadow effects

### 3. **Aptitude Test Module**
- ✅ Multiple choice questions (MCQ) format
- ✅ 30-minute timer with countdown
- ✅ Question categories: Quantitative, Logical Reasoning, Verbal
- ✅ Real-time progress bar
- ✅ Question navigator with status indicators
- ✅ Previous/Next/Skip functionality
- ✅ Instant scoring and results display
- ✅ Performance percentage calculation

### 4. **Coding Test Module**
- ✅ Built-in code editor with syntax highlighting
- ✅ Multiple programming problems
- ✅ Test cases display
- ✅ Run code functionality
- ✅ Copy to clipboard button
- ✅ Reset code template option
- ✅ Time complexity and space complexity display
- ✅ Problem list sidebar for easy navigation

### 5. **Resume Analyzer**
- ✅ Resume file upload interface (PDF, DOC, DOCX)
- ✅ Category-wise score breakdown:
  - Format & Structure
  - Content Quality
  - Skills Section
  - Experience Description
  - Keywords (ATS Optimization)
- ✅ Overall score out of 100 with grade (A, B+, etc.)
- ✅ Actionable suggestions list
- ✅ Progress bars for each category
- ✅ Download report feature
- ✅ Beautiful analytics visualization

### 6. **Interview Practice Module**
- ✅ Multiple interview types:
  - Technical Interview
  - HR Interview
  - Mock Group Discussion
- ✅ AI-powered chat interface
- ✅ Real-time message exchange
- ✅ Message history with timestamps
- ✅ Interviewer and user message differentiation
- ✅ Phone call UI elements
- ✅ Message input with send button

### 7. **Footer Component**
- ✅ About section
- ✅ Quick links navigation
- ✅ Resources section
- ✅ Social media links (GitHub, LinkedIn, Twitter, Email)
- ✅ Copyright information
- ✅ Responsive grid layout

### 8. **UI/UX Design Features**
- ✅ **Dark/Light Mode**: Toggle between themes
- ✅ **Modern Cards**: Clean card-based layout throughout
- ✅ **Gradient Buttons**: Beautiful gradient styling on CTAs
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Animations**: Smooth transitions using Framer Motion
- ✅ **Icons**: Professional icons from Lucide React

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          (Updated with new style)
│   │   ├── Footer.jsx          (New)
│   │   ├── TestCard.jsx        (New)
│   ├── pages/
│   │   ├── IndexHome.jsx       (NEW - Main landing page)
│   │   ├── AptitudeTest.jsx    (NEW - Aptitude test module)
│   │   ├── CodingTest.jsx      (NEW - Coding challenges)
│   │   ├── ResumeAnalyzer.jsx  (NEW - Resume score analysis)
│   │   ├── InterviewPractice.jsx (NEW - Mock interviews)
│   │   ├── Home.jsx            (Existing auth flow)
│   │   ├── Login.jsx           (Existing)
│   │   ├── EmailVerify.jsx     (Existing)
│   │   ├── ResetPassword.jsx   (Existing)
│   ├── context/
│   │   └── AppContext.jsx      (Existing auth context)
│   ├── App.jsx                 (Updated with new routes)
│   ├── main.jsx                (Entry point)
│   └── index.css               (Tailwind CSS)
```

## 🚀 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | IndexHome | Landing page with placement hub features |
| `/home` | Home | Authentication flow home |
| `/login` | Login | User authentication |
| `/email-verify` | EmailVerify | Email verification |
| `/reset-password` | ResetPassword | Password reset |
| `/aptitude` | AptitudeTest | Aptitude practice tests |
| `/coding` | CodingTest | Coding challenges |
| `/resume` | ResumeAnalyzer | Resume analysis tool |
| `/interview` | InterviewPractice | Mock interview practice |

## 🛠 Technologies Used

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.2.1
- **Animations**: Framer Motion (latest)
- **Icons**: Lucide React (latest)
- **Routing**: React Router DOM 7.13.1
- **Notifications**: React Toastify 11.0.5
- **HTTP Client**: Axios 1.13.5
- **Linting**: ESLint 9.39.1

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.1",
  "react-toastify": "^11.0.5",
  "axios": "^1.13.5",
  "@tailwindcss/vite": "^4.2.1",
  "tailwindcss": "^4.2.1",
  "framer-motion": "latest",
  "lucide-react": "latest"
}
```

## 🎨 UI Components

### Reusable Components
1. **Navbar** - Main navigation with dark mode toggle
2. **Footer** - Footer with links and social media
3. **TestCard** - Card component for displaying tests/features

### Page-Specific Components
1. **IndexHome** - Hero section, features grid, benefits, stats
2. **AptitudeTest** - Test interface with timer and MCQs
3. **CodingTest** - Code editor with problem navigator
4. **ResumeAnalyzer** - Upload and analysis UI
5. **InterviewPractice** - Chat-based interview interface

## 🎯 Key Features Highlight

### Animations & Transitions
- Smooth page transitions with Framer Motion
- Hover effects on cards and buttons
- Staggered animations for list items
- Scale and fade animations on load

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Grid layouts that adapt to screen sizes
- Hamburger menu for mobile navigation
- Touch-friendly button sizes

### User Experience
- Dark/Light mode toggle
- Intuitive navigation flow
- Loading states and timers
- Success/error feedback
- Progress indicators

### Accessibility
- Semantic HTML structure
- Clear button labels
- Proper contrast ratios
- Keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd client
npm install
npm run dev
```

### Running the Application
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## 📊 Dummy Data

The application uses dummy data for:
- Aptitude test questions (5 sample questions)
- Coding problems (2 sample problems with test cases)
- Resume analysis results (sample scoring)
- Interview questions (simulated responses)

In production, these should be replaced with API calls to your backend.

## 🔄 API Integration Points

Ready to connect to backend APIs at:
- `POST /api/auth/logout` - Logout functionality
- Can be extended with:
  - `/api/tests/` - Fetch test questions
  - `/api/resume/analyze` - Upload and analyze resumes
  - `/api/interview/questions` - Get interview questions
  - `/api/user/profile` - Fetch user data

## 🎓 Customization Guide

### Changing Theme Colors
Edit the tailwind classes in components to change from `blue-500`/`purple-600` to your preferred colors.

### Adding New Features
1. Create new page component in `pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### Modifying Questions/Problems
Update the `questions` or `problems` state in respective page components.

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 Security Notes

- Store API keys in environment variables
- Implement proper authentication on backend
- Validate file uploads (resume analyzer)
- Sanitize user inputs in interview chat
- Use HTTPS in production

## 📈 Future Enhancements

- [ ] User profiles and progress tracking
- [ ] Real-time leaderboards
- [ ] E-certificates
- [ ] Integration with actual coding sandboxes
- [ ] Video mock interviews
- [ ] AI-powered feedback
- [ ] Admin dashboard
- [ ] Payment integration

## 🐛 Known Limitations

- Dummy data is used (no backend integration yet)
- Resume analyzer uses mock scoring
- Interview responses are simulated
- No data persistence between sessions

## 📝 License

This project is part of the MIT ADT Placement Hub initiative.

## 👨‍💻 Support

For issues or suggestions, please contact the development team.

---

**Built with ❤️. for students preparing for placements**
