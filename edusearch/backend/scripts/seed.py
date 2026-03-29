import sys
sys.path.append("..")
from app.database import SessionLocal, init_db, Institution
from datetime import datetime

def seed():
    db = SessionLocal()
    sample_schools = [
        {"name": "Lincoln High School", "slug": "lincoln-high-seattle", "city": "Seattle", "state": "WA", "type": "public_k12", "enrollment_total": 1650, "difficulty": "moderate", "virtual_tour_url": "https://example.com/tour1", "booking_url": "https://example.com/book1", "video_snippets": [{"url": "/videos/school1_snippet1.mp4", "title": "Touring the Campus", "thumbnail": "/images/thumb1.jpg"}], "tour_views_count": 145, "is_claimed": True, "next_tour_date": datetime(2026, 3, 15, 10, 0), "spots_remaining": 5},
        {"name": "Harvard University", "slug": "harvard-university", "city": "Cambridge", "state": "MA", "type": "private_college", "enrollment_total": 21000, "difficulty": "extreme", "virtual_tour_url": "https://example.com/tour2", "booking_url": "https://example.com/book2", "video_snippets": [{"url": "/videos/school2_snippet1.mp4", "title": "Inside the Library", "thumbnail": "/images/thumb2.jpg"}], "tour_views_count": 1024, "is_claimed": True, "next_tour_date": datetime(2026, 3, 22, 14, 30), "spots_remaining": 1},
        {"name": "Roosevelt Elementary", "slug": "roosevelt-elementary", "city": "Portland", "state": "OR", "type": "public_k12", "enrollment_total": 450, "difficulty": "easy", "virtual_tour_url": "https://example.com/tour3", "booking_url": "https://example.com/book3", "video_snippets": [{"url": "/videos/school3_snippet1.mp4", "title": "Playground Fun", "thumbnail": "/images/thumb3.jpg"}], "tour_views_count": 55, "is_claimed": False, "next_tour_date": None, "spots_remaining": 0}
    ]
    for data in sample_schools:
        db.add(Institution(**data))
    db.commit()
    print(f"Added {len(sample_schools)} schools")

if __name__ == "__main__":
    init_db()
    seed()
