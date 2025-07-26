"""
User Model for NotesVault Backend
Handles user authentication and profile data
"""

from app import db
from datetime import datetime
from sqlalchemy.orm import relationship

class User(db.Model):
    """User model for authentication and profile management"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    notes = relationship('Note', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')

    def __init__(self, username, email, password_hash, first_name=None, last_name=None):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self, include_sensitive=False):
        """Convert user object to dictionary"""
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'notes_count': self.notes.count()
        }

        if include_sensitive:
            user_dict['password_hash'] = self.password_hash

        return user_dict

    def get_notes(self, limit=None, subject=None):
        """Get user's notes with optional filtering"""
        query = self.notes

        if subject:
            query = query.filter_by(subject=subject)

        if limit:
            query = query.limit(limit)

        return query.all()

    @classmethod
    def find_by_username(cls, username):
        """Find user by username"""
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_email(cls, email):
        """Find user by email"""
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, user_id):
        """Find user by ID"""
        return cls.query.get(user_id)

    def save(self):
        """Save user to database"""
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self):
        """Delete user from database"""
        db.session.delete(self)
        db.session.commit()

    def update(self, **kwargs):
        """Update user attributes"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self
