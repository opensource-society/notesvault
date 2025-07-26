# 📚 NotesVault – Academic Notes & PYQs Manager

**NotesVault** is a beginner-friendly, open-source web app designed to help students **store, browse, and manage academic notes and previous year questions (PYQs)** in one place. This project is perfect for contributors who want to build and grow a useful educational tool from scratch.

---

## ✨ Features (Planned)

* Browse notes and PYQs by subject/semester
* Search and filter by keywords
* Add new notes manually (or from JSON for demo)
* Responsive design for all devices
* Dark/light mode toggle
* Upload UI and metadata editing
* Tag-based filtering

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

* Edit `notes.json` to simulate new data
* Modify layout or logic in `style.css` and `script.js`
* Use browser DevTools to inspect results

---

## 🧑‍💻 Contributing

We welcome all kinds of contributions, especially from beginners! Since the project is in early stages, **you can help build core features from scratch**.

**Good first issues:**

* Setup basic UI structure or card layout
* Add new subjects or notes to JSON
* Implement search and filtering logic
* Improve design responsiveness
* Add support for dark mode
* Add upload simulation with preview

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Let's build NotesVault together — an open-source resource that helps thousands of students revise and succeed. 🚀

## 👥 Contributors

Special thanks to all the contributors who have helped build NotesVault:

### Backend Development
- **[Asit Kumar](https://github.com/Asit-14)** - Complete Flask backend setup, API development, database models, authentication system, and testing infrastructure

### Frontend Development
- Various contributors from the open-source community

## Updates
- Added favicon (favicon.ico) to the site.
- Added app icon (Icon.jpg) to the header, left of the app name.
- Complete Flask backend implementation with REST API, authentication, and database models
