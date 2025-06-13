"""Database model and initialization."""
from flask_sqlalchemy import SQLAlchemy

# SQLAlchemy instance used by app

db = SQLAlchemy()

class Score(db.Model):
    """Simple high score model."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def as_dict(self):
        return {"name": self.name, "score": self.score}

def init_db(app):
    """Initialize database with the given Flask app."""
    db.init_app(app)
    with app.app_context():
        db.create_all()
