from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_restx import Api, Resource, fields

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import logging
from datetime import datetime

# 🔧 Logging setup
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)

# 🚀 Initialize Flask app and RESTX API
app = Flask(__name__)
api = Api(
    app,
    title="Mental Health Chatbot API",
    version="1.0",
    description="Hackathon backend powered by Flask + HuggingFace"
)

# ⚙️ Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 🔌 Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# 🤖 Load DialoGPT model
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

# 👤 User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

# 💬 Chat log model
class ChatLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    user_message = db.Column(db.Text, nullable=False)
    bot_reply = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# 🧠 Assessment log model
class AssessmentLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(80))
    stress_level = db.Column(db.Integer)
    stress_frequency = db.Column(db.String(50))
    stress_triggers = db.Column(db.PickleType)
    sleep_hours = db.Column(db.Integer)
    exercise_frequency = db.Column(db.String(50))
    screen_time = db.Column(db.Integer)
    support_level = db.Column(db.String(50))
    relaxation_experience = db.Column(db.Integer)
    workload = db.Column(db.String(50))
    self_care_time = db.Column(db.Integer)
    environment_support = db.Column(db.Integer)
    coping_methods = db.Column(db.PickleType)
    stress_goals = db.Column(db.PickleType)
    motivations = db.Column(db.PickleType)
    ideal_day = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# 🧱 Create DB tables
with app.app_context():
    db.create_all()

# 📦 Define OpenAPI models
chat_model = api.model("ChatInput", {
    "message": fields.String(required=True, description="User message to the chatbot")
})

reply_model = api.model("ChatReply", {
    "reply": fields.String(description="Bot's response")
})

assessment_model = api.model("AssessmentInput", {
    "nickname": fields.String,
    "stress_level": fields.Integer,
    "stress_frequency": fields.String,
    "stress_triggers": fields.List(fields.String),
    "sleep_hours": fields.Integer,
    "exercise_frequency": fields.String,
    "screen_time": fields.Integer,
    "support_level": fields.String,
    "relaxation_experience": fields.Integer,
    "workload": fields.String,
    "self_care_time": fields.Integer,
    "environment_support": fields.Integer,
    "coping_methods": fields.List(fields.String),
    "stress_goals": fields.List(fields.String),
    "motivations": fields.List(fields.String),
    "ideal_day": fields.String
})

# 🔐 Signup route (accepts username or email)
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    identifier = data.get("username") or data.get("email")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Username or email and password required"}), 400

    if User.query.filter_by(username=identifier).first():
        return jsonify({"error": "Account already exists"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=identifier, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201

# 🔐 Login route (accepts username or email)
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    identifier = data.get("username") or data.get("email")
    password = data.get("password")

    logging.info(f"Login attempt: {identifier}")
    user = User.query.filter_by(username=identifier).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200

# 💬 Chat route with OpenAPI docs
@api.route("/chat")
class Chat(Resource):
    @api.expect(chat_model)
    @api.marshal_with(reply_model)
    def post(self):
        user_message = request.json.get("message", "").strip()
        logging.info(f"Chat message received: {user_message}")

        if not user_message:
            api.abort(400, "Message is required")

        crisis_keywords = ["suicide", "self-harm", "end it all", "kill myself"]
        if any(kw in user_message.lower() for kw in crisis_keywords):
            return {
                "reply": "I'm really concerned about your safety. Please reach out to a mental health professional or call a local helpline. You're not alone 💙"
            }

        try:
            inputs = tokenizer.encode(user_message + tokenizer.eos_token, return_tensors="pt")
            reply_ids = model.generate(inputs, max_length=100, pad_token_id=tokenizer.eos_token_id)
            bot_reply = tokenizer.decode(reply_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True)

            chat_entry = ChatLog(
                user_id=None,
                user_message=user_message,
                bot_reply=bot_reply
            )
            db.session.add(chat_entry)
            db.session.commit()

            return {"reply": bot_reply}
        except Exception as e:
            logging.error(f"Chat error: {str(e)}")
            api.abort(500, "Internal server error")

# 🧠 Assessment route with OpenAPI docs
@api.route("/assessment")
class Assessment(Resource):
    @api.expect(assessment_model)
    def post(self):
        data = request.json
        log = AssessmentLog(
            nickname=data.get("nickname"),
            stress_level=data.get("stress_level"),
            stress_frequency=data.get("stress_frequency"),
            stress_triggers=data.get("stress_triggers", []),
            sleep_hours=data.get("sleep_hours"),
            exercise_frequency=data.get("exercise_frequency"),
            screen_time=data.get("screen_time"),
            support_level=data.get("support_level"),
            relaxation_experience=data.get("relaxation_experience"),
            workload=data.get("workload"),
            self_care_time=data.get("self_care_time"),
            environment_support=data.get("environment_support"),
            coping_methods=data.get("coping_methods", []),
            stress_goals=data.get("stress_goals", []),
            motivations=data.get("motivations", []),
            ideal_day=data.get("ideal_day")
        )
        db.session.add(log)
        db.session.commit()

        logging.info(f"Assessment received from {log.nickname}: {data}")

        suggestion = log.coping_methods[0] if log.coping_methods else "breathing exercises"
        goal = log.stress_goals[0] if log.stress_goals else "better sleep"

        return jsonify({
            "message": f"Thanks, {log.nickname}. Based on your responses, we recommend starting with {suggestion} and focusing on your goal of {goal}. You're not alone 💙"
        }), 200

# 📜 History route
@app.route("/history", methods=["GET"])
def history():
    logs = ChatLog.query.order_by(ChatLog.timestamp.desc()).limit(20).all()
    history = [
        {
            "user_message": log.user_message,
            "bot_reply": log.bot_reply,
            "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        for log in logs
    ]
    return jsonify({"history": history})

# 🚨 Global error handler
@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"Unhandled exception: {str(e)}")
    return jsonify({"error": "Something went wrong. Please try again later."}), 500

# 🏁 Run the app
if __name__ == "__main__":
    app.run(debug=True)