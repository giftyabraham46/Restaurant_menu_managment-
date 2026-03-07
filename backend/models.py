from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:///./restaurants.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Restaurant(Base):
    __tablename__ = "restaurants"

    restaurant_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String, index=True)
    address = Column(Text)
    locality = Column(String)
    cuisines = Column(String)
    votes = Column(Integer)
    avg_cost_for_two = Column(Float)
    rating = Column(Float)
    price_range = Column(Integer)

class Menu(Base):
    __tablename__ = "menus"

    item_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    restaurant_id = Column(Integer, index=True)
    item_name = Column(String)
    category = Column(String)  # Main, Side, Drink, Dessert
    price = Column(Float)
    rating = Column(Float)
