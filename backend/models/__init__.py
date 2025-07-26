"""
Models package for NotesVault Backend
Exports all database models for easy importing
"""

from .user import User
from .note import Note

__all__ = ['User', 'Note']