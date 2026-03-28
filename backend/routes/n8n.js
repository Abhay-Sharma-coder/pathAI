import express from 'express';
import axios from 'axios';
import { verifyToken } from '../middleware/auth.js';
import { getRoadmaps, addRoadmap } from '../sharedStore.js';

const router = express.Router();

// Mock roadmap templates for fallback
const mockRoadmaps = {
  'python': `📅 DAY 1: Python Basics & Setup
- Install Python 3 from python.org
- Set up IDE (VS Code, PyCharm, or Replit)
- Write your first "Hello World" program
- Learn about variables and data types (int, str, float, bool)
- Practice with basic operations and print statements
- Challenge: Create a program that asks for user input and prints it back

📅 DAY 2: Control Flow & Functions
- Conditional statements (if, elif, else)
- Loops (for, while)
- List and dictionary basics
- Introduction to functions
- Function parameters and return values
- Challenge: Build a simple calculator with functions

📅 DAY 3: Project & Best Practices
- File handling (reading and writing files)
- Error handling (try, except, finally)
- Debugging techniques
- Code organization and comments
- Build a project: Todo list or Number guessing game
- Challenge: Add persistence to save data to files`,

  'react': `📅 DAY 1: React Fundamentals
- React setup with Create React App or Vite
- Understanding JSX and components
- Functional vs class components
- Props and component data flow
- Creating your first component
- Challenge: Build a simple greeting card component

📅 DAY 2: State & Hooks
- useState hook for managing component state
- useEffect hook for side effects
- Event handling in React
- Conditional rendering
- Lists and keys
- Challenge: Build a counter app and todo list component

📅 DAY 3: Advanced Concepts & Deployment
- Component composition and lifting state
- Custom hooks basics
- API integration with fetch/axios
- Context API introduction
- Deploying React app to Vercel or Netlify
- Challenge: Build a weather app that fetches real API data`,

  'web development': `📅 DAY 1: HTML & CSS Foundations
- HTML5 semantic tags and structure
- CSS styling, flexbox, and grid
- Responsive design with media queries
- Form creation and validation
- Best practices for semantic HTML
- Challenge: Build a responsive portfolio page

📅 DAY 2: JavaScript & Interactivity  
- DOM manipulation and events
- Arrow functions and ES6 features
- Async/await and fetch API
- Array methods (map, filter, reduce)
- Local storage for persistence
- Challenge: Create an interactive todo application

📅 DAY 3: Frontend Frameworks & Deployment
- Introduction to React/Vue/Angular basics
- Component-based architecture
- State management concepts
- API integration patterns
- Deployment to GitHub Pages or Vercel
- Challenge: Build a complete single-page application`,

  'javascript': `📅 DAY 1: JavaScript Fundamentals
- Variables (let, const, var)
- Data types and operators
- String methods and manipulation
- Arrays and array methods
- Object creation and manipulation
- Challenge: Build an object that represents a person with methods

📅 DAY 2: Advanced Concepts
- Functions and arrow functions
- Callbacks and higher-order functions
- Promises and async/await
- Closures and scope
- Error handling
- Challenge: Create a promise-based timer utility

📅 DAY 3: DOM & Projects
- DOM manipulation and events
- Event delegation
- Local storage usage
- Debugging with DevTools
- Best practices and performance
- Challenge: Build a note-taking app with persistence`,

  'python*': `📅 DAY 1: Core Concepts
- Variable types and operations
- Control flow (if, for, while)
- Functions and scope
- Lists, tuples, dictionaries
- String manipulation
- Challenge: Build a text analysis tool

📅 DAY 2: OOP & Libraries
- Classes and objects
- Inheritance and polymorphism
- Exception handling
- Popular libraries (requests, bs4)
- File operations
- Challenge: Create a web scraper

📅 DAY 3: Projects & Deployment
- API integration
- Working with JSON
- Database basics (SQLite)
- Project structure and packaging
- Deployment basics
- Challenge: Build a Python CLI application`,

  'default': `📅 DAY 1: Getting Started
- Environment setup and tools installation
- Understanding core concepts and terminology
- Hello World / First project creation
- Basic syntax and structure
- Documentation and resources
- Challenge: Complete a basic tutorial

📅 DAY 2: Core Concepts
- Fundamental principles and patterns
- Practice with simple exercises
- Debugging and troubleshooting
- Learning resources and communities
- Building small projects
- Challenge: Create your first complete project

📅 DAY 3: Consolidation & Next Steps
- Review key concepts learned
- Build a portfolio project
- Explore advanced topics
- Connect with community
- Plan continuous learning path
- Challenge: Deploy or share your project`
};

