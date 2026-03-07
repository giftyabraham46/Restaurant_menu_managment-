from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
import math

from models import SessionLocal, Restaurant, Menu
from recommender import generate_recommendations

app = FastAPI(title="Global Restaurant Budget Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RecommendRequest(BaseModel):
    budget: float

@app.get("/api/restaurants/filters")
def get_filters(db: Session = Depends(get_db)):
    cities = [r[0] for r in db.query(Restaurant.city).distinct().order_by(Restaurant.city).all()]
    
    # Extract unique cuisines (since they are comma separated)
    all_cuisines = db.query(Restaurant.cuisines).all()
    unique_cuisines = set()
    for row in all_cuisines:
        if row[0]:
            parts = [p.strip() for p in row[0].split("|")]
            unique_cuisines.update(parts)
            
    return {
        "cities": cities,
        "cuisines": sorted(list(unique_cuisines))
    }

@app.get("/api/restaurants")
def search_restaurants(
    city: Optional[str] = None,
    cuisine: Optional[str] = None,
    min_rating: Optional[float] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)
    
    if city:
        query = query.filter(Restaurant.city == city)
    if cuisine:
        query = query.filter(Restaurant.cuisines.like(f"%{cuisine}%"))
    if min_rating:
        query = query.filter(Restaurant.rating >= min_rating)
        
    total_count = query.count()
    total_pages = math.ceil(total_count / limit)
    
    restaurants = query.order_by(Restaurant.rating.desc(), Restaurant.votes.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "data": restaurants,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_count": total_count,
            "total_pages": total_pages
        }
    }

@app.get("/api/restaurants/{restaurant_id}")
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@app.post("/api/restaurants/{restaurant_id}/recommend")
def get_recommendations(restaurant_id: int, req: RecommendRequest, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    menu_items = db.query(Menu).filter(Menu.restaurant_id == restaurant_id).all()
    
    # Generate combos based on budget
    combos = generate_recommendations(menu_items, req.budget)
    return {"recommendations": combos}

