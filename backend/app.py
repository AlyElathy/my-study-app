from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'alkia15+_$' #Change to more secure
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
db = SQLAlchemy(app)
CORS(app, resources={r"/api/*": {"origins":"http://localhost:5173"}}, supports_credentials=True)
bcrypt = Bcrypt(app)

#After CORS
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    flashcards = db.relationship('Flashcard', backref='author', lazy=True)

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

with app.app_context():
    db.create_all()

def gen_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours = 1) #1-hour expiration
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f): 
    def wrapper(*args, **kwargs):
        #Handle OPTIONS requests
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)


        token = None

        #JWT is passed in the request headers: Authorization: Bearer<token>
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(username=data['username']).first()
            if not current_user:
                return jsonify({'message': 'User not found'}), 403
        except:
            return jsonify({'message': 'Token is invalid or expired'}), 403

        return f(current_user, *args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper


# AUTHENTICATION APIS
# Register
@app.route('/register', methods = ['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    current_user = User.query.filter_by(username=username).first()
    if current_user:
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8') #encoding decoding most common system
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 201
# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'User does not exist'}), 404

    if bcrypt.check_password_hash(user.password, password):
        token = gen_token(username)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Wrong password'}), 200

# DATA APIS (protected - @token_required)
@app.route('/api/flashcards', methods=['GET'])
@token_required
def get_flashcards(current_user):
    flashcards = Flashcard.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': card.id,
        'question': card.question,
        'answer': card.answer,
    } for card in flashcards])

@app.route('/api/flashcards', methods=['POST'])
@token_required
def add_flashcard(current_user):
    data = request.json
    if not data or 'question' not in data or 'answer' not in data:
        return jsonify({'error': 'Missing question or answer'}), 400
    new_flashcard = Flashcard(
        question = data['question'],
        answer=data['answer'],
        user_id=current_user.id
    )
    db.session.add(new_flashcard)
    db.session.commit()
    return jsonify({
        'id': new_flashcard.id,
        'question': new_flashcard.question,
        'answer': new_flashcard.answer
    }), 201

@app.route('/api/flashcards/<int:id>', methods=['DELETE'])
@token_required
def delete_flashcard(current_user, id):
    #Delete a flashcard from session by ID
    flashcard = Flashcard.query.filter_by(id=id, user_id=current_user.id).first()
    if not flashcard:
        return jsonify({'error': 'Card not found'}), 404
    db.session.delete(flashcard)
    db.session.commit()
    return jsonify({'message': 'Card deleted'}), 200


@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)