import pandas as pd
import random
import os
from sqlalchemy.orm import Session
from models import Base, engine, SessionLocal, Restaurant, Menu

# Drop all tables and recreate them
Base.metadata.create_all(bind=engine)

# Realistic food names by cuisine for generation
FOOD_POOL = {
    "Italian": {"Main": ["Pizza Margherita", "Pasta Carbonara", "Lasagna", "Risotto"], "Side": ["Garlic Bread", "Bruschetta"], "Drink": ["Aperol Spritz", "Chianti Wine", "Espresso"], "Dessert": ["Tiramisu", "Gelato", "Panna Cotta"]},
    "Indian": {"Main": ["Chicken Biryani", "Paneer Butter Masala", "Dal Makhani", "Mutton Curry"], "Side": ["Garlic Naan", "Tandoori Roti", "Samosa"], "Drink": ["Mango Lassi", "Masala Chai", "Sweet Lassi"], "Dessert": ["Gulab Jamun", "Rasgulla", "Gajar Halwa"]},
    "Chinese": {"Main": ["Kung Pao Chicken", "Sweet and Sour Pork", "Peking Duck", "Fried Rice", "Chow Mein"], "Side": ["Spring Rolls", "Dumplings", "Baozi"], "Drink": ["Jasmine Tea", "Bubble Tea"], "Dessert": ["Tangyuan", "Fortune Cookie", "Egg Tart"]},
    "Mexican": {"Main": ["Tacos al Pastor", "Chicken Enchiladas", "Beef Burrito", "Fajitas"], "Side": ["Guacamole and Chips", "Nachos", "Quesadilla"], "Drink": ["Margarita", "Horchata", "Corona"], "Dessert": ["Churros", "Flan"]},
    "American": {"Main": ["Cheeseburger", "BBQ Ribs", "Steak", "Mac and Cheese"], "Side": ["French Fries", "Onion Rings", "Coleslaw"], "Drink": ["Coca Cola", "Milkshake", "Craft Beer"], "Dessert": ["Apple Pie", "Brownie", "Cheesecake"]},
    "Japanese": {"Main": ["Sushi Platter", "Ramen", "Udon", "Katsudon", "Teriyaki Chicken"], "Side": ["Edamame", "Gyoza", "Yakitori"], "Drink": ["Sake", "Matcha Tea", "Plum Wine"], "Dessert": ["Mochi", "Dorayaki", "Matcha Ice Cream"]},
    "Default": {"Main": ["Chef's Special Plate", "House Signature Dish", "Daily Roast", "Grilled Catch of the Day"], "Side": ["Side Salad", "Soup of the Day", "Basket of Bread"], "Drink": ["Soft Drink", "Bottled Water", "House Wine", "Local Beer"], "Dessert": ["Ice Cream Scoop", "Slice of Cake", "Fruit Platter"]}
}

def get_food_names(cuisines_str):
    if pd.isna(cuisines_str):
        return FOOD_POOL["Default"]
        
    for cuisine_key in FOOD_POOL:
        if cuisine_key != "Default" and cuisine_key in cuisines_str:
            return FOOD_POOL[cuisine_key]
    return FOOD_POOL["Default"]

def populate_db():
    db = SessionLocal()
    
    csv_path = "Zomato_Dataset.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    df = pd.read_csv(csv_path)
    # Fill NA values
    df.fillna({"Cuisines": "Unknown", "Locality": "Unknown", "Address": "Unknown"}, inplace=True)
    
    print(f"Loaded {len(df)} restaurants from {csv_path}. Inserting...")
    
    # Track inserted to avoid bulk duplicate primary keys
    inserted_ids = set()

    batch_size = 1000
    restaurant_list = []
    menu_list = []

    for idx, row in df.iterrows():
        rest_id = int(row['RestaurantID'])
        if rest_id in inserted_ids:
            continue
        inserted_ids.add(rest_id)
        
        # Calculate realistic prices based on average cost for two
        avg_cost = float(row['Average_Cost_for_two']) if pd.notna(row['Average_Cost_for_two']) and float(row['Average_Cost_for_two']) > 0 else 500.0
        
        r = Restaurant(
            restaurant_id=rest_id,
            name=str(row['RestaurantName']),
            city=str(row['City']),
            address=str(row['Address']),
            locality=str(row['Locality']),
            cuisines=str(row['Cuisines']),
            votes=int(row['Votes']) if pd.notna(row['Votes']) else 0,
            avg_cost_for_two=avg_cost,
            rating=float(row['Rating']) if pd.notna(row['Rating']) else 0.0,
            price_range=int(row['Price_range']) if pd.notna(row['Price_range']) else 1
        )
        restaurant_list.append(r)
        
        # Generate menu items
        pool = get_food_names(r.cuisines)
        num_items = random.randint(15, 20)
        
        for _ in range(num_items):
            category = random.choices(["Main", "Side", "Drink", "Dessert"], weights=[40, 30, 15, 15])[0]
            item_name = random.choice(pool[category])
            
            # Add some modifiers to make names unique-ish if repeating
            modifier = random.choice(["", " Extra", " Special", " Large", " Deluxe", " (Spicy)"])
            item_name += modifier
            
            # Scaling prices
            if category == "Main":
                price = avg_cost * random.uniform(0.20, 0.35)
            elif category == "Side":
                price = avg_cost * random.uniform(0.08, 0.15)
            elif category == "Drink":
                price = avg_cost * random.uniform(0.05, 0.10)
            else: # Dessert
                price = avg_cost * random.uniform(0.10, 0.18)
                
            menu_list.append(Menu(
                restaurant_id=rest_id,
                item_name=item_name.strip(),
                category=category,
                price=round(price, 2),
                rating=round(random.uniform(3.5, 5.0), 1)
            ))
            
        if len(restaurant_list) >= batch_size:
            db.bulk_save_objects(restaurant_list)
            db.bulk_save_objects(menu_list)
            db.commit()
            restaurant_list = []
            menu_list = []
            print(f"Inserted {idx} rows...")

    if restaurant_list:
        db.bulk_save_objects(restaurant_list)
        db.bulk_save_objects(menu_list)
        db.commit()

    print("Database initialization complete.")
    db.close()

if __name__ == "__main__":
    populate_db()
