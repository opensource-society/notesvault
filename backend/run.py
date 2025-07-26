#!/usr/bin/env python3
"""
Production entry point for NotesVault Flask Backend
Use this file to run the application in production environments
"""

import os
from app import create_app, init_database

# Determine environment
config_name = os.getenv('FLASK_ENV', 'production')

# Create Flask application
app = create_app(config_name)

# Initialize database on first run
if config_name == 'development':
    init_database(app)

if __name__ == '__main__':
    # Development server
    port = int(os.getenv('PORT', 5000))
    debug = config_name == 'development'
    
    print(f"Starting NotesVault Backend in {config_name} mode...")
    print(f"Server running on port {port}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
else:
    # Production WSGI application
    # This will be used by gunicorn, uwsgi, etc.
    application = app
