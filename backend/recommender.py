import itertools

def generate_recommendations(menu_entities, budget):
    """
    Inputs: List of Menu model objects, budget
    """
    # Filter items that fit individually first to optimize
    valid_items = [item for item in menu_entities if item.price <= budget]
    
    if not valid_items:
        return []
        
    all_combos = []
    
    for r in range(1, 5):
        for combo in itertools.combinations(valid_items, r):
            total_price = sum(item.price for item in combo)
            
            if total_price <= budget:
                categories = [item.category for item in combo]
                
                # Apply Constraints: Only 1 Main, Max 1 Side, Max 1 Drink, Max 1 Dessert
                if (categories.count("Main") == 1 and 
                    categories.count("Side") <= 1 and 
                    categories.count("Drink") <= 1 and 
                    categories.count("Dessert") <= 1):
                    
                    avg_rating = sum(item.rating for item in combo) / len(combo)
                    budget_usage = total_price / budget
                    score = (avg_rating * 0.6) + (budget_usage * 0.4)
                    
                    all_combos.append({
                        "items": [item.item_name for item in combo],
                        "total_price": round(total_price, 2),
                        "average_rating": round(avg_rating, 2),
                        "score": round(score, 3),
                        "categories": categories,
                        "budget_usage": round(budget_usage * 100, 1) # percentage
                    })
                    
    # Sort combos by score in descending order
    sorted_combos = sorted(all_combos, key=lambda x: x["score"], reverse=True)
    return sorted_combos[:3]
