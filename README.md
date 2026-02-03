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


## 📁 Folder Structure

```
notesvault/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   ├── styles/        # Global styles
│   │   ├── context/       # React Context providers
│   │   └── services/      # API services
│   └── package.json
├── backend/           # Flask API backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── config.py
│   ├── requirements.txt
│   └── run.py
├── assets/            # Icons, PDFs, static files (legacy)
├── data/              # JSON files for notes/PYQs (legacy)
├── pages/             # HTML pages (legacy)
├── scripts/           # JavaScript files (legacy)
├── styling/           # CSS files (legacy)
└── README.md
```

**Note**: Legacy frontend files (pages, scripts, styling) are preserved in `backup_original_frontend/` for reference.

---

## 🛠️ Getting Started (Development)

### Prerequisites

- Node.js 20+ (for frontend)
- Python 3.x (for backend)

### 1. Clone the repository

```bash
git clone https://github.com/opensource-society/NotesVault.git
cd NotesVault
```

### 2. Set up Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`

For more details, see [frontend/README.md](frontend/README.md)

### 3. Set up Backend (Flask)

**Terminal 2:**
```bash
cd backend
pip install -r requirements.txt
python run.py
```

The backend API will run at `http://localhost:5000`

### 4. Access the Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

The frontend is configured to proxy API requests to the backend automatically.

### Development Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

**Backend:**
- `python run.py` - Start Flask development server

---

## 🧑‍💻 Contributing

We welcome all kinds of contributions, especially from beginners! Since the project is in early stages, **you can help build core features from scratch**.

**Good first issues:**

- Setup basic UI structure or card layout
- Add new subjects or notes to JSON
- Implement search and filtering logic
- Improve design responsiveness
- Add support for dark mode
- Add upload simulation with preview

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Let's build NotesVault together — an open-source resource that helps thousands of students revise and succeed. 🚀

## Updates
- Added favicon (favicon.ico) to the site.
- Added app icon (Icon.jpg) to the header, left of the app name.
