# 🤝 Contributing to PathAI

We love your input! We want to make contributing to PathAI as easy and transparent as possible.

## How to Contribute

### 1. Report Bugs
Found a bug? Please create an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

### 2. Suggest Enhancements
Have a great idea? Open an issue with:
- Feature description
- Use cases
- Suggested implementation (if you have ideas)

### 3. Submit Pull Requests
1. Fork the repo
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/pathAI.git
cd pathAI

# Install dependencies
cd backend && npm install
cd ../react-app && npm install

# Create .env (see SETUP_DETAILED.md)
cp backend/.env.example backend/.env

# Start development
# Terminal 1: cd backend && npm start
# Terminal 2: cd ../.. && python -m http.server 8000
```

## Code Standards

### JavaScript/Node.js
```javascript
// Use const/let, avoid var
const API_URL = 'http://localhost:5000/api';

// Use meaningful names
function generateRoadmap(topic, difficulty) {
  // Implementation
}

// Add comments for complex logic
// Calculate streak bonus
const bonus = currentStreak > 7 ? 10 : 0;

// Use arrow functions
const handleClick = () => {
  // Action
};
```

### Git Commits
```bash
# Good
git commit -m "feat: add streak freeze feature"
git commit -m "fix: resolve quiz grading bug"
git commit -m "docs: update API documentation"

# Bad
git commit -m "fixed stuff"
git commit -m "updated"
```

## Pull Request Process

1. Update README.md with any new features
2. Ensure tests pass (if applicable)
3. Add descriptive PR title and description
4. Link related issues
5. Request review from maintainers

## Code Review

Code reviews focus on:
- Functionality
- Code quality
- Documentation
- Performance
- Security

Be respectful and constructive!

## Questions?

- 📧 Email: support@pathai.com
- 💬 GitHub Discussions
- 🐛 GitHub Issues

---

Thank you for contributing! 🙌
