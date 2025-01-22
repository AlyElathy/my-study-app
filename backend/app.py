from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'alkia15+_$' #Change to more secure

CORS(app)
bcrypt = Bcrypt(app)

users = {}
saved_data = {
    'flashcards': []
}

def gen_token(username):
    payload = {
        'username': username,
        'exp': datetime.datetime.now() + datetime.timedelta(hours = 1) #1-hour expiration
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f): 
    def wrapper(*args, **kwargs):
        token = None

        #JWT is passed in the request headers: Authorization: Bearer<token>
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
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

    if username in users:
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8') #encoding decoding most common system
    users[username] = hashed_password
    return jsonify({'message': 'Registration successful'}), 201
# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if username not in users:
        return jsonify({'message': 'User does not exist'}), 404

    hashed_password = users[username]
    if bcrypt.check_password_hash(hashed_password, password):
        token = gen_token(username)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Wrong password'}), 200

# DATA APIS (protected - @token_required)


from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#in-mem storage
flashcards = []

@app.route('/api/flashcards', methods=['GET'])
def get_flashcards():
    return jsonify(flashcards)

@app.route('/api/flashcards', methods=['POST'])
def add_flashcard():
    data = request.json
    if not data or 'question' not in data or 'answer' not in data:
        return jsonify({'error': 'Missing question or answer'}), 400
    new_flashcard = {
        'id': len(flashcards) + 1,
        'question': data['question'],
        'answer': data['answer']
    }
    flashcards.append(new_flashcard)
    return jsonify(new_flashcard), 201

@app.route('/api/flashcards/<int:id>', methods=['DELETE'])
def delete_flashcard(id):
    #Delete a flashcard from session by ID
    global flashcards
    card = next((card for card in flashcards if card['id'] == id), None)
    if card is None:
        return jsonify({'error': 'Card not found'}), 404
    flashcards = [card for card in flashcards if card['id'] != id]
    return jsonify({'message': 'card deleted'}), 200


@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    app.run(debug=True)