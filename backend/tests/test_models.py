"""
Test cases for database models
"""

import pytest
from datetime import datetime
from models.user import User
from models.note import Note
from utils.auth import hash_password

class TestUserModel:
    """Test cases for User model"""

    def test_user_creation(self, db_session):
        """Test user creation"""
        password_hash = hash_password('testpassword123')
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash,
            first_name='Test',
            last_name='User'
        )

        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.first_name == 'Test'
        assert user.last_name == 'User'
        assert user.is_active == True

    def test_user_to_dict(self, db_session):
        """Test user to_dict method"""
        password_hash = hash_password('testpassword123')
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash
        )
        user.save()

        user_dict = user.to_dict()

        assert 'id' in user_dict
        assert user_dict['username'] == 'testuser'
        assert user_dict['email'] == 'test@example.com'
        assert 'password_hash' not in user_dict  # Should not include sensitive data
        assert user_dict['notes_count'] == 0

    def test_find_by_username(self, db_session):
        """Test finding user by username"""
        password_hash = hash_password('testpassword123')
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash
        )
        user.save()

        found_user = User.find_by_username('testuser')
        assert found_user is not None
        assert found_user.username == 'testuser'

        not_found = User.find_by_username('nonexistent')
        assert not_found is None

    def test_find_by_email(self, db_session):
        """Test finding user by email"""
        password_hash = hash_password('testpassword123')
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash=password_hash
        )
        user.save()

        found_user = User.find_by_email('test@example.com')
        assert found_user is not None
        assert found_user.email == 'test@example.com'

class TestNoteModel:
    """Test cases for Note model"""

    def test_note_creation(self, db_session, sample_user):
        """Test note creation"""
        note = Note(
            title='Test Note',
            content='This is a test note content',
            subject='Computer Science',
            user_id=sample_user.id,
            tags='python,testing'
        )

        assert note.title == 'Test Note'
        assert note.content == 'This is a test note content'
        assert note.subject == 'Computer Science'
        assert note.user_id == sample_user.id
        assert note.is_public == True
        assert note.views_count == 0
        assert note.likes_count == 0

    def test_note_to_dict(self, db_session, sample_user):
        """Test note to_dict method"""
        note = Note(
            title='Test Note',
            content='Test content',
            subject='Computer Science',
            user_id=sample_user.id,
            tags='python,testing'
        )
        note.save()

        note_dict = note.to_dict()

        assert 'id' in note_dict
        assert note_dict['title'] == 'Test Note'
        assert note_dict['content'] == 'Test content'
        assert note_dict['subject'] == 'Computer Science'
        assert note_dict['tags'] == ['python', 'testing']
        assert note_dict['author'] == sample_user.username

    def test_get_tags_list(self, db_session, sample_user):
        """Test getting tags as list"""
        note = Note(
            title='Test Note',
            content='Test content',
            subject='Computer Science',
            user_id=sample_user.id,
            tags='python, testing, flask'
        )

        tags = note.get_tags_list()
        assert tags == ['python', 'testing', 'flask']

    def test_set_tags_from_list(self, db_session, sample_user):
        """Test setting tags from list"""
        note = Note(
            title='Test Note',
            content='Test content',
            subject='Computer Science',
            user_id=sample_user.id
        )

        note.set_tags_from_list(['python', 'testing', 'flask'])
        assert note.tags == 'python,testing,flask'

    def test_increment_views(self, db_session, sample_user):
        """Test incrementing view count"""
        note = Note(
            title='Test Note',
            content='Test content',
            subject='Computer Science',
            user_id=sample_user.id
        )
        note.save()

        initial_views = note.views_count
        note.increment_views()

        assert note.views_count == initial_views + 1

    def test_get_public_notes(self, db_session, sample_user):
        """Test getting public notes"""
        # Create public note
        public_note = Note(
            title='Public Note',
            content='Public content',
            subject='Computer Science',
            user_id=sample_user.id,
            is_public=True
        )
        public_note.save()

        # Create private note
        private_note = Note(
            title='Private Note',
            content='Private content',
            subject='Computer Science',
            user_id=sample_user.id,
            is_public=False
        )
        private_note.save()

        public_notes = Note.get_public_notes()

        assert len(public_notes) >= 1
        assert public_note in public_notes
        assert private_note not in public_notes
