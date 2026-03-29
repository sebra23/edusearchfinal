from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db, Institution

router = APIRouter()

@router.get("/institutions")
async def list_institutions(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    institutions = db.query(Institution).offset(skip).limit(limit).all()
    return {"total": db.query(Institution).count(), "results": institutions}

@router.get("/institutions/{slug}")
async def get_institution(slug: str, db: Session = Depends(get_db)):
    institution = db.query(Institution).options(joinedload(Institution.ai_scorecard)).filter(Institution.slug == slug).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
        
    # Serialize to dict to ensure relationships are returned
    result = {c.name: getattr(institution, c.name) for c in institution.__table__.columns}
    if institution.ai_scorecard:
        result["ai_scorecard"] = {c.name: getattr(institution.ai_scorecard, c.name) for c in institution.ai_scorecard.__table__.columns}
    else:
        result["ai_scorecard"] = None
        
    return result

@router.post("/institutions/{institution_id}/book-tour")
async def book_tour(institution_id: int, booking: dict, db: Session = Depends(get_db)):
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
        
    # In a real app we would save this to the DB. For now, we mock the success.
    print(f"Booking received for {institution.name}: {booking}")
    
    # Simulate DB save and return success message
    import random
    return {
        "id": random.randint(1000, 9999),
        "institution_id": institution_id,
        "status": "confirmed" if institution.is_claimed else "pending",
        "message": "Booking successful",
        "intent_profile_saved": bool(booking.get("intent_data"))
    }
