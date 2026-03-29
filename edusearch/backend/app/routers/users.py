from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, SavedSchool, Institution, User
from app.auth import get_current_user

router = APIRouter()

@router.get("/me/saved-schools")
async def get_saved_schools(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved = db.query(SavedSchool).filter(SavedSchool.user_id == current_user.id).all()
    inst_ids = [s.institution_id for s in saved]
    
    if not inst_ids:
        return []
        
    institutions = db.query(Institution).filter(Institution.id.in_(inst_ids)).all()
    
    # Return light version of institutions for the list
    results = []
    for inst in institutions:
        results.append({
            "id": inst.id,
            "name": inst.name,
            "slug": inst.slug,
            "city": inst.city,
            "state": inst.state,
            "rating_overall": inst.rating_overall,
            "tuition_in_state": inst.tuition_in_state,
            "admission_rate": inst.admission_rate,
            "net_price_public": getattr(inst, 'net_price_public', inst.tuition_in_state),
            "net_price_private": getattr(inst, 'net_price_private', inst.tuition_in_state),
            "sat_math_mid": inst.sat_math_mid if hasattr(inst, 'sat_math_mid') else None,
            "sat_reading_mid": inst.sat_reading_mid if hasattr(inst, 'sat_reading_mid') else None,
            "sat_math_25th": getattr(inst, 'sat_math_25th', None),
            "sat_reading_25th": getattr(inst, 'sat_reading_25th', None),
            "sat_math_75th": getattr(inst, 'sat_math_75th', None),
            "sat_reading_75th": getattr(inst, 'sat_reading_75th', None),
        })
    return results

@router.post("/me/saved-schools/{institution_id}")
async def save_school(
    institution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(SavedSchool).filter(
        SavedSchool.user_id == current_user.id,
        SavedSchool.institution_id == institution_id
    ).first()
    
    if existing:
        return {"message": "Already saved", "id": existing.id}
        
    new_saved = SavedSchool(user_id=current_user.id, institution_id=institution_id)
    db.add(new_saved)
    db.commit()
    db.refresh(new_saved)
    return {"message": "School saved successfully", "id": new_saved.id}

@router.delete("/me/saved-schools/{institution_id}")
async def unsave_school(
    institution_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(SavedSchool).filter(
        SavedSchool.user_id == current_user.id,
        SavedSchool.institution_id == institution_id
    ).first()
    
    if not existing:
        raise HTTPException(status_code=404, detail="Saved school not found")
        
    db.delete(existing)
    db.commit()
    return {"message": "School removed from saved list"}
