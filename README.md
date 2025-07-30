# 📚 NotesVault – Academic Notes & PYQs Manager

**NotesVault** is a beginner-friendly, open-source web app designed to help students **store, browse, and manage academic notes and previous year questions (PYQs)** in one place. This project is perfect for contributors who want to build and grow a useful educational tool from scratch.

---

## ✨ Features (Planned)

- 📚 Browse notes and PYQs by subject or semester
- 🔍 Search and filter by keywords
- ➕ Add new notes manually (or via JSON for demo)
- 📱 Ensure responsive design for all devices
- 🌗Toggle between dark and light mode
- ⬆️ Upload files with UI and metadata editing
- 🏷️ Filter notes by tags

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
├── scripts            # Application logic (loading, displaying, filtering)
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

To get started, please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide. It outlines how to fork the repo, create branches, and submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Let's build NotesVault together — an open-source resource that helps thousands of students revise and succeed. 🚀

## Updates

- Added favicon (favicon.ico) to the site.
- Added app icon (Icon.jpg) to the header, left of the app name.
