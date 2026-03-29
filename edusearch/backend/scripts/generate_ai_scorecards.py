import os
import sys
import json
import time
from sqlalchemy.orm import Session
# Add backend directory to path to allow absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import SessionLocal, Institution, AiScorecard, init_db

def ingest_reddit_mentions(school_name):
    # TODO: Implement actual Reddit API ingestion using PRAW
    # For now, return mock community sentiment
    return [
        f"I really loved the classes at {school_name}, professors actually care.",
        "The dorms are kind of old, but the campus is beautiful.",
        "Sports aren't a big deal here, but intramurals are fun.",
        "Food is okay, not the best. The local town makes up for it!",
        "Very diverse student body, met people from everywhere.",
        "Not a huge party school, but if you look for it you can find it."
    ]

def ingest_google_reviews(school_name):
    # TODO: Implement actual Google Places API fetching
    # For now, return mock reviews
    return [
        "Beautiful campus and great academics. 5 stars.",
        "Financial aid office was very difficult to work with. Great value once you get it though.",
        "Safe area, feels very much like a college town."
    ]

def evaluate_with_llm(school_name, community_text):
    # TODO: Connect to OpenAI/Anthropic/Gemini API here
    # For now, we simulate an LLM response based on the mock data.
    # In reality, this would be a prompt like:
    # "You are an expert college evaluator. Based on the following community forum posts 
    # and reviews, assign a letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D, F) for: 
    # Academics, Value, Diversity, Campus, Athletics, Party Scene. Also provide a 2 sentence summary."
    
    # Mock LLM generation
    import random
    
    # Generate somewhat realistic happiness distributions
    h_love = random.randint(35, 65)
    h_like = random.randint(30, 95 - h_love)
    h_okay = 100 - (h_love + h_like)
    
    return {
        "academics_grade": "A",
        "value_grade": "B+",
        "diversity_grade": "A-",
        "campus_grade": "B+",
        "athletics_grade": "C+",
        "party_scene_grade": "B-",
        "overall_ai_grade": "A-",
        "ai_summary_text": f"Community sentiment for {school_name} highlights strong academics and a diverse, beautiful campus. However, some students note that athletics and party life are less prominent, and administrative processes can be frustrating.",
        "poll_greek_life_percent": random.randint(15, 85),
        "poll_varsity_sports_percent": random.randint(20, 90),
        "poll_happiness_love_percent": h_love,
        "poll_happiness_like_percent": h_like,
        "poll_happiness_okay_percent": h_okay,
        "poll_athletics_facilities_percent": random.randint(40, 95),
        "poll_dining_facilities_percent": random.randint(30, 85),
        "poll_performing_arts_percent": random.randint(40, 90)
    }

def generate_scorecards():
    db: Session = SessionLocal()
    
    # Get a few prominent schools for the test run
    schools = db.query(Institution).filter(Institution.name.in_([
        "Southern New Hampshire University", 
        "Grand Canyon University",
        "Harvard University"
    ])).all()
    
    for school in schools:
        print(f"Generating AI Scorecard for {school.name}...")
        
        # 1. Ingest Data
        reddit_text = ingest_reddit_mentions(school.name)
        google_text = ingest_google_reviews(school.name)
        
        combined_text = "\\n".join(reddit_text + google_text)
        
        # 2. Evaluate with LLM
        eval_result = evaluate_with_llm(school.name, combined_text)
        
        # 3. Save to Database
        scorecard = db.query(AiScorecard).filter(AiScorecard.institution_id == school.id).first()
        if not scorecard:
            scorecard = AiScorecard(institution_id=school.id)
            db.add(scorecard)
            
        scorecard.academics_grade = eval_result["academics_grade"]
        scorecard.value_grade = eval_result["value_grade"]
        scorecard.diversity_grade = eval_result["diversity_grade"]
        scorecard.campus_grade = eval_result["campus_grade"]
        scorecard.athletics_grade = eval_result["athletics_grade"]
        scorecard.party_scene_grade = eval_result["party_scene_grade"]
        scorecard.overall_ai_grade = eval_result["overall_ai_grade"]
        scorecard.ai_summary_text = eval_result["ai_summary_text"]
        
        # Phase 11 updates
        scorecard.poll_greek_life_percent = eval_result["poll_greek_life_percent"]
        scorecard.poll_varsity_sports_percent = eval_result["poll_varsity_sports_percent"]
        scorecard.poll_happiness_love_percent = eval_result["poll_happiness_love_percent"]
        scorecard.poll_happiness_like_percent = eval_result["poll_happiness_like_percent"]
        scorecard.poll_happiness_okay_percent = eval_result["poll_happiness_okay_percent"]
        scorecard.poll_athletics_facilities_percent = eval_result["poll_athletics_facilities_percent"]
        scorecard.poll_dining_facilities_percent = eval_result["poll_dining_facilities_percent"]
        scorecard.poll_performing_arts_percent = eval_result["poll_performing_arts_percent"]
        
        db.commit()
        print(f"Successfully generated and saved scorecard for {school.name}.")
        time.sleep(1) # simulate API delay

    print("AI Scorecard generation complete.")

if __name__ == "__main__":
    init_db()
    generate_scorecards()
