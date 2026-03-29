import os
import sys
import random
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

# Add backend directory to path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import SessionLocal, Institution, Review

def generate_mock_date(days_back=365):
    """Generate a random date within the last year."""
    return datetime.utcnow() - timedelta(days=random.randint(1, days_back))

def ingest_mock_google_reviews(db: Session, school: Institution):
    """Simulate fetching from Google Places API."""
    print(f"  Fetching Google Reviews for {school.name}...")
    
    mock_reviews = [
        {
            "author": "Jessica T.",
            "rating": 5,
            "text": f"Beautiful campus and amazing facilities! Took a tour here and fell in love with {school.name}. The guide was super helpful.",
            "type": "visitor"
        },
        {
            "author": "Marcus R.",
            "rating": 4,
            "text": "Great professors but the parking situation is an absolute nightmare. Get here early if you commute.",
            "type": "student"
        },
        {
            "author": "David L.",
            "rating": 5,
            "text": "Graduated in 2018. The alumni network is incredibly strong and helped me land my first job. Miss the quad!",
            "type": "alumni"
        },
        {
            "author": "Sarah M.",
            "rating": 3,
            "text": "Academics are solid but the dining hall food gets old after the first month. Luckily lots of good spots nearby.",
            "type": "student"
        }
    ]
    
    for r in mock_reviews:
        ext_id = f"google_{school.id}_{uuid.uuid4().hex[:8]}"
        
        # Check if exists (mocking idempotency)
        exists = db.query(Review).filter(Review.external_id == ext_id).first()
        if not exists:
            review = Review(
                institution_id=school.id,
                source="Google",
                external_id=ext_id,
                reviewer_name=r["author"],
                reviewer_type=r["type"],
                rating_overall=r["rating"],
                body=r["text"],
                created_at=generate_mock_date(),
                helpful_count=random.randint(0, 15),
                status="approved"
            )
            db.add(review)

def ingest_mock_reddit_reviews(db: Session, school: Institution):
    """Simulate fetching from Reddit PRAW API."""
    print(f"  Fetching Reddit Mentions for {school.name}...")
    
    mock_reviews = [
        {
            "author": "u/college_throwaway99",
            "rating": 4, # inferred
            "text": f"Honestly {school.name} is fine. If you put in the effort you can get a 4.0, but some of the intro classes are definitely weed-outs. Greek life exists but you don't need it to have a social life.",
            "type": "student"
        },
        {
            "author": "u/anxious_senior",
            "rating": 5,
            "text": "Just committed here! Visited last weekend and the vibe was exactly what I was looking for. Can anyone tell me which freshman dorm is the best?",
            "type": "student"
        },
        {
            "author": "u/eng_nerd_2020",
            "rating": 4,
            "text": "The computer science department is rigorous but the professors actually care. Be prepared for late nights in the lab. Career fair is decent.",
            "type": "alumni"
        }
    ]
    
    for r in mock_reviews:
        ext_id = f"reddit_{school.id}_{uuid.uuid4().hex[:8]}"
        
        exists = db.query(Review).filter(Review.external_id == ext_id).first()
        if not exists:
            review = Review(
                institution_id=school.id,
                source="Reddit",
                external_id=ext_id,
                reviewer_name=r["author"],
                reviewer_type=r["type"],
                rating_overall=r["rating"],
                body=r["text"],
                created_at=generate_mock_date(),
                helpful_count=random.randint(5, 45),
                status="approved"
            )
            db.add(review)

def main():
    db: Session = SessionLocal()
    
    print("Starting External Review Ingestion...")
    
    # Get a few prominent schools for the test run
    schools = db.query(Institution).filter(Institution.name.in_([
        "Southern New Hampshire University", 
        "Grand Canyon University",
        "Harvard University"
    ])).all()
    
    for school in schools:
        print(f"Processing {school.name}...")
        ingest_mock_google_reviews(db, school)
        ingest_mock_reddit_reviews(db, school)
        
    db.commit()
    print("Successfully ingested mock external reviews.")

if __name__ == "__main__":
    main()
