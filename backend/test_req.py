import requests

res = requests.post("http://localhost:8008/api/restaurants/18384213/recommend", json={"budget": 500})
print("Result:", res.json())