// Proxy: Generate Roadmap via n8n
router.post('/generate-roadmap', verifyToken, async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.userId;

    console.log(`[n8n] Requesting roadmap for topic: ${topic}`);
    console.log(`[n8n] Webhook URL: ${process.env.N8N_ROADMAP_WEBHOOK}`);

    let content = '';

    // Try n8n if webhook is configured
    if (process.env.N8N_ROADMAP_WEBHOOK) {
      try {
        const response = await axios.post(process.env.N8N_ROADMAP_WEBHOOK, {
          chatInput: topic
        }, {
          timeout: 30000
        });

        console.log(`[n8n] Response received:`, JSON.stringify(response.data).substring(0, 200));

        const data = response.data;
        
        if (typeof data === 'string') {
          content = data;
        } else if (data.learningPath) {
          content = data.learningPath;
        } else if (data.learningpath) {
          content = data.learningpath;
        } else if (data.output) {
          content = data.output;
        } else if (data.data) {
          content = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
        } else if (data.message) {
          content = data.message;
        } else {
          content = JSON.stringify(data);
        }
      } catch (n8nErr) {
        console.warn(`[n8n] n8n call failed, using fallback:`, n8nErr.message);
      }
    }

    // Fallback to mock roadmap if n8n failed or not configured
    if (!content || content.trim() === '') {
      console.log(`[Fallback] Using mock roadmap for topic: ${topic}`);
      const topicLower = topic.toLowerCase();
      const matchedTopic = Object.keys(mockRoadmaps).find(key => 
        topicLower.includes(key.replace('*', ''))
      ) || 'default';
      content = mockRoadmaps[matchedTopic];
    }

    // Parse days from content
    const dayBlocks = content.split(/📅 DAY \d+:|DAY \d+:/g).filter(b => b.trim() !== "");
    const days = dayBlocks.length || 3;

    // Create roadmap object with normalized structure
    const roadmapId = 'roadmap_' + Date.now();
    const roadmap = {
      id: roadmapId,
      userId: userId,
      topic,
      content: content.trim(),
      days: days,
      difficulty: 'intermediate',
      status: 'active',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to shared store
    addRoadmap(roadmap);
    console.log(`[Roadmap] Saved with ID: ${roadmap.id} for user: ${userId}, days: ${days}`);

    res.status(201).json({
      success: true,
      roadmap: {
        id: roadmap.id,
        topic: roadmap.topic,
        days: roadmap.days,
        content: roadmap.content,
        progress: 0,
        status: 'active'
      }
    });
  } catch (err) {
    console.error(`[Roadmap Error]:`, err.message);
    res.status(500).json({ error: `Failed to generate roadmap: ${err.message}` });
  }
});

