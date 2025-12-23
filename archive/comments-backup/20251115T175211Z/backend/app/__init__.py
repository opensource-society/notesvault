from flask import Flask
from flask_cors import CORS
from .routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # Enable CORS for frontend (http://localhost:8000) and allow cookies (credentials)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8000"]}}, supports_credentials=True)

    # register blueprints
    app.register_blueprint(main)

    return app
