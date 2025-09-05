from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
import uuid
from datetime import datetime, timedelta
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph

app = Flask(__name__)
CORS(app)

# Configuration for serverless deployment
app.config['JSON_SORT_KEYS'] = False

# Data file paths - using absolute paths for serverless
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTES_FILE = os.path.join(BASE_DIR, 'data', 'notes.json')
SHARED_LINKS_FILE = os.path.join(BASE_DIR, 'data', 'shared_links.json')

def load_json_file(file_path):
    """Load JSON file with error handling"""
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_json_file(file_path, data):
    """Save JSON file with error handling"""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving file {file_path}: {e}")
        return False

def find_note_by_id(note_id):
    """Find a note by its ID"""
    notes = load_json_file(NOTES_FILE)
    for note in notes:
        if str(note.get('id')) == str(note_id):
            return note
    return None

@app.route('/api/share-note', methods=['POST'])
def share_note():
    """Create a shareable link for a note"""
    try:
        data = request.get_json()
        note_id = data.get('noteId')
        permissions = data.get('permissions', 'view')  # view or edit
        password = data.get('password', '')
        expiry_days = data.get('expiryDays', 7)
        
        if not note_id:
            return jsonify({'error': 'Note ID is required'}), 400
        
        # Check if note exists
        note = find_note_by_id(note_id)
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        # Generate unique share ID
        share_id = str(uuid.uuid4())
        
        # Calculate expiry date
        expiry_date = datetime.now() + timedelta(days=expiry_days)
        
        # Load existing shared links
        shared_links = load_json_file(SHARED_LINKS_FILE)
        
        # Create share link data
        share_link = {
            'shareId': share_id,
            'noteId': note_id,
            'permissions': permissions,
            'password': password,
            'expiryDate': expiry_date.isoformat(),
            'createdAt': datetime.now().isoformat(),
            'views': 0
        }
        
        shared_links.append(share_link)
        
        # Save updated shared links
        if save_json_file(SHARED_LINKS_FILE, shared_links):
            share_url = f"/pages/shared.html?id={share_id}"
            return jsonify({
                'success': True,
                'shareUrl': share_url,
                'shareId': share_id
            })
        else:
            return jsonify({'error': 'Failed to create share link'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shared-note/<share_id>', methods=['GET'])
def get_shared_note(share_id):
    """Get a shared note by share ID"""
    try:
        # Load shared links
        shared_links = load_json_file(SHARED_LINKS_FILE)
        
        # Find the share link
        share_link = None
        for link in shared_links:
            if link.get('shareId') == share_id:
                share_link = link
                break
        
        if not share_link:
            return jsonify({'error': 'Share link not found'}), 404
        
        # Check if link has expired
        expiry_date = datetime.fromisoformat(share_link['expiryDate'])
        if datetime.now() > expiry_date:
            return jsonify({'error': 'Share link has expired'}), 410
        
        # Check password if required
        password = request.args.get('password', '')
        if share_link.get('password') and share_link['password'] != password:
            return jsonify({'error': 'Invalid password', 'requiresPassword': True}), 401
        
        # Get the note
        note = find_note_by_id(share_link['noteId'])
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        # Increment view count
        share_link['views'] += 1
        save_json_file(SHARED_LINKS_FILE, shared_links)
        
        return jsonify({
            'success': True,
            'note': note,
            'permissions': share_link['permissions'],
            'views': share_link['views']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-note/<share_id>', methods=['GET'])
def download_shared_note(share_id):
    """Download a shared note in various formats"""
    try:
        format_type = request.args.get('format', 'txt').lower()
        
        # Get shared note data
        shared_links = load_json_file(SHARED_LINKS_FILE)
        share_link = None
        for link in shared_links:
            if link.get('shareId') == share_id:
                share_link = link
                break
        
        if not share_link:
            return jsonify({'error': 'Share link not found'}), 404
        
        # Check if link has expired
        expiry_date = datetime.fromisoformat(share_link['expiryDate'])
        if datetime.now() > expiry_date:
            return jsonify({'error': 'Share link has expired'}), 410
        
        # Get the note
        note = find_note_by_id(share_link['noteId'])
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        note_title = note.get('title', 'Untitled Note')
        note_content = note.get('content', '')
        
        if format_type == 'pdf':
            # Create PDF
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            
            story = []
            # Add title
            title_para = Paragraph(f"<b>{note_title}</b>", styles['Title'])
            story.append(title_para)
            
            # Add content
            content_para = Paragraph(note_content.replace('\n', '<br/>'), styles['Normal'])
            story.append(content_para)
            
            doc.build(story)
            buffer.seek(0)
            
            return send_file(
                buffer,
                as_attachment=True,
                download_name=f"{note_title}.pdf",
                mimetype='application/pdf'
            )
        
        elif format_type == 'json':
            # Return as JSON
            buffer = io.StringIO()
            json.dump(note, buffer, indent=2, ensure_ascii=False)
            buffer.seek(0)
            
            return send_file(
                io.BytesIO(buffer.getvalue().encode('utf-8')),
                as_attachment=True,
                download_name=f"{note_title}.json",
                mimetype='application/json'
            )
        
        else:  # Default to txt
            # Create text file
            content = f"{note_title}\n{'=' * len(note_title)}\n\n{note_content}"
            buffer = io.BytesIO(content.encode('utf-8'))
            
            return send_file(
                buffer,
                as_attachment=True,
                download_name=f"{note_title}.txt",
                mimetype='text/plain'
            )
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/share-analytics/<share_id>', methods=['GET'])
def get_share_analytics(share_id):
    """Get analytics for a shared note"""
    try:
        shared_links = load_json_file(SHARED_LINKS_FILE)
        
        share_link = None
        for link in shared_links:
            if link.get('shareId') == share_id:
                share_link = link
                break
        
        if not share_link:
            return jsonify({'error': 'Share link not found'}), 404
        
        return jsonify({
            'success': True,
            'analytics': {
                'views': share_link.get('views', 0),
                'createdAt': share_link.get('createdAt'),
                'expiryDate': share_link.get('expiryDate'),
                'permissions': share_link.get('permissions')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# This is required for Vercel
def handler(event, context):
    return app(event, context)

if __name__ == '__main__':
    app.run(debug=True)
