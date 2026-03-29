from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db, Institution

router = APIRouter()

@router.post("/compare")
async def compare_schools(institution_ids: List[int], db: Session = Depends(get_db)):
    """Compare up to 5 schools side-by-side"""
    if len(institution_ids) > 5:
        raise HTTPException(status_code=400, detail="Can only compare up to 5 schools")
    
    if len(institution_ids) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 schools to compare")
    
    schools = db.query(Institution).filter(Institution.id.in_(institution_ids)).all()
    
    if len(schools) != len(institution_ids):
        raise HTTPException(status_code=404, detail="One or more schools not found")
    
    # Calculate differences
    comparison = {
        "schools": schools,
        "differences": {
            "tuition_range": {
                "min": min([s.tuition_in_state for s in schools if s.tuition_in_state]),
                "max": max([s.tuition_in_state for s in schools if s.tuition_in_state])
            },
            "earnings_range": {
                "min": min([s.median_earnings_10yr for s in schools if s.median_earnings_10yr]),
                "max": max([s.median_earnings_10yr for s in schools if s.median_earnings_10yr])
            },
            "graduation_range": {
                "min": min([s.graduation_rate for s in schools if s.graduation_rate]),
                "max": max([s.graduation_rate for s in schools if s.graduation_rate])
            }
        },
        "winner": {
            "best_value": calculate_best_value(schools),
            "highest_earnings": max(schools, key=lambda x: x.median_earnings_10yr or 0).name,
            "lowest_debt": min(schools, key=lambda x: x.median_debt or float('inf')).name
        }
    }
    
    return comparison

def calculate_best_value(schools):
    """Calculate best value based on earnings/debt ratio"""
    best = None
    best_ratio = 0
    
    for school in schools:
        if school.median_earnings_10yr and school.median_debt and school.median_debt > 0:
            ratio = school.median_earnings_10yr / school.median_debt
            if ratio > best_ratio:
                best_ratio = ratio
                best = school
    
    return best.name if best else None
