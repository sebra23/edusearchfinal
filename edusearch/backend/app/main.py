from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, init_db
from app.routers import institutions, search, reviews, auth, users

app = FastAPI(title="EduSearch API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(institutions.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(reviews.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(users.router, prefix="/api/v1/users")

@app.get("/")
async def root():
    return {"message": "EduSearch API", "docs": "/docs"}
