from flask import Blueprint, jsonify, request, session, current_app
import os
import json
from werkzeug.security import check_password_hash, generate_password_hash
from flask import send_from_directory, abort

main = Blueprint("main", __name__)


def users_file_path():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    return os.path.join(root, 'users.json')


def load_users():
    path = users_file_path()
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def save_users(users):
    path = users_file_path()
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2)


@main.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})


@main.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password_hash = data.get('password') or data.get('passwordHash')
    name = data.get('name') or data.get('fullName') or 'User'

    if not email or not password_hash:
        return jsonify({'error': 'email and password are required'}), 400

    users = load_users()
    if email in users:
        return jsonify({'error': 'email already registered'}), 400

    # store server-side password hash (we expect client sends SHA-256 hash)
    stored_hash = generate_password_hash(password_hash)
    users[email] = {
        'email': email,
        'password': stored_hash,
        'name': name,
    }
    save_users(users)

    return jsonify({'message': 'registered', 'user': {'email': email, 'name': name}}), 201


@main.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password_hash = data.get('password') or data.get('passwordHash')

    if not email or not password_hash:
        return jsonify({'error': 'email and password required'}), 400

    users = load_users()
    user = users.get(email)
    if not user:
        return jsonify({'error': 'invalid credentials'}), 401

    stored = user.get('password')
    valid = False
    try:
        if stored and stored.startswith('pbkdf2:'):
            valid = check_password_hash(stored, password_hash)
        else:
            # legacy stored client-hash
            valid = stored == password_hash
            # if valid, upgrade to server-side salted hash
            if valid:
                users[email]['password'] = generate_password_hash(password_hash)
                save_users(users)
    except Exception:
        valid = False

    if not valid:
        return jsonify({'error': 'invalid credentials'}), 401

    # mark session
    session['user'] = email

    return jsonify({'message': 'ok', 'user': {'email': user.get('email'), 'name': user.get('name')}})


@main.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'logged out'})


@main.route('/api/user', methods=['GET'])
def current_user():
    email = session.get('user')
    if not email:
        return jsonify({'user': None}), 200
    users = load_users()
    user = users.get(email)
    if not user:
        return jsonify({'user': None}), 200
    return jsonify({'user': {'email': user.get('email'), 'name': user.get('name')}})


# Serve frontend static files from the repository root so frontend and backend are same-origin.
# This catch-all will return files (pages, scripts, styling, assets, components) when available.
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def serve_frontend(path):
    # Leave API routes to other view functions
    if path.startswith('api'):
        return abort(404)

    # Server-side protection: block access to protected pages if user not authenticated.
    # Match by filename so variants like '/pages/dashboard.html' or '/dashboard.html' are caught.
    protected_filenames = {
        'dashboard.html', 'upload.html', 'notes.html', 'todolist.html',
        'profile.html', 'edit-profile.html', 'jotpad.html', 'todolist.html', 'study-tracker.html'
    }
    # Determine requested filename
    requested_basename = os.path.basename(path)
    if requested_basename in protected_filenames:
        if not session.get('user'):
            # redirect unauthenticated users to login page
            return send_from_directory(os.path.join(PROJECT_ROOT, 'pages'), 'login.html')

    # Serve root index
    if path == '' or path == '/':
        index_path = os.path.join(PROJECT_ROOT, 'pages', 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(os.path.join(PROJECT_ROOT, 'pages'), 'index.html')
        return jsonify({'message': 'Index not found'}), 404

    # Try to serve the exact path from project root
    requested = os.path.join(PROJECT_ROOT, path)
    if os.path.exists(requested) and os.path.isfile(requested):
        directory = os.path.dirname(requested)
        filename = os.path.basename(requested)
        return send_from_directory(directory, filename)

    # Try under pages/ (common for page routes like /dashboard.html)
    pages_candidate = os.path.join(PROJECT_ROOT, 'pages', path)
    if os.path.exists(pages_candidate) and os.path.isfile(pages_candidate):
        directory = os.path.dirname(pages_candidate)
        filename = os.path.basename(pages_candidate)
        return send_from_directory(directory, filename)

    # Fallback to pages/index.html for client-side routing
    return send_from_directory(os.path.join(PROJECT_ROOT, 'pages'), 'index.html')


@main.route('/api/user', methods=['PUT'])
def update_user():
    email = session.get('user')
    if not email:
        return jsonify({'error': 'unauthenticated'}), 401
    data = request.get_json() or {}
    users = load_users()
    user = users.get(email)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    # Allowed fields to update
    allowed = ['name', 'institution', 'branch', 'year', 'studentId']
    for k in allowed:
        if k in data:
            user[k] = data[k]

    users[email] = user
    save_users(users)

    return jsonify({'message': 'updated', 'user': {'email': user.get('email'), 'name': user.get('name')}})


@main.route('/api/change-password', methods=['POST'])
def change_password():
    email = session.get('user')
    if not email:
        return jsonify({'error': 'unauthenticated'}), 401
    data = request.get_json() or {}
    old_pw = data.get('oldPassword')
    new_pw = data.get('newPassword')
    if not old_pw or not new_pw:
        return jsonify({'error': 'old and new password required'}), 400

    users = load_users()
    user = users.get(email)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    stored = user.get('password')
    valid = False
    try:
        # If stored is werkzeug hash
        if stored and stored.startswith('pbkdf2:'):
            valid = check_password_hash(stored, old_pw)
        else:
            # legacy: compare client-side hash directly
            valid = stored == old_pw
    except Exception:
        valid = False

    if not valid:
        return jsonify({'error': 'current password incorrect'}), 401

    # store new password as server-side hash
    users[email]['password'] = generate_password_hash(new_pw)
    save_users(users)

    return jsonify({'message': 'password changed'})