                  🚨 Please make sure you are sending pull request for 'master' branch.
                                            

# 📚 NotesVault - Academic Resource Management Platform

**NotesVault** is an open-source, full-stack web application designed to help **students**, **faculty**, and **academic institutions** efficiently store, browse, and manage academic notes, question papers, and educational resources. Built with modern technologies and inspired by platforms like RGPV Online, it provides a comprehensive solution for academic resource sharing.

---

## ✨ Key Features

### 📖 Core Functionality

- **Multi-format Resource Support**: Store and serve PDFs, documents, images, and various academic materials
- **Advanced Search & Filtering**: Find resources by course, semester, subject, year, and keywords
- **Hierarchical Organization**: Browse by university → course → branch → semester → subject
- **Question Paper Archive**: Comprehensive previous year questions (PYQs) with year-wise categorization
- **Notes Management**: Organized lecture notes, study materials, and reference documents
- **Syllabus Repository**: Complete syllabus documents for all courses and branches

### 👥 User Management

- **JWT Authentication**: Secure token-based authentication system
- **User Profiles**: Personalized dashboards with upload history and bookmarks
- **Registration System**: Easy signup with email verification

### 🔧 Technical Features

- **RESTful API**: Clean, documented API endpoints for all operations
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Dark/Light Theme**: User preference-based theming

---

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7
- **Backend**: Flask (Python)
- **Build Tools**: Vite, ESLint, Prettier
- **Type Safety**: TypeScript with strict mode

---

## 📁 Project Structure

```
notesvault/
├── src/                          # React application source
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript types
│   ├── styles/                   # Global styles
│   ├── context/                  # React Context providers
│   ├── services/                 # API services
│   ├── App.tsx                   # Main App component
│   └── main.tsx                  # Application entry point
├── public/                       # Public static files
├── backup_existing_project/      # Original HTML/CSS/JS files (legacy)
│   ├── assets/                   # Original assets
│   ├── backend/                  # Original backend
│   ├── pages/                    # Original HTML pages
│   ├── components/               # Original components
│   ├── scripts/                  # Original scripts
│   └── styling/                  # Original styles
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # This file
```

**Note**: Original frontend files (HTML/CSS/JS) are preserved in `backup_existing_project/` for reference.

---

## 🛠️ Getting Started (Development)

### Prerequisites

- **Node.js 20+** (for frontend) - [Download](https://nodejs.org/)
- **Python 3.8+** (for backend) - [Download](https://www.python.org/)
- **npm 10+** (usually comes with Node.js)

#### Verify installations:
```bash
node --version
npm --version
python3 --version
```

### 1. Clone the repository

```bash
git clone https://github.com/opensource-society/NotesVault.git
cd NotesVault
```

### 2. Set up Frontend (React + Vite)

```bash
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

### 3. Set up Backend (Flask)

**Terminal 2 (new terminal window):**

First, set up Python virtual environment:
```bash
cd backup_existing_project/backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Then install dependencies and run:
```bash
pip install -r requirements.txt
python3 run.py
```

The backend API will run at `http://localhost:5000`

### 4. Access the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

The frontend is configured to proxy API requests to the backend automatically.

### Troubleshooting

**Backend won't start - "Port 5000 in use"**
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>

# Or start on a different port
python3 run.py --port 5001
```

**Command not found: python or pip**
- Use `python3` and `pip3` instead
- Verify Python 3 is installed: `python3 --version`

**npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then try again

**Module not found errors on backend**
- Ensure virtual environment is activated (should see `(venv)` in terminal)
- Reinstall requirements: `pip install -r requirements.txt --force-reinstall`

---

## 📜 Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with Hot Module Replacement (HMR)

### Build

```bash
npm run build
```
Builds the app for production. Output will be in the `dist/` folder.

### Preview

```bash
npm run preview
```
Preview the production build locally

### Linting

```bash
npm run lint
```
Run ESLint to check code quality

```bash
npm run lint:fix
```
Run ESLint and automatically fix issues

### Formatting

```bash
npm run format
```
Format all source files with Prettier

```bash
npm run format:check
```
Check if files are formatted correctly

---

## 🎯 Path Aliases

The project is configured with path aliases for cleaner imports:

```typescript
import Button from '@/components/Button';
import useAuth from '@/hooks/useAuth';
import { formatDate } from '@/utils/date';
import { User } from '@/types/user';
import api from '@/services/api';
```

Available aliases:
- `@/` - src root
- All subdirectories accessible via `@/[directory]` pattern

---

## 🔌 Backend Integration

The Vite dev server is configured to proxy API requests to the Flask backend:

```typescript
// All requests to /api/* are proxied to http://localhost:5000
fetch('/api/notes')  // → http://localhost:5000/api/notes
```

---

## 🔧 Configuration

### TypeScript

TypeScript is configured with strict mode enabled. Path aliases are configured in `tsconfig.app.json`.

### ESLint

ESLint is configured with:
- TypeScript support
- React hooks rules
- React Refresh rules
- Prettier integration

### Prettier

Prettier is configured with:
- 2 space indentation
- Single quotes
- Semicolons
- 100 character line width
- Trailing commas (ES5)

---

## 🧑‍💻 Contributing

We welcome all kinds of contributions, especially from beginners! Since the project is being modernized with React, **you can help build core features from scratch**.

**Good first issues:**

- Setup basic UI structure or card layout
- Implement search and filtering logic
- Improve design responsiveness
- Add support for dark mode
- Build authentication UI components
- Create API service integration

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## 📝 Development Guidelines

### Component Structure

```typescript
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
```

### API Services

```typescript
// src/services/api.ts
export const fetchNotes = async () => {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};
```

### Custom Hooks

```typescript
// src/hooks/useNotes.ts
import { useState, useEffect } from 'react';
import { fetchNotes } from '@/services/api';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .finally(() => setLoading(false));
  }, []);
  
  return { notes, loading };
};
```

---

## 🚢 Deployment

Build the production bundle:

```bash
npm run build
```

The `dist/` folder will contain optimized static files ready for deployment.

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Let's build NotesVault together — an open-source resource that helps thousands of students revise and succeed. 🚀

## Updates
- Migrated to React + TypeScript + Vite for modern development experience
- Original HTML/CSS/JS files backed up in `backup_existing_project/`
- Added path aliases for cleaner imports
- Configured ESLint and Prettier for code quality
- Set up Flask backend proxy for seamless API integration
