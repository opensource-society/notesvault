# NotesVault Backend

A comprehensive Flask REST API backend for the NotesVault application, providing secure authentication, note management, and user account functionality.

## 🚀 Features

- **RESTful API**: Complete REST API with user and note endpoints
- **JWT Authentication**: Secure token-based authentication system
- **Password Security**: Bcrypt password hashing for user security
- **Database Management**: SQLAlchemy ORM with SQLite database
- **Input Validation**: Comprehensive request validation using Marshmallow
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Testing Suite**: Complete test coverage with pytest
- **Blueprint Architecture**: Modular code organization

## 📋 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh

### Notes Management

- `GET /api/v1/notes` - Get all notes (authenticated)
- `POST /api/v1/notes` - Create new note (authenticated)
- `GET /api/v1/notes/<id>` - Get specific note (authenticated)
- `PUT /api/v1/notes/<id>` - Update note (authenticated)
- `DELETE /api/v1/notes/<id>` - Delete note (authenticated)

### Health Check

- `GET /api/v1/health` - Health status endpoint

## 🛠️ Technology Stack

- **Flask 2.3.3** - Web framework
- **SQLAlchemy 2.0.36** - ORM and database management
- **PyJWT** - JSON Web Token handling
- **bcrypt** - Password hashing
- **Marshmallow** - Input validation and serialization
- **Flask-CORS** - Cross-origin resource sharing
- **pytest** - Testing framework

## 🚀 Quick Start

1. **Setup virtual environment:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Initialize database:**

```bash
python -c "from app import create_app; from models import db; app = create_app(); app.app_context().push(); db.create_all()"
```

4. **Run the application:**

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///notesvault.db
JWT_SECRET_KEY=your-jwt-secret-key
```

## 🧪 Testing

Run the test suite:

```bash
python -m pytest tests/ -v
```

## 📁 Project Structure

```
backend/
├── app.py              # Flask application factory
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
├── models/            # Database models
│   ├── __init__.py
│   ├── user.py        # User model
│   └── note.py        # Note model
├── routes/            # API routes
│   ├── __init__.py
│   └── api.py         # Main API endpoints
├── utils/             # Utility functions
│   ├── __init__.py
│   ├── auth.py        # Authentication helpers
│   └── validation.py  # Input validation schemas
└── tests/             # Test suite
    ├── __init__.py
    ├── conftest.py    # Test configuration
    ├── test_auth.py   # Authentication tests
    ├── test_notes.py  # Notes API tests
    └── test_models.py # Model tests
```

## 👨‍💻 Author

**[Asit Kumar](https://github.com/Asit-14)**

- Complete Flask backend architecture and implementation
- REST API design and development
- Authentication system with JWT
- Database models and relationships
- Comprehensive testing suite
- Documentation and setup guides

## 🤝 Contributing

This backend was developed as part of the NotesVault open-source project. For contribution guidelines, please refer to the main project's [CONTRIBUTING.md](../CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the main project's [LICENSE](../LICENSE) file for details.

---

_Part of the [NotesVault](https://github.com/Asit-14/notesvault) project - An open-source platform for students to share and access study notes._