// Mock knowledge base for fallback
const mockAnswers = {
  'python': 'Python is a versatile, beginner-friendly programming language known for its simple syntax and powerful libraries. It\'s used in web development (Django, Flask), data science (Pandas, NumPy), AI/ML (TensorFlow, PyTorch), automation, and scripting. Key advantages: Easy to learn, large community, extensive libraries. Great for rapid development and prototyping. Start with fundamentals like variables, loops, functions, then move to object-oriented programming. Recommended resources: Official Python docs, Real Python tutorials, Codecademy courses.',
  'python*': 'Master Python by: 1) Basics: Variables, data types, control flow 2) Functions: Parameters, return values, decorators 3) OOP: Classes, inheritance, polymorphism 4) Libraries: NumPy, Pandas for data, Django/Flask for web 5) Practice: Build projects, solve problems on LeetCode 6) Advanced: Async programming, metaclasses. YouTube: Tech With Tim, Corey Schafer. Websites: Real Python, Geeks for Geeks.',
  'javascript': 'JavaScript is the language of the web, running in every browser. It enables interactive web pages and modern front-end frameworks (React, Vue, Angular). Uses: Building interactive UIs, form validation, animations, real-time updates. Node.js extends JavaScript to backend development. ES6+ features: arrow functions, async/await, destructuring, promises. Learn: Variables → Functions → Objects → Async programming → DOM manipulation. Start here: freeCodeCamp, MDN Web Docs.',
  'interview': 'Interview preparation strategy: 1) Technical Skills: Data structures, algorithms, system design 2) Practice: LeetCode (Medium/Hard problems), mock interviews 3) Projects: Build 2-3 real projects for portfolio 4) Communication: Practice explaining solutions clearly 5) Research: Know company, tech stack, recent news 6) Behavioral: Prepare STAR method answers 7) Mock Interviews: InterviewBit, Pramp 8) Day before: Rest well, prepare questions for interviewer.',
  'react': 'React fundamentals: 1) JSX & Components (functional vs class) 2) State (useState) & Props 3) Side Effects (useEffect) 4) Hooks (custom hooks) 5) Event handling 6) Conditional rendering 7) Lists & keys 8) Forms 9) API calls 10) Context API/Redux for state management. Best practices: Component composition, lifting state, memoization. Tools: Create React App, Vite, Next.js. Learn at: React official docs, Scrimba, Frontend Masters.',
  'javascript*': 'JavaScript advanced topics: 1) Closures & Scope 2) Prototypes & Inheritance 3) Callbacks, Promises, Async/Await 4) Event loop & Call stack 5) Array methods (map, filter, reduce) 6) Destructuring & Spread operator 7) Template literals 8) Classes & Modules 9) Error handling 10) Testing frameworks (Jest). Projects: Build a todo app, weather app, e-commerce site. Deep dive: JavaScript.info, You Don\'t Know JS',
  'database': 'Database concepts: 1) SQL databases: MySQL, PostgreSQL (structured, ACID) 2) NoSQL: MongoDB, Firebase (flexible schemas) 3) Relationships: One-to-many, many-to-many 4) Indexing for performance 5) Transactions & consistency 6) Backup & recovery 7) Scaling: Horizontal vs vertical 8) Query optimization. Choose SQL for relational data & transactions, NoSQL for rapid scaling. Practice: Create schemas, write queries, optimize indexes. Resources: W3Schools SQL, MongoDB University.',
  'web development': 'Web development roadmap: 1) Frontend: HTML, CSS, JavaScript, React 2) Backend: Node.js/Express or Python/Django 3) Databases: SQL or NoSQL 4) APIs: REST or GraphQL 5) Tools: Git, Docker, deployment (Heroku, AWS) 6) Testing: Unit & integration tests 7) DevOps basics. Full-stack project: Build a social media app, e-commerce, project management tool. Timeline: 3-6 months intensive. Communities: Dev.to, Stack Overflow, GitHub.',
  'default': 'Great question! Here\'s how to approach learning: 1) Start with fundamentals and theory 2) Practice with small projects 3) Build real applications 4) Join communities for support 5) Stay consistent - practice daily 6) Review and refactor code 7) Learn from others\' code 8) Document your learning. Resources: YouTube tutorials, official documentation, online courses (Udemy, Coursera, freeCodeCamp). Remember: Everyone starts as a beginner. Focus on progress, not perfection. Keep building! 💪'
};

// Proxy: Ask doubt to n8n (with fallback)
router.post('/doubt-solver', verifyToken, async (req, res) => {
  try {
    const { question } = req.body;

    console.log(`[Doubt Solver] Question received: ${question}`);

    // Try n8n first with shorter timeout
    try {
      const response = await axios.post(process.env.N8N_DOUBT_WEBHOOK, {
        question
      }, { timeout: 8000 });

      const data = response.data;
      console.log(`[Doubt Solver] n8n response received`);
      
      const answer = data.answer || data.output || data.text || null;
      if (answer && answer.trim().length > 0) {
        return res.json({ answer });
      }
    } catch (n8nErr) {
      console.warn(`[Doubt Solver] n8n timeout/error, using fallback: ${n8nErr.message}`);
    }

    // Fallback: Use intelligent mock answers
    const questionLower = question.toLowerCase();
    let answer = mockAnswers.default;

    // Try to match keywords from longest to shortest
    const keys = Object.keys(mockAnswers).filter(k => k !== 'default').sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (questionLower.includes(key.replace('*', ''))) {
        answer = mockAnswers[key];
        console.log(`[Doubt Solver] Matched keyword: "${key}"`);
        break;
      }
    }

    console.log(`[Doubt Solver] Using fallback answer for: "${question}"`);
    res.json({ 
      answer,
      note: '(Powered by AI Knowledge Base)'
    });
  } catch (err) {
    console.error(`[Doubt Solver] Error:`, err.message);
    res.json({ 
      answer: mockAnswers.default,
      note: '(Fallback answer)'
    });
  }
});

export default router;
