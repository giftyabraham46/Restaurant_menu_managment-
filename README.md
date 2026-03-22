
# 🍽️ Global Restaurant Budget Recommender

A machine learning powered web application that recommends the best combination of restaurant menu items based on a customer's **budget**, **restaurant rating**, and **menu categories**.

The system analyzes restaurant data and generates optimal food combinations that maximize value while staying within the user's budget.

---

# 🚀 Project Overview

Choosing what to order from a restaurant menu can be difficult, especially when trying to stay within a budget. This project solves that problem by automatically recommending **balanced meal combinations** based on available menu items and customer budget.

The system uses restaurant data (from a Zomato dataset) and generates menu combinations using a recommendation algorithm.

Users can:

* Search restaurants by city
* View restaurant details and ratings
* Enter a budget
* Get recommended combinations of menu items

---

# 🧠 Key Features

✔ Restaurant discovery using dataset
✔ Budget-based food recommendation
✔ Menu combination optimization
✔ Restaurant rating integration
✔ Smart scoring system for recommendations
✔ Web interface for interaction

---

# 📊 Dataset

The project uses a **Zomato restaurant dataset** containing:

* RestaurantID
* RestaurantName
* CountryCode
* City
* Address
* Locality
* Cuisines
* Currency
* Price_range
* Votes
* Average_Cost_for_two
* Rating

Menu items are generated for restaurants based on their cuisine types.

---

# ⚙️ How the Recommendation System Works

The recommendation engine generates food combinations using the following process:

1. Retrieve menu items for a selected restaurant.
2. Generate possible item combinations.
3. Apply category constraints.
4. Filter combinations based on user budget.
5. Score each combination and return the best options.

---

# 📏 Recommendation Rules

The system follows these constraints:

* Only **1 Main dish**
* Maximum **1 Side**
* Maximum **1 Drink**
* Maximum **1 Dessert**
* Total price must be **≤ user budget**

---

# 🧮 Scoring Formula

Each combination is scored using:

score = (average_rating * 0.6) + (budget_usage * 0.4)

Where:

budget_usage = total_price / user_budget

This ensures recommendations:

* maximize budget utilization
* prioritize highly rated items

---

# 🖥️ Application Workflow

User enters city
↓
Restaurants are displayed
↓
User selects a restaurant
↓
User enters budget
↓
Recommendation engine generates menu combinations
↓
Top 3 meal combinations are displayed

---

# 🛠️ Tech Stack

Frontend

* React

Backend

* Python (FastAPI)

Database

* PostgreSQL

Data Processing

* Pandas

Algorithm

* Python itertools (combination generation)

---

# 📂 Project Structure

```
project/
│
├── data/
│   ├── zomato.csv
│   └── menu.csv
│
├── backend/
│   ├── app.py
│   ├── recommendation_engine.py
│   └── database.py
│
├── frontend/
│   ├── components/
│   └── pages/
│
├── README.md
└── requirements.txt

```

---

# 📈 Future Improvements

* Personalized recommendations using machine learning
* Integration with Google Maps API
* Real restaurant menu data
* User preference learning
* Mobile app version
* Calorie-aware recommendations

---
# Demo of the project 


<img width="1918" height="990" alt="Screenshot 2026-03-22 203027" src="https://github.com/user-attachments/assets/448b1288-8d33-48cc-89e7-6e0cc452d539" />



https://github.com/user-attachments/assets/32a0b676-3a40-44f9-a8a9-180d011b7b48

---

# 🤝 Contribution

Contributions are welcome. Feel free to open issues or submit pull requests.

---

# 📜 License

This project is for educational and research purposes.

---

# 👨‍💻 Author

Developed as a machine learning and web development project for restaurant recommendation systems.

  .

---
