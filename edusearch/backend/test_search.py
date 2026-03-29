import sys
sys.path.append(".")
from app.database import SessionLocal, Institution
from sqlalchemy import or_

db = SessionLocal()
q = "college"
query = db.query(Institution).filter(or_(Institution.name.ilike(f"%{q}%"), Institution.city.ilike(f"%{q}%")))
print(f"Total matching 'college': {query.count()}")
first = query.first()
if first:
    print(f"First match: {first.name} (Active: {first.is_active})")
else:
    print("None")
