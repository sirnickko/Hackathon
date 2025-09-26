from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

class ChatLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user_message = db.Column(db.Text, nullable=False)
    bot_reply = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
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