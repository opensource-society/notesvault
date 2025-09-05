from flask import Flask
from .routes import main
import os

def create_app():
    # Set up static folder and template folder paths
    static_folder = os.path.join(os.path.dirname(__file__), '../../')
    app = Flask(__name__, static_folder=static_folder, static_url_path='')
    app.config.from_object("app.config.Config")

    # register blueprints
    app.register_blueprint(main)

    return app 
