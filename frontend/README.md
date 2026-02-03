# NotesVault Frontend

Modern React frontend built with Vite, TypeScript, and best practices.

## 🚀 Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/       # Static assets (images, icons, etc.)
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── types/        # TypeScript types and interfaces
│   ├── styles/       # Global styles and CSS modules
│   ├── context/      # React Context providers
│   ├── services/     # API services and external integrations
│   ├── App.tsx       # Main App component
│   └── main.tsx      # Application entry point
├── public/           # Public static files
├── .prettierrc       # Prettier configuration
├── eslint.config.js  # ESLint configuration
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── package.json      # Dependencies and scripts
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+

### Installation

```bash
cd frontend
npm install
```

### Available Scripts

#### Development

```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

The dev server is configured to proxy API requests to the Flask backend at `http://localhost:5000`

#### Build

```bash
npm run build
```
Builds the app for production. Output will be in the `dist/` folder.

#### Preview

```bash
npm run preview
```
Preview the production build locally

#### Linting

```bash
npm run lint
```
Run ESLint to check code quality

```bash
npm run lint:fix
```
Run ESLint and automatically fix issues

#### Formatting

```bash
npm run format
```
Format all source files with Prettier

```bash
npm run format:check
```
Check if files are formatted correctly

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
- `@/components` - components directory
- `@/pages` - pages directory
- `@/hooks` - hooks directory
- `@/utils` - utils directory
- `@/types` - types directory
- `@/styles` - styles directory
- `@/context` - context directory
- `@/services` - services directory
- `@/assets` - assets directory

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

## 🔌 Backend Integration

The Vite dev server is configured to proxy API requests to the Flask backend:

```typescript
// All requests to /api/* are proxied to http://localhost:5000
fetch('/api/notes')  // → http://localhost:5000/api/notes
```

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📝 Development Guidelines

### Component Structure

```typescript
// components/Button.tsx
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
// services/api.ts
export const fetchNotes = async () => {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};
```

### Custom Hooks

```typescript
// hooks/useNotes.ts
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

## 🚢 Deployment

Build the production bundle:

```bash
npm run build
```

The `dist/` folder will contain optimized static files ready for deployment.

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

## 🤝 Contributing

1. Follow the existing code style
2. Write TypeScript types for all props and functions
3. Run linting and formatting before committing
4. Test your changes locally

---

Built with ❤️ by the NotesVault team

