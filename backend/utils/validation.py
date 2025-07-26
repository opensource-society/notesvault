"""
Validation utilities for NotesVault Backend
Input validation schemas using Marshmallow
"""

from marshmallow import Schema, fields, validate, ValidationError, post_load
import re

class UserRegistrationSchema(Schema):
    """Schema for user registration validation"""
    username = fields.Str(
        required=True,
        validate=[
            validate.Length(min=3, max=80),
            validate.Regexp(r'^[a-zA-Z0-9_]+$', error="Username can only contain letters, numbers, and underscores")
        ]
    )
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=255))
    first_name = fields.Str(validate=validate.Length(max=50), allow_none=True)
    last_name = fields.Str(validate=validate.Length(max=50), allow_none=True)

    @post_load
    def validate_password_strength(self, data, **kwargs):
        """Custom password strength validation"""
        password = data.get('password')
        if password:
            errors = []

            if not re.search(r'[A-Z]', password):
                errors.append("Password must contain at least one uppercase letter")

            if not re.search(r'[a-z]', password):
                errors.append("Password must contain at least one lowercase letter")

            if not re.search(r'\d', password):
                errors.append("Password must contain at least one number")

            if errors:
                raise ValidationError({'password': errors})

        return data

class UserLoginSchema(Schema):
    """Schema for user login validation"""
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    """Schema for user profile update validation"""
    first_name = fields.Str(validate=validate.Length(max=50), allow_none=True)
    last_name = fields.Str(validate=validate.Length(max=50), allow_none=True)
    email = fields.Email(validate=validate.Length(max=120), allow_none=True)

class NoteCreateSchema(Schema):
    """Schema for note creation validation"""
    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=200)
    )
    content = fields.Str(required=True, validate=validate.Length(min=1))
    subject = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=100)
    )
    tags = fields.List(
        fields.Str(validate=validate.Length(max=50)),
        allow_none=True,
        validate=validate.Length(max=20)  # Maximum 20 tags
    )
    is_public = fields.Bool(missing=True)

class NoteUpdateSchema(Schema):
    """Schema for note update validation"""
    title = fields.Str(validate=validate.Length(min=1, max=200), allow_none=True)
    content = fields.Str(validate=validate.Length(min=1), allow_none=True)
    subject = fields.Str(validate=validate.Length(min=1, max=100), allow_none=True)
    tags = fields.List(
        fields.Str(validate=validate.Length(max=50)),
        allow_none=True,
        validate=validate.Length(max=20)
    )
    is_public = fields.Bool(allow_none=True)

class NoteSearchSchema(Schema):
    """Schema for note search validation"""
    q = fields.Str(validate=validate.Length(max=200), allow_none=True)
    subject = fields.Str(validate=validate.Length(max=100), allow_none=True)
    limit = fields.Int(validate=validate.Range(min=1, max=100), missing=20)
    offset = fields.Int(validate=validate.Range(min=0), missing=0)
    sort = fields.Str(
        validate=validate.OneOf(['created_at', 'updated_at', 'views', 'likes', 'title']),
        missing='created_at'
    )
    order = fields.Str(
        validate=validate.OneOf(['asc', 'desc']),
        missing='desc'
    )

class TokenRefreshSchema(Schema):
    """Schema for token refresh validation"""
    refresh_token = fields.Str(required=True)

def validate_json_input(schema_class):
    """Decorator for validating JSON input using Marshmallow schemas"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request, jsonify

            try:
                # Get JSON data from request
                json_data = request.get_json()

                if json_data is None:
                    return jsonify({
                        'error': 'Invalid input',
                        'message': 'Request must contain valid JSON'
                    }), 400

                # Validate using schema
                schema = schema_class()
                validated_data = schema.load(json_data)

                # Add validated data to kwargs
                kwargs['validated_data'] = validated_data

                return f(*args, **kwargs)

            except ValidationError as e:
                return jsonify({
                    'error': 'Validation failed',
                    'message': 'Please check your input data',
                    'details': e.messages
                }), 400

            except Exception as e:
                return jsonify({
                    'error': 'Invalid input',
                    'message': 'Failed to parse request data'
                }), 400

        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def validate_query_params(schema_class):
    """Decorator for validating query parameters"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request, jsonify

            try:
                # Get query parameters
                query_data = request.args.to_dict()

                # Convert numeric strings to integers
                for key, value in query_data.items():
                    if key in ['limit', 'offset'] and value.isdigit():
                        query_data[key] = int(value)
                    elif key == 'is_public' and value.lower() in ['true', 'false']:
                        query_data[key] = value.lower() == 'true'

                # Validate using schema
                schema = schema_class()
                validated_data = schema.load(query_data)

                # Add validated data to kwargs
                kwargs['query_params'] = validated_data

                return f(*args, **kwargs)

            except ValidationError as e:
                return jsonify({
                    'error': 'Invalid query parameters',
                    'message': 'Please check your query parameters',
                    'details': e.messages
                }), 400

        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

def sanitize_html(text):
    """Basic HTML sanitization for text content"""
    if not text:
        return text

    # Remove basic HTML tags (this is a simple implementation)
    # In production, consider using a library like bleach
    import re
    clean_text = re.sub(r'<[^>]+>', '', text)
    return clean_text.strip()

def validate_file_upload(file, allowed_extensions={'txt', 'md', 'pdf'}, max_size_mb=10):
    """Validate file upload"""
    errors = []

    if not file:
        errors.append("No file provided")
        return errors

    if file.filename == '':
        errors.append("No file selected")
        return errors

    # Check file extension
    if '.' in file.filename:
        extension = file.filename.rsplit('.', 1)[1].lower()
        if extension not in allowed_extensions:
            errors.append(f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")
    else:
        errors.append("File must have an extension")

    # Check file size (this is a basic check, actual file size should be checked after reading)
    if hasattr(file, 'content_length') and file.content_length:
        if file.content_length > max_size_mb * 1024 * 1024:
            errors.append(f"File size too large. Maximum size: {max_size_mb}MB")

    return errors
