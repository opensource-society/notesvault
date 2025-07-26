"""
Test cases for API routes
"""

import pytest
import json
from models.user import User
from models.note import Note

class TestAuthRoutes:
    """Test cases for authentication routes"""
    
    def test_user_registration(self, client):
        """Test user registration endpoint"""
        response = client.post('/api/v1/auth/register', 
                             json={
                                 'username': 'newuser',
                                 'email': 'newuser@example.com',
                                 'password': 'TestPass123'
                             })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['message'] == 'User registered successfully'
        assert 'access_token' in data['data']
        assert data['data']['user']['username'] == 'newuser'
    
    def test_user_login(self, client, sample_user):
        """Test user login endpoint"""
        response = client.post('/api/v1/auth/login',
                             json={
                                 'username': 'testuser',
                                 'password': 'testpassword123'
                             })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == 'Login successful'
        assert 'access_token' in data['data']
    
    def test_get_current_user_profile(self, client, auth_headers):
        """Test getting current user profile"""
        response = client.get('/api/v1/auth/me', headers=auth_headers)
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['username'] == 'testuser'

class TestNoteRoutes:
    """Test cases for note routes"""
    
    def test_create_note(self, client, auth_headers):
        """Test note creation"""
        response = client.post('/api/v1/notes',
                             headers=auth_headers,
                             json={
                                 'title': 'Test Note',
                                 'content': 'Test content',
                                 'subject': 'Computer Science',
                                 'tags': ['python', 'testing']
                             })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['data']['title'] == 'Test Note'
    
    def test_get_notes(self, client, multiple_notes):
        """Test getting notes list"""
        response = client.get('/api/v1/notes')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'notes' in data['data']
        assert len(data['data']['notes']) > 0
    
    def test_get_specific_note(self, client, sample_note):
        """Test getting a specific note"""
        response = client.get(f'/api/v1/notes/{sample_note.id}')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['data']['title'] == sample_note.title

class TestUtilityRoutes:
    """Test cases for utility routes"""
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/v1/health')
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
        assert data['version'] == '1.0.0'
    
    def test_get_subjects(self, client, multiple_notes):
        """Test getting subjects"""
        response = client.get('/api/v1/subjects')
        
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data['data'], list)
