"""
Authentication utilities for NotesVault Backend
Handles password hashing, JWT tokens, and auth decorators
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models.user import User

def hash_password(password):
    """Hash a password using bcrypt"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    """Verify a password against its hash"""
    password_bytes = password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def generate_jwt_token(user_id, expires_delta=None):
    """Generate JWT token for user authentication"""
    if expires_delta is None:
        expires_delta = timedelta(hours=24)

    expire = datetime.utcnow() + expires_delta

    payload = {
        'user_id': user_id,
        'exp': expire,
        'iat': datetime.utcnow()
    }

    token = jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

    return token

def decode_jwt_token(token):
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def get_current_user():
    """Get current user from JWT token in request headers"""
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return None

    try:
        # Expected format: "Bearer <token>"
        token = auth_header.split(' ')[1]
        payload = decode_jwt_token(token)

        if 'error' in payload:
            return None

        user = User.find_by_id(payload['user_id'])
        return user

    except (IndexError, KeyError):
        return None

def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()

        if not user:
            return jsonify({
                'error': 'Authentication required',
                'message': 'Please provide a valid authentication token'
            }), 401

        # Add current user to kwargs
        kwargs['current_user'] = user
        return f(*args, **kwargs)

    return decorated_function

def optional_auth(f):
    """Decorator for optional authentication (user can be None)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        kwargs['current_user'] = user
        return f(*args, **kwargs)

    return decorated_function

def validate_password_strength(password):
    """Validate password strength"""
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if not any(c.isupper() for c in password):
        errors.append("Password must contain at least one uppercase letter")

    if not any(c.islower() for c in password):
        errors.append("Password must contain at least one lowercase letter")

    if not any(c.isdigit() for c in password):
        errors.append("Password must contain at least one number")

    return errors

def generate_refresh_token(user_id):
    """Generate a refresh token with longer expiration"""
    expires_delta = timedelta(days=30)
    return generate_jwt_token(user_id, expires_delta)

def create_auth_response(user, include_refresh=True):
    """Create standardized authentication response"""
    access_token = generate_jwt_token(user.id)

    response_data = {
        'user': user.to_dict(),
        'access_token': access_token,
        'token_type': 'Bearer',
        'expires_in': 86400  # 24 hours in seconds
    }

    if include_refresh:
        refresh_token = generate_refresh_token(user.id)
        response_data['refresh_token'] = refresh_token

    return response_data
