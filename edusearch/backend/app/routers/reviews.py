from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db, Review, Institution
from app.schemas import ReviewResponse, ReviewCreate
from app.auth import get_current_user

router = APIRouter()

@router.get("/institutions/{institution_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(institution_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.institution_id == institution_id).order_by(Review.created_at.desc()).all()

@router.post("/institutions/{institution_id}/reviews", response_model=ReviewResponse)
async def create_review(
    institution_id: int, 
    review: ReviewCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school = db.query(Institution).filter(Institution.id == institution_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="Institution not found")
        
    new_review = Review(
        institution_id=institution_id,
        user_id=current_user.id,
        source="EduSearch",
        reviewer_name=f"{current_user.first_name} {current_user.last_name[0]}.",
        reviewer_type="student", # default for now
        rating_overall=review.rating_overall,
        body=review.body,
        created_at=datetime.utcnow()
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return new_review
