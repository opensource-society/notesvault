from flask import Flask
from .routes import main

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    # register blueprints
    app.register_blueprint(main)

    return app
