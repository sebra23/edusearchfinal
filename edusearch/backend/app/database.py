from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./data/edu_database.db')
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)

class Institution(Base):
    __tablename__ = "institutions"
    
    id = Column(Integer, primary_key=True, index=True)
    unitid = Column(String(10), unique=True, index=True, nullable=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)
    type = Column(String(50), index=True)
    level = Column(String(50))
    city = Column(String(100), index=True)
    state = Column(String(2), index=True)
    zip = Column(String(10))
    country = Column(String(2), default='US')
    latitude = Column(Float)
    longitude = Column(Float)
    phone = Column(String(20))
    email = Column(String(255))
    website = Column(String(255))
    enrollment_total = Column(Integer)
    student_teacher_ratio = Column(Float)
    graduation_rate = Column(Float)
    admission_rate = Column(Float)
    tuition_in_state = Column(Integer)
    tuition_out_state = Column(Integer)
    # Core Stats
    median_debt = Column(Integer)
    median_earnings_10yr = Column(Integer)
    rating_overall = Column(Float)
    review_count = Column(Integer, default=0)
    difficulty = Column(String(20), default='moderate')
    is_active = Column(Boolean, default=True)
    
    # Phase 10: Missing Data
    # Admissions
    application_deadline = Column(String(50))
    application_fee = Column(Integer)
    sat_required = Column(String(50))
    sat_range = Column(String(50))
    act_range = Column(String(50))
    gpa_required = Column(String(50))
    early_decision = Column(Boolean, default=False)
    common_app = Column(Boolean, default=False)
    application_website = Column(String(255))
    
    # Financials
    housing_cost = Column(Integer)
    meal_plan_cost = Column(Integer)
    books_supplies_cost = Column(Integer)
    average_total_aid = Column(Integer)
    percent_financial_aid = Column(Float)
    
    # Campus Life
    freshman_live_on_campus = Column(Float)
    day_care_services = Column(Boolean, default=False)
    
    # Athletics
    athletics_division = Column(String(100))
    athletics_conference = Column(String(100))
    sports_mens = Column(String(500))
    sports_womens = Column(String(500))
    varsity_athletes_percent = Column(Integer)

    # Phase 12: Private School Tours
    virtual_tour_url = Column(String(500))
    booking_url = Column(String(500))
    video_snippets = Column(JSON) # [{'url': str, 'title': str, 'thumbnail': str}]
    tour_views_count = Column(Integer, default=0)
    
    is_claimed = Column(Boolean, default=False)
    next_tour_date = Column(DateTime, nullable=True)
    spots_remaining = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    ai_scorecard = relationship("AiScorecard", back_populates="institution", uselist=False)

class AiScorecard(Base):
    __tablename__ = "ai_scorecards"
    
    id = Column(Integer, primary_key=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), unique=True, index=True)
    
    academics_grade = Column(String(5))
    value_grade = Column(String(5))
    diversity_grade = Column(String(5))
    campus_grade = Column(String(5))
    athletics_grade = Column(String(5))
    party_scene_grade = Column(String(5))
    overall_ai_grade = Column(String(5))
    
    ai_summary_text = Column(Text)
    
    # Phase 11: Campus Life Poll Percentages
    poll_greek_life_percent = Column(Integer)
    poll_varsity_sports_percent = Column(Integer)
    poll_happiness_love_percent = Column(Integer)
    poll_happiness_like_percent = Column(Integer)
    poll_happiness_okay_percent = Column(Integer)
    poll_athletics_facilities_percent = Column(Integer)
    poll_dining_facilities_percent = Column(Integer)
    poll_performing_arts_percent = Column(Integer)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    institution = relationship("Institution", back_populates="ai_scorecard")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    first_name = Column(String(100))
    last_name = Column(String(100))
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    saved_schools = relationship("SavedSchool", back_populates="user", cascade="all, delete-orphan")

class SavedSchool(Base):
    __tablename__ = "saved_schools"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="saved_schools")
    institution = relationship("Institution")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Source Info
    source = Column(String(50), default='EduSearch')  # 'EduSearch', 'Google', 'Reddit'
    external_id = Column(String(255), nullable=True, unique=True, index=True)
    
    # Reviewer info
    reviewer_type = Column(String(20))  # parent, student, alumni, teacher
    reviewer_name = Column(String(100))
    reviewer_email = Column(String(255))
    is_verified = Column(Boolean, default=False)  # .edu email confirmed
    
    # Ratings (1-5)
    rating_overall = Column(Integer)
    rating_academics = Column(Integer)
    rating_teachers = Column(Integer)
    rating_safety = Column(Integer)
    rating_clubs = Column(Integer)
    rating_food = Column(Integer)
    rating_administration = Column(Integer)
    
    # Content
    title = Column(String(255))
    body = Column(Text)
    would_recommend = Column(Boolean)
    year_attended = Column(Integer)
    
    # Engagement
    helpful_count = Column(Integer, default=0)
    unhelpful_count = Column(Integer, default=0)
    status = Column(String(20), default='pending')  # pending, approved, rejected
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    institution = relationship("Institution", backref="reviews")
