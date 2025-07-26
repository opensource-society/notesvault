"""
Test cases for utility functions
"""

import pytest
from utils.auth import hash_password, verify_password, generate_jwt_token, decode_jwt_token
from utils.validation import sanitize_html, validate_file_upload
from models.user import User

class TestAuthUtils:
    """Test cases for authentication utilities"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "testpassword123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert verify_password(password, hashed)
        assert not verify_password("wrongpassword", hashed)
    
    def test_jwt_token_generation(self, app):
        """Test JWT token generation and decoding"""
        with app.app_context():
            user_id = 1
            token = generate_jwt_token(user_id)
            
            assert token is not None
            assert isinstance(token, str)
            
            payload = decode_jwt_token(token)
            assert payload['user_id'] == user_id
            assert 'exp' in payload
            assert 'iat' in payload
    
    def test_invalid_jwt_token(self, app):
        """Test decoding invalid JWT token"""
        with app.app_context():
            payload = decode_jwt_token("invalid.token.here")
            assert 'error' in payload

class TestValidationUtils:
    """Test cases for validation utilities"""
    
    def test_html_sanitization(self):
        """Test HTML sanitization"""
        dirty_html = "<script>alert('xss')</script>Hello <b>World</b>"
        clean_text = sanitize_html(dirty_html)
        
        assert "<script>" not in clean_text
        assert "<b>" not in clean_text
        assert "Hello World" in clean_text
    
    def test_html_sanitization_none_input(self):
        """Test HTML sanitization with None input"""
        result = sanitize_html(None)
        assert result is None
    
    def test_file_upload_validation(self):
        """Test file upload validation"""
        # This is a mock test since we don't have actual file objects
        # In a real scenario, you'd create mock file objects
        
        class MockFile:
            def __init__(self, filename, content_length=None):
                self.filename = filename
                self.content_length = content_length
        
        # Test valid file
        valid_file = MockFile("document.txt", 1024)
        errors = validate_file_upload(valid_file)
        assert len(errors) == 0
        
        # Test invalid extension
        invalid_file = MockFile("document.exe", 1024)
        errors = validate_file_upload(invalid_file)
        assert len(errors) > 0
        assert "File type not allowed" in errors[0]
        
        # Test no file
        errors = validate_file_upload(None)
        assert len(errors) > 0
        assert "No file provided" in errors[0]

class TestUserModelUtils:
    """Test cases for User model utility methods"""
    
    def test_user_to_dict(self, sample_user):
        """Test user to_dict method"""
        user_dict = sample_user.to_dict()
        
        assert 'id' in user_dict
        assert user_dict['username'] == 'testuser'
        assert 'password_hash' not in user_dict  # Should not include sensitive data
        assert user_dict['notes_count'] >= 0
    
    def test_user_to_dict_with_sensitive_data(self, sample_user):
        """Test user to_dict with sensitive data"""
        user_dict = sample_user.to_dict(include_sensitive=True)
        
        assert 'password_hash' in user_dict
        assert user_dict['password_hash'] is not None
