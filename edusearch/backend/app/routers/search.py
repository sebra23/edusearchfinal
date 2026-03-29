from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
from app.database import get_db, Institution

router = APIRouter()

@router.get("/search")
async def search(
    q: Optional[str] = Query(None, description="Search query"),
    state: Optional[str] = Query(None, description="State code"),
    type: Optional[str] = Query(None, description="Institution type"),
    level: Optional[str] = Query(None, description="Education level"),
    min_tuition: Optional[int] = Query(None, description="Minimum tuition"),
    max_tuition: Optional[int] = Query(None, description="Maximum tuition"),
    min_graduation_rate: Optional[float] = Query(None, description="Minimum graduation rate (0-1)"),
    min_earnings: Optional[int] = Query(None, description="Minimum median earnings"),
    difficulty: Optional[str] = Query(None, description="Difficulty: easy, moderate, hard, extreme"),
    sort_by: Optional[str] = Query("relevance", description="Sort: relevance, name, tuition, earnings, graduation"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Advanced search with multiple filters"""
    query = db.query(Institution)
    
    # Text search
    if q:
        query = query.filter(
            or_(
                Institution.name.ilike(f"%{q}%"),
                Institution.city.ilike(f"%{q}%")
            )
        )
    
    # Filters
    if state:
        query = query.filter(Institution.state == state.upper())
    
    if type:
        query = query.filter(Institution.type == type)
    
    if level:
        query = query.filter(Institution.level == level)
    
    if min_tuition:
        query = query.filter(Institution.tuition_in_state >= min_tuition)
    
    if max_tuition:
        query = query.filter(Institution.tuition_in_state <= max_tuition)
    
    if min_graduation_rate:
        query = query.filter(Institution.graduation_rate >= min_graduation_rate)
    
    if min_earnings:
        query = query.filter(Institution.median_earnings_10yr >= min_earnings)
    
    if difficulty:
        query = query.filter(Institution.difficulty == difficulty)
    
    # Sorting
    if sort_by == "tour_availability":
        # Only show claimed schools that have a next tour date, ordered by soonest
        query = query.filter(Institution.is_claimed == True, Institution.next_tour_date.isnot(None))
        query = query.order_by(Institution.next_tour_date.asc())
    elif sort_by == "name":
        query = query.order_by(Institution.name)
    elif sort_by == "tuition":
        query = query.order_by(Institution.tuition_in_state)
    elif sort_by == "earnings":
        query = query.order_by(Institution.median_earnings_10yr.desc())
    elif sort_by == "graduation":
        query = query.order_by(Institution.graduation_rate.desc())
    else:  # relevance or default
        query = query.order_by(Institution.enrollment_total.desc().nulls_last())

    # Ensure only active institutions are returned
    query = query.filter(Institution.is_active == True)
    
    # Pagination
    total = query.count()
    results = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
        "results": results
    }

@router.get("/filters/options")
async def get_filter_options(db: Session = Depends(get_db)):
    """Get available filter options"""
    states = [s[0] for s in db.query(Institution.state).distinct().all() if s[0]]
    types = [t[0] for t in db.query(Institution.type).distinct().all() if t[0]]
    levels = [l[0] for l in db.query(Institution.level).distinct().all() if l[0]]
    
    return {
        "states": sorted(states),
        "types": sorted(types),
        "levels": sorted(levels),
        "difficulties": ["easy", "moderate", "hard", "extreme"],
        "sort_options": [
            {"value": "relevance", "label": "Most Relevant"},
            {"value": "tour_availability", "label": "Tour Availability"},
            {"value": "name", "label": "Name (A-Z)"},
            {"value": "tuition", "label": "Lowest Tuition"},
            {"value": "earnings", "label": "Highest Earnings"},
            {"value": "graduation", "label": "Highest Graduation Rate"}
        ]
    }
