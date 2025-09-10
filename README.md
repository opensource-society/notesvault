# NotesVault

NotesVault is a simple PHP application designed to manage notes. This project includes a backend for handling note operations and an API for interacting with the notes through HTTP requests.

## Project Structure

```
notesvault
├── backend
│   └── notes.php
├── api
│   └── index.php
├── .htaccess
└── README.md
```

## Features

- Create, read, update, and delete notes.
- RESTful API for managing notes.
- URL rewriting for cleaner API endpoints.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Ensure you have a web server with PHP and a database (e.g., MySQL) set up.
4. Configure your database connection in `backend/notes.php`.
5. Place the project in your web server's root directory.

## Usage

- Access the API at `http://yourdomain.com/api/index.php`.
- Use the following endpoints:
  - `POST /notes` - Create a new note.
  - `GET /notes` - Retrieve all notes.
  - `GET /notes/{id}` - Retrieve a specific note by ID.
  - `PUT /notes/{id}` - Update a specific note by ID.
  - `DELETE /notes/{id}` - Delete a specific note by ID.

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is open-source and available under the MIT License.