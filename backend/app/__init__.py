from flask import Flask
from flask_cors import CORS
from .routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8000"]}}, supports_credentials=True)

    app.register_blueprint(main)

    return app