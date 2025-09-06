from flask import Blueprint, jsonify, request, send_file, send_from_directory
import json
import uuid
import os
from datetime import datetime, timedelta
import hashlib

main = Blueprint("main", __name__)

# File paths for data storage
NOTES_FILE = os.path.join(os.path.dirname(__file__), '../../data/notes.json')
SHARED_LINKS_FILE = os.path.join(os.path.dirname(__file__), '../../data/shared_links.json')
PAGES_DIR = os.path.join(os.path.dirname(__file__), '../../pages')

def load_notes():
    """Load notes from JSON file"""
    try:
        with open(NOTES_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_shared_links():
    """Load shared links from JSON file"""
    try:
        with open(SHARED_LINKS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_shared_links(shared_links):
    """Save shared links to JSON file"""
    os.makedirs(os.path.dirname(SHARED_LINKS_FILE), exist_ok=True)
    with open(SHARED_LINKS_FILE, 'w') as f:
        json.dump(shared_links, f, indent=2)

@main.route("/")
def home():
    return jsonify({"message": "Flask backend is running!"})

@main.route("/shared/<share_id>")
def serve_shared_page(share_id):
    """Serve the shared note page"""
    return send_from_directory(PAGES_DIR, 'shared.html')

@main.route("/api/notes", methods=["GET"])
def get_notes():
    """Get all notes"""
    notes = load_notes()
    return jsonify(notes)

@main.route("/api/notes/<note_id>", methods=["GET"])
def get_note(note_id):
    """Get a specific note by ID"""
    notes = load_notes()
    note = next((n for n in notes if n['_id'] == note_id), None)
    if not note:
        return jsonify({"error": "Note not found"}), 404
    return jsonify(note)

@main.route("/api/share/<note_id>", methods=["POST"])
def create_share_link(note_id):
    """Create a shareable link for a note"""
    notes = load_notes()
    note = next((n for n in notes if n['_id'] == note_id), None)
    
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    # Get options from request
    data = request.get_json() or {}
    password = data.get('password')
    expires_hours = data.get('expires_hours', 24)  # Default 24 hours
    view_only = data.get('view_only', True)  # Default view-only
    
    # Generate unique share ID
    share_id = str(uuid.uuid4())
    
    # Calculate expiration date
    expires_at = None
    if expires_hours and expires_hours > 0:
        expires_at = (datetime.now() + timedelta(hours=expires_hours)).isoformat()
    
    # Create shared link entry
    shared_links = load_shared_links()
    shared_links[share_id] = {
        "note_id": note_id,
        "created_at": datetime.now().isoformat(),
        "expires_at": expires_at,
        "password": hashlib.sha256(password.encode()).hexdigest() if password else None,
        "view_only": view_only,
        "access_count": 0
    }
    
    save_shared_links(shared_links)
    
    return jsonify({
        "share_id": share_id,
        "share_url": f"/shared/{share_id}",
        "expires_at": expires_at,
        "view_only": view_only,
        "password_protected": bool(password)
    })

@main.route("/api/shared/<share_id>", methods=["GET"])
def get_shared_note(share_id):
    """Access a shared note"""
    shared_links = load_shared_links()
    
    if share_id not in shared_links:
        return jsonify({"error": "Shared link not found"}), 404
    
    link_data = shared_links[share_id]
    
    # Check if link has expired
    if link_data.get('expires_at'):
        expires_at = datetime.fromisoformat(link_data['expires_at'])
        if datetime.now() > expires_at:
            return jsonify({"error": "Shared link has expired"}), 410
    
    # Check password if required
    password = request.args.get('password')
    if link_data.get('password'):
        if not password:
            return jsonify({"error": "Password required", "password_required": True}), 401
        if hashlib.sha256(password.encode()).hexdigest() != link_data['password']:
            return jsonify({"error": "Invalid password"}), 401
    
    # Get the actual note
    notes = load_notes()
    note = next((n for n in notes if n['_id'] == link_data['note_id']), None)
    
    if not note:
        return jsonify({"error": "Original note not found"}), 404
    
    # Increment access count
    link_data['access_count'] += 1
    shared_links[share_id] = link_data
    save_shared_links(shared_links)
    
    # Return note with sharing metadata
    return jsonify({
        "note": note,
        "share_metadata": {
            "view_only": link_data['view_only'],
            "created_at": link_data['created_at'],
            "expires_at": link_data.get('expires_at'),
            "access_count": link_data['access_count']
        }
    })

@main.route("/api/shared/<share_id>/download", methods=["GET"])
def download_shared_note(share_id):
    """Download a shared note"""
    shared_links = load_shared_links()
    
    if share_id not in shared_links:
        return jsonify({"error": "Shared link not found"}), 404
    
    link_data = shared_links[share_id]
    
    # Check if link has expired
    if link_data.get('expires_at'):
        expires_at = datetime.fromisoformat(link_data['expires_at'])
        if datetime.now() > expires_at:
            return jsonify({"error": "Shared link has expired"}), 410
    
    # Check password if required
    password = request.args.get('password')
    if link_data.get('password'):
        if not password:
            return jsonify({"error": "Password required"}), 401
        if hashlib.sha256(password.encode()).hexdigest() != link_data['password']:
            return jsonify({"error": "Invalid password"}), 401
    
    # Get the actual note
    notes = load_notes()
    note = next((n for n in notes if n['_id'] == link_data['note_id']), None)
    
    if not note:
        return jsonify({"error": "Original note not found"}), 404
    
    # Get download format from query parameter
    download_format = request.args.get('format', 'json').lower()
    
    # Increment access count
    link_data['access_count'] += 1
    shared_links[share_id] = link_data
    save_shared_links(shared_links)
    
    # Generate content based on format
    if download_format == 'txt':
        content = generate_text_content(note)
        mimetype = 'text/plain'
        filename = f"{note['title'].replace(' ', '_')}.txt"
    elif download_format == 'md':
        content = generate_markdown_content(note)
        mimetype = 'text/markdown'
        filename = f"{note['title'].replace(' ', '_')}.md"
    else:  # Default to JSON
        content = json.dumps(note, indent=2)
        mimetype = 'application/json'
        filename = f"{note['title'].replace(' ', '_')}.json"
    
    # Create response with file download
    from io import BytesIO
    from flask import Response
    
    def generate():
        yield content.encode('utf-8')
    
    return Response(
        generate(),
        mimetype=mimetype,
        headers={
            'Content-Disposition': f'attachment; filename="{filename}"',
            'Content-Type': f'{mimetype}; charset=utf-8'
        }
    )

def generate_text_content(note):
    """Generate plain text content for note"""
    content = f"""
{note['title']}
{'=' * len(note['title'])}

Branch: {note['branch']}
Semester: {note['semester']}
Uploaded by: {note['uploader']}
Upload Date: {note['uploadDate']}

Description:
{note.get('description', 'No description available')}

Original File: {note.get('filePath', 'N/A')}

---
Downloaded from NotesVault - Shared Note
"""
    return content.strip()

def generate_markdown_content(note):
    """Generate markdown content for note"""
    content = f"""# {note['title']}

## Note Information
- **Branch:** {note['branch']}
- **Semester:** {note['semester']}
- **Uploaded by:** {note['uploader']}
- **Upload Date:** {note['uploadDate']}

## Description
{note.get('description', 'No description available')}

## File Information
- **Original File:** {note.get('filePath', 'N/A')}

---
*Downloaded from NotesVault - Shared Note*
"""
    return content.strip() 