"""Flask backend for Kids Bike Racing."""
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from models import db, Score, init_db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scores.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
init_db(app)

@app.route('/')
def index():
    """Serve the game page."""
    return render_template('index.html')

@app.route('/api/score', methods=['POST'])
def post_score():
    """Save a submitted score to the database."""
    data = request.get_json()
    if not data or 'name' not in data or 'score' not in data:
        return {'error': 'Invalid payload'}, 400
    new_score = Score(name=data['name'], score=int(data['score']))
    db.session.add(new_score)
    db.session.commit()
    return {'status': 'ok'}

@app.route('/api/leaderboard')
def leaderboard():
    """Return top 10 scores as JSON."""
    top_scores = Score.query.order_by(Score.score.desc()).limit(10).all()
    return jsonify([s.as_dict() for s in top_scores])

if __name__ == '__main__':
    app.run(debug=True)
