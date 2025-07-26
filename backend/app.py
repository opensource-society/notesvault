"""
NotesVault Flask Backend Application
Main application factory and configuration
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()

def create_app(config_name='development'):
    """
    Application factory pattern for Flask app creation
    """
    app = Flask(__name__)

    # Configuration
    if config_name == 'development':
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notesvault.db'
        app.config['DEBUG'] = True
    elif config_name == 'testing':
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_notesvault.db'
        app.config['TESTING'] = True
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///notesvault.db')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions with app
    db.init_app(app)
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

    # Import models to ensure they're registered
    from models.user import User
    from models.note import Note

    # Register blueprints
    from routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')

    # Health check endpoint
    @app.route('/api/v1/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        })

    return app

def init_database(app):
    """Initialize database with tables and sample data"""
    with app.app_context():
        # Import models
        from models.user import User
        from models.note import Note
        from utils.auth import hash_password

        # Create all tables
        db.create_all()

        # Create sample data if no users exist
        try:
            if User.query.count() == 0:
                print("Creating sample data...")

                # Create sample user
                sample_user = User(
                    username='demo_user',
                    email='demo@notesvault.com',
                    password_hash=hash_password('demo123')
                )
                db.session.add(sample_user)
                db.session.commit()

                # Create sample notes
                sample_notes = [
                    Note(
                        title='Introduction to Python',
                        content='Python is a high-level programming language...',
                        subject='Computer Science',
                        tags='python,programming,basics',
                        user_id=sample_user.id
                    ),
                    Note(
                        title='Calculus Fundamentals',
                        content='Calculus is the mathematical study of continuous change...',
                        subject='Mathematics',
                        tags='calculus,math,derivatives',
                        user_id=sample_user.id
                    )
                ]

                for note in sample_notes:
                    db.session.add(note)

                db.session.commit()
                print("Sample data created successfully!")
        except Exception as e:
            print(f"Note: Could not create sample data: {e}")

if __name__ == '__main__':
    app = create_app('development')

    # Initialize database
    init_database(app)

    print("Starting NotesVault Flask Backend...")
    print("Available endpoints:")
    print("- Health Check: http://localhost:5000/api/v1/health")
    print("- API Documentation: Check backend/README.md")
    app.run(host='0.0.0.0', port=5000, debug=True)
