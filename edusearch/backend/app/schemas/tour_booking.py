from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TourBookingCreate(BaseModel):
    institution_id: int
    booking_type: str # 'in-person' or 'virtual'
    selected_date: Optional[datetime] = None
    party_size: int = 1
    contact_name: str
    contact_email: str
    intent_data: Optional[List[str]] = None

class TourBookingResponse(BaseModel):
    id: int
    institution_id: int
    status: str
    message: str
    intent_profile_saved: bool
