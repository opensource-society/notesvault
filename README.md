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


## 📁 Folder Structure (Suggested)

```
notesvault/
├── assets/            # Icons, PDFs, static files
    └── <asset_folders>
├── data/              # All JSON files for notes/PYQs
│   └── notes.json
├── pages/             # All pages used in the project
│   └── <all .html files>
├── scripts            # Application logic (load/display/filter)
    └── <scripts>
├── styling            # Global styles and theming
    └── <style files>
└── README.md
```

---

## 🛠️ Getting Started (Development)

1. **Clone the repository**

    ```bash
    git clone https://github.com/opensource-society/NotesVault.git
    cd NotesVault
    ```

2. **Open the app**

Simply open `index.html` in your browser. All data is stored locally via JSON or localStorage.

3. **Develop and test**

- Edit `notes.json` to simulate new data
- Modify layout or logic in `style.css` and `script.js`
- Use browser DevTools to inspect results

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
