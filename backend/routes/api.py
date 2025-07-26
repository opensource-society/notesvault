"""
API Routes for NotesVault Backend
RESTful endpoints for authentication and note management
"""

from flask import Blueprint, request, jsonify
from models.user import User
from models.note import Note
from utils.auth import (
    hash_password, verify_password, require_auth,
    optional_auth, create_auth_response, decode_jwt_token
)
from utils.validation import (
    validate_json_input, validate_query_params,
    UserRegistrationSchema, UserLoginSchema, UserUpdateSchema,
    NoteCreateSchema, NoteUpdateSchema, NoteSearchSchema,
    TokenRefreshSchema
)
from app import db

# Create blueprint
api_bp = Blueprint('api', __name__)

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@api_bp.route('/auth/register', methods=['POST'])
@validate_json_input(UserRegistrationSchema)
def register(validated_data):
    """User registration endpoint"""
    try:
        # Check if username already exists
        if User.find_by_username(validated_data['username']):
            return jsonify({
                'error': 'Username already exists',
                'message': 'Please choose a different username'
            }), 409

        # Check if email already exists
        if User.find_by_email(validated_data['email']):
            return jsonify({
                'error': 'Email already exists',
                'message': 'Please use a different email address'
            }), 409

        # Hash password
        password_hash = hash_password(validated_data['password'])

        # Create new user
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password_hash=password_hash,
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name')
        )
        user.save()

        # Create authentication response
        auth_response = create_auth_response(user)

        return jsonify({
            'message': 'User registered successfully',
            'data': auth_response
        }), 201

    except Exception as e:
        return jsonify({
            'error': 'Registration failed',
            'message': 'An error occurred during registration'
        }), 500

@api_bp.route('/auth/login', methods=['POST'])
@validate_json_input(UserLoginSchema)
def login(validated_data):
    """User login endpoint"""
    try:
        # Find user by username
        user = User.find_by_username(validated_data['username'])

        if not user:
            return jsonify({
                'error': 'Invalid credentials',
                'message': 'Username or password is incorrect'
            }), 401

        # Verify password
        if not verify_password(validated_data['password'], user.password_hash):
            return jsonify({
                'error': 'Invalid credentials',
                'message': 'Username or password is incorrect'
            }), 401

        # Check if user is active
        if not user.is_active:
            return jsonify({
                'error': 'Account disabled',
                'message': 'Your account has been disabled'
            }), 403

        # Create authentication response
        auth_response = create_auth_response(user)

        return jsonify({
            'message': 'Login successful',
            'data': auth_response
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Login failed',
            'message': 'An error occurred during login'
        }), 500

@api_bp.route('/auth/refresh', methods=['POST'])
@validate_json_input(TokenRefreshSchema)
def refresh_token(validated_data):
    """Token refresh endpoint"""
    try:
        # Decode refresh token
        payload = decode_jwt_token(validated_data['refresh_token'])

        if 'error' in payload:
            return jsonify({
                'error': 'Invalid refresh token',
                'message': payload['error']
            }), 401

        # Find user
        user = User.find_by_id(payload['user_id'])
        if not user or not user.is_active:
            return jsonify({
                'error': 'Invalid user',
                'message': 'User not found or inactive'
            }), 401

        # Create new authentication response
        auth_response = create_auth_response(user, include_refresh=False)

        return jsonify({
            'message': 'Token refreshed successfully',
            'data': auth_response
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Token refresh failed',
            'message': 'An error occurred while refreshing token'
        }), 500

@api_bp.route('/auth/me', methods=['GET'])
@require_auth
def get_current_user_profile(current_user):
    """Get current user profile"""
    return jsonify({
        'message': 'User profile retrieved successfully',
        'data': current_user.to_dict()
    }), 200

@api_bp.route('/auth/me', methods=['PUT'])
@require_auth
@validate_json_input(UserUpdateSchema)
def update_current_user_profile(current_user, validated_data):
    """Update current user profile"""
    try:
        # Check if email is being changed and if it's already taken
        if 'email' in validated_data and validated_data['email'] != current_user.email:
            existing_user = User.find_by_email(validated_data['email'])
            if existing_user:
                return jsonify({
                    'error': 'Email already exists',
                    'message': 'Please use a different email address'
                }), 409

        # Update user
        current_user.update(**validated_data)

        return jsonify({
            'message': 'Profile updated successfully',
            'data': current_user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Profile update failed',
            'message': 'An error occurred while updating profile'
        }), 500

# ============================================================================
# NOTE ROUTES
# ============================================================================

@api_bp.route('/notes', methods=['GET'])
@optional_auth
@validate_query_params(NoteSearchSchema)
def get_notes(current_user, query_params):
    """Get notes with filtering and search"""
    try:
        # If user is authenticated, they can see their private notes too
        if current_user:
            notes = Note.query.filter(
                db.or_(
                    Note.is_public == True,
                    Note.user_id == current_user.id
                )
            )
        else:
            notes = Note.query.filter_by(is_public=True)

        # Apply filters
        if query_params.get('subject'):
            notes = notes.filter_by(subject=query_params['subject'])

        if query_params.get('q'):
            search_term = f"%{query_params['q']}%"
            notes = notes.filter(
                db.or_(
                    Note.title.ilike(search_term),
                    Note.content.ilike(search_term),
                    Note.tags.ilike(search_term)
                )
            )

        # Apply sorting
        sort_field = query_params.get('sort', 'created_at')
        order = query_params.get('order', 'desc')

        if hasattr(Note, sort_field):
            sort_column = getattr(Note, sort_field)
            if order == 'asc':
                notes = notes.order_by(sort_column.asc())
            else:
                notes = notes.order_by(sort_column.desc())

        # Apply pagination
        offset = query_params.get('offset', 0)
        limit = query_params.get('limit', 20)

        total_count = notes.count()
        notes = notes.offset(offset).limit(limit).all()

        # Convert to dict
        notes_data = [note.to_dict(include_content=False) for note in notes]

        return jsonify({
            'message': 'Notes retrieved successfully',
            'data': {
                'notes': notes_data,
                'pagination': {
                    'total': total_count,
                    'offset': offset,
                    'limit': limit,
                    'has_more': offset + limit < total_count
                }
            }
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve notes',
            'message': 'An error occurred while fetching notes'
        }), 500

