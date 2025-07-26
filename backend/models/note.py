"""
Note Model for NotesVault Backend
Handles note creation, storage, and management
"""

from app import db
from datetime import datetime
from sqlalchemy.orm import relationship

class Note(db.Model):
    """Note model for storing and managing student notes"""

    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    subject = db.Column(db.String(100), nullable=False, index=True)
    tags = db.Column(db.String(500), nullable=True)  # Comma-separated tags
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    views_count = db.Column(db.Integer, default=0, nullable=False)
    likes_count = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Foreign Key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)

    # Relationships
    user = relationship('User', back_populates='notes')

    def __init__(self, title, content, subject, user_id, tags=None, is_public=True):
        self.title = title
        self.content = content
        self.subject = subject
        self.user_id = user_id
        self.tags = tags
        self.is_public = is_public

    def __repr__(self):
        return f'<Note {self.title}>'

    def to_dict(self, include_content=True):
        """Convert note object to dictionary"""
        note_dict = {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'tags': self.get_tags_list(),
            'is_public': self.is_public,
            'is_featured': self.is_featured,
            'views_count': self.views_count,
            'likes_count': self.likes_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user_id': self.user_id,
            'author': self.user.username if self.user else None
        }

        if include_content:
            note_dict['content'] = self.content

        return note_dict

    def get_tags_list(self):
        """Get tags as a list instead of comma-separated string"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []

    def set_tags_from_list(self, tags_list):
        """Set tags from a list"""
        if tags_list:
            self.tags = ','.join([tag.strip() for tag in tags_list if tag.strip()])
        else:
            self.tags = None

    def increment_views(self):
        """Increment view count"""
        self.views_count += 1
        db.session.commit()

    def increment_likes(self):
        """Increment like count"""
        self.likes_count += 1
        db.session.commit()

    def decrement_likes(self):
        """Decrement like count (minimum 0)"""
        if self.likes_count > 0:
            self.likes_count -= 1
            db.session.commit()

    @classmethod
    def get_public_notes(cls, limit=None, subject=None, search_term=None):
        """Get public notes with optional filtering"""
        query = cls.query.filter_by(is_public=True)

        if subject:
            query = query.filter_by(subject=subject)

        if search_term:
            search_pattern = f'%{search_term}%'
            query = query.filter(
                db.or_(
                    cls.title.ilike(search_pattern),
                    cls.content.ilike(search_pattern),
                    cls.tags.ilike(search_pattern)
                )
            )

        query = query.order_by(cls.created_at.desc())

        if limit:
            query = query.limit(limit)

        return query.all()

    @classmethod
    def get_featured_notes(cls, limit=10):
        """Get featured notes"""
        return cls.query.filter_by(is_public=True, is_featured=True)\
                       .order_by(cls.views_count.desc())\
                       .limit(limit).all()

    @classmethod
    def get_popular_notes(cls, limit=10):
        """Get popular notes by views and likes"""
        return cls.query.filter_by(is_public=True)\
                       .order_by((cls.views_count + cls.likes_count).desc())\
                       .limit(limit).all()

    @classmethod
    def find_by_id(cls, note_id):
        """Find note by ID"""
        return cls.query.get(note_id)

    @classmethod
    def get_subjects(cls):
        """Get all unique subjects"""
        subjects = db.session.query(cls.subject.distinct()).all()
        return [subject[0] for subject in subjects]

    def save(self):
        """Save note to database"""
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self):
        """Delete note from database"""
        db.session.delete(self)
        db.session.commit()

    def update(self, **kwargs):
        """Update note attributes"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

        self.updated_at = datetime.utcnow()
        db.session.commit()
        return self
