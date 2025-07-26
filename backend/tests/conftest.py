"""
Test configuration and fixtures for NotesVault backend tests
"""

import pytest
import tempfile
import os
from app import create_app, db
from models.user import User
from models.note import Note
from utils.auth import hash_password

@pytest.fixture
def app():
    """Create application for testing"""
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp()

    app = create_app('testing')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def db_session(app):
    """Create database session for testing"""
    with app.app_context():
        yield db.session

@pytest.fixture
def sample_user(db_session):
    """Create a sample user for testing"""
    password_hash = hash_password('testpassword123')
    user = User(
        username='testuser',
        email='test@example.com',
        password_hash=password_hash,
        first_name='Test',
        last_name='User'
    )
    user.save()
    return user

@pytest.fixture
def sample_note(db_session, sample_user):
    """Create a sample note for testing"""
    note = Note(
        title='Sample Note',
        content='This is a sample note for testing',
        subject='Computer Science',
        user_id=sample_user.id,
        tags='python,testing'
    )
    note.save()
    return note

@pytest.fixture
def auth_headers(client, sample_user):
    """Get authentication headers for testing"""
    response = client.post('/api/v1/auth/login', json={
        'username': 'testuser',
        'password': 'testpassword123'
    })

    data = response.get_json()
    token = data['data']['access_token']

    return {'Authorization': f'Bearer {token}'}

@pytest.fixture
def multiple_notes(db_session, sample_user):
    """Create multiple notes for testing"""
    notes = []

    for i in range(5):
        note = Note(
            title=f'Test Note {i+1}',
            content=f'Content for test note {i+1}',
            subject='Computer Science' if i % 2 == 0 else 'Mathematics',
            user_id=sample_user.id,
            tags=f'tag{i+1},testing',
            is_public=i % 2 == 0  # Alternate between public and private
        )
        note.save()
        notes.append(note)

    return notes