@api_bp.route('/notes', methods=['POST'])
@require_auth
@validate_json_input(NoteCreateSchema)
def create_note(current_user, validated_data):
    """Create a new note"""
    try:
        # Create note
        note = Note(
            title=validated_data['title'],
            content=validated_data['content'],
            subject=validated_data['subject'],
            user_id=current_user.id,
            is_public=validated_data.get('is_public', True)
        )

        # Set tags if provided
        if validated_data.get('tags'):
            note.set_tags_from_list(validated_data['tags'])

        note.save()

        return jsonify({
            'message': 'Note created successfully',
            'data': note.to_dict()
        }), 201

    except Exception as e:
        return jsonify({
            'error': 'Failed to create note',
            'message': 'An error occurred while creating the note'
        }), 500

@api_bp.route('/notes/<int:note_id>', methods=['GET'])
@optional_auth
def get_note(note_id, current_user):
    """Get a specific note by ID"""
    try:
        note = Note.find_by_id(note_id)

        if not note:
            return jsonify({
                'error': 'Note not found',
                'message': 'The requested note does not exist'
            }), 404

        # Check if user can access this note
        if not note.is_public and (not current_user or note.user_id != current_user.id):
            return jsonify({
                'error': 'Access denied',
                'message': 'You do not have permission to view this note'
            }), 403

        # Increment view count
        note.increment_views()

        return jsonify({
            'message': 'Note retrieved successfully',
            'data': note.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve note',
            'message': 'An error occurred while fetching the note'
        }), 500

@api_bp.route('/notes/<int:note_id>', methods=['PUT'])
@require_auth
@validate_json_input(NoteUpdateSchema)
def update_note(note_id, current_user, validated_data):
    """Update a specific note"""
    try:
        note = Note.find_by_id(note_id)

        if not note:
            return jsonify({
                'error': 'Note not found',
                'message': 'The requested note does not exist'
            }), 404

        # Check if user owns this note
        if note.user_id != current_user.id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You can only edit your own notes'
            }), 403

        # Update tags if provided
        if 'tags' in validated_data:
            tags_data = validated_data['tags']
            note.set_tags_from_list(tags_data)
            # Remove tags from validated_data to avoid duplicate processing
            validated_data = {k: v for k, v in validated_data.items() if k != 'tags'}

        # Update other fields
        note.update(**validated_data)

        return jsonify({
            'message': 'Note updated successfully',
            'data': note.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to update note',
            'message': 'An error occurred while updating the note'
        }), 500

@api_bp.route('/notes/<int:note_id>', methods=['DELETE'])
@require_auth
def delete_note(note_id, current_user):
    """Delete a specific note"""
    try:
        note = Note.find_by_id(note_id)

        if not note:
            return jsonify({
                'error': 'Note not found',
                'message': 'The requested note does not exist'
            }), 404

        # Check if user owns this note
        if note.user_id != current_user.id:
            return jsonify({
                'error': 'Access denied',
                'message': 'You can only delete your own notes'
            }), 403

        note.delete()

        return jsonify({
            'message': 'Note deleted successfully'
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to delete note',
            'message': 'An error occurred while deleting the note'
        }), 500

# ============================================================================
# UTILITY ROUTES
# ============================================================================

@api_bp.route('/subjects', methods=['GET'])
def get_subjects():
    """Get all available subjects"""
    try:
        subjects = Note.get_subjects()
        return jsonify({
            'message': 'Subjects retrieved successfully',
            'data': subjects
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve subjects',
            'message': 'An error occurred while fetching subjects'
        }), 500

@api_bp.route('/notes/featured', methods=['GET'])
def get_featured_notes():
    """Get featured notes"""
    try:
        limit = request.args.get('limit', 10, type=int)
        notes = Note.get_featured_notes(limit=limit)
        notes_data = [note.to_dict(include_content=False) for note in notes]

        return jsonify({
            'message': 'Featured notes retrieved successfully',
            'data': notes_data
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve featured notes',
            'message': 'An error occurred while fetching featured notes'
        }), 500

@api_bp.route('/notes/popular', methods=['GET'])
def get_popular_notes():
    """Get popular notes"""
    try:
        limit = request.args.get('limit', 10, type=int)
        notes = Note.get_popular_notes(limit=limit)
        notes_data = [note.to_dict(include_content=False) for note in notes]

        return jsonify({
            'message': 'Popular notes retrieved successfully',
            'data': notes_data
        }), 200

    except Exception as e:
        return jsonify({
            'error': 'Failed to retrieve popular notes',
            'message': 'An error occurred while fetching popular notes'
        }), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not Found',
        'message': 'The requested resource was not found'
    }), 404

@api_bp.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors"""
    return jsonify({
        'error': 'Method Not Allowed',
        'message': 'The method is not allowed for the requested URL'
    }), 405

@api_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred'
    }), 500
