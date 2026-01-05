# Contributing to OWASP Bootcamp

Thank you for your interest in contributing to the OWASP Bootcamp project! This is an educational resource, and we welcome contributions that improve the learning experience.

## How to Contribute

### Reporting Issues

If you find a problem:
1. Check if the issue already exists
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Docker version)

### Suggesting Enhancements

We welcome suggestions for:
- New lab exercises
- Improved documentation
- Additional vulnerability examples
- Better explanations
- UI/UX improvements

Create an issue with:
- Clear description of the enhancement
- Rationale for the change
- Example implementation (if applicable)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-lab`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Create a Pull Request

### Code Guidelines

#### For Lab Exercises

**Vulnerable Code:**
- Must clearly demonstrate the vulnerability
- Should be simple and easy to understand
- Must include comments explaining the vulnerability
- Should not be overly complex

**Secure Code:**
- Must properly fix the vulnerability
- Should follow best practices
- Must include comments explaining the fix
- Should be production-ready approach

#### Docker Configuration

- Keep images lightweight (Alpine-based)
- Use multi-stage builds if needed
- Don't include unnecessary dependencies
- Follow Docker best practices
- Test on different platforms

#### Documentation

- Use clear, simple language
- Include code examples
- Add screenshots where helpful
- Keep beginner-friendly
- Proofread for typos

### Testing Your Changes

Before submitting:

```bash
# Build all containers
docker compose build

# Start services
docker compose up -d

# Test each lab manually
# - Check vulnerable endpoints work
# - Check secure endpoints work
# - Verify explanations are clear

# Check for errors
docker compose logs

# Clean up
docker compose down -v
```

### Commit Messages

Use clear, descriptive commit messages:

Good:
- "Add A11 lab for CSRF vulnerabilities"
- "Fix SQL injection example in A05 lab"
- "Update README with troubleshooting section"

Not good:
- "Update"
- "Fix stuff"
- "WIP"

### Code of Conduct

- Be respectful and professional
- Help create a welcoming environment
- Focus on constructive feedback
- Remember this is educational material
- Keep discussions on-topic

### What We're Looking For

**High Priority:**
- Bug fixes
- Documentation improvements
- Accessibility improvements
- Platform compatibility fixes
- Performance optimizations

**Medium Priority:**
- New lab exercises
- Additional examples
- Better explanations
- UI improvements

**Low Priority:**
- New features
- Major refactoring
- Experimental ideas

### What We Won't Accept

- Actual security improvements to vulnerable code (defeats the purpose!)
- Making vulnerabilities harder to find (this is learning material)
- Overly complex examples
- Poorly documented changes
- Breaking changes without discussion
- Unethical content

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/OwaspBootcamp.git
cd OwaspBootcamp

# Create a branch
git checkout -b feature/your-feature

# Make changes
# ...

# Test
docker compose up -d
# Test manually in browser

# Commit
git add .
git commit -m "Description of changes"

# Push
git push origin feature/your-feature

# Create PR on GitHub
```

## Questions?

- Create an issue for questions
- Tag as "question"
- Be specific about what you need help with

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in the README and release notes.

---

Thank you for helping improve OWASP Bootcamp! 🙏
