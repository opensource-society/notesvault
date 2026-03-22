## 🧑‍💻 Contributing

Welcome! 👋
We're excited you're here and interested in contributing to **NotesVault**, a simple and helpful web app for managing academic notes and PYQs.

This project is in its early stage — so **you’re welcome to help build it from the ground up!**

---

### 🚀 Getting Started

1. **Fork the repo**
2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/NotesVault.git
   cd NotesVault
   ```
3. **Create a new branch**

   ```bash
   git checkout -b my-feature
   ```
4. **Set up your development environment** (see [README.md](README.md#-getting-started-development))
5. **Start coding!** Edit files, add features, fix bugs.
6. **Test your changes** (see section below)
7. **Commit and push**

   ```bash
   git commit -m "Add: my feature"
   git push origin my-feature
   ```
8. **Open a Pull Request** on the main repository. Your PR must target the `master` branch!

---

### 🛠 What Can You Work On?

Since the project is new, feel free to contribute:

* 🧱 UI improvements (card design, filters, responsiveness)
* 🗃️ JSON-based data structure improvements
* 🔍 Search and tag filters
* 🌙 Theme switcher
* 📥 Upload form (simulated)
* 🐞 Bug fixes
* 📄 Documentation and tutorials

We’ll also add `good first issue` and `help wanted` labels as the project evolves.

---

### 🧪 Testing Your Changes

Before submitting a pull request, make sure to test your changes locally:

#### 1. Frontend Testing

**Run the development server:**
```bash
npm run dev
```
- Manually test your feature in the browser at `http://localhost:5173`
- Check that your changes work across different screen sizes (responsive design)
- Open DevTools (F12) and check for console errors or warnings

**Run linting and formatting checks:**
```bash
npm run lint        # Check code quality
npm run lint:fix    # Automatically fix issues
npm run format:check # Check if files are formatted correctly
npm run format      # Format all files
```

**Build for production (optional but recommended):**
```bash
npm run build
npm run preview     # Preview the production build
```

#### 2. Backend Testing

**Make sure the backend is running:**
```bash
cd backup_existing_project/backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python3 run.py
```

**Test your API changes:**
- Use tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) to test API endpoints
- Check that error handling works correctly
- Test with invalid inputs to ensure proper validation

#### 3. Before Committing

- Ensure no console errors in browser DevTools
- Ensure linting passes (`npm run lint` shows no errors)
- Ensure formatting is correct (`npm run format:check` passes)
- Test on both desktop and mobile browsers if possible
- Write clear, descriptive commit messages

---

### 📚 Guidelines

* Keep code clean and readable
* Use meaningful commit messages
* Comment your code when needed
* Respect the [Code of Conduct](CODE_OF_CONDUCT.md)

---

### 🙌 Need Help?

If you're stuck or unsure, feel free to open an issue or ask in a discussion. We're here to help!

---

Let’s build something useful and open together. 💡
Happy coding!


