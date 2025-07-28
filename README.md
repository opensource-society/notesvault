📚 NotesVault – Academic Notes & PYQs Manager
NotesVault is a beginner-friendly, open-source web app designed to help students store, browse, and manage academic notes and previous year questions (PYQs) in one place. This project is perfect for contributors who want to build and grow a useful educational tool from scratch.

✨ Features (Planned & In Progress)
✅ Browse notes and PYQs by subject/semester

✅ Search and filter by keywords

✅ Add new notes manually (or from JSON for demo)

✅ Responsive design for all devices

✅ Dark/light mode toggle

⏳ Upload UI and metadata editing (Upcoming)

⏳ Tag-based filtering (Upcoming)

📁 Folder Structure (Suggested)
graphql
Copy code
notesvault/
├── index.html         # Homepage UI
├── style.css          # Global styles and theming
├── script.js          # Application logic (load/display/filter)
├── data/              # JSON files for notes/PYQs
│   └── notes.json
├── assets/            # Icons, PDFs, static files
├── pages/             # All HTML pages used in the project
├── scripts/           # Additional JS logic (if needed)
├── styling/           # Extra CSS files or themes
└── README.md
🛠 Getting Started (Development)
Clone the repository

bash
Copy code
git clone https://github.com/opensource-society/NotesVault.git
cd NotesVault
Open the app
Simply open index.html in your browser. All data is stored locally via JSON or localStorage.

Develop and test

Edit notes.json to simulate new data

Modify layout or logic in style.css and script.js

Use browser DevTools to inspect results

🧑‍💻 Contributing
We welcome all kinds of contributions, especially from beginners! Since the project is in early stages, you can help build core features from scratch.

Good first issues:

Setup basic UI structure or card layout

Add new subjects or notes to JSON

Implement search and filtering logic

Improve design responsiveness

Add support for dark mode

Add upload simulation with preview

See CONTRIBUTING.md to get started.

📄 License
This project is licensed under the MIT License.

🆕 Updates
Added favicon (favicon.ico) to the site.

Added app icon (Icon.jpg) to the header, left of the app name.
