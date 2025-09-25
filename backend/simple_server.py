from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime, timedelta
import jwt

app = FastAPI()

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# JWT secret
JWT_SECRET = os.getenv('JWT_SECRET', 'nubix-secret-key-2024')

# Models
class UserLogin(BaseModel):
    email: str
    password: str

# Mock data
MOCK_USERS = {
    "test@nubix.com": {
        "password": "123456",
        "fullName": "Test User",
        "phoneNumber": "+249123456789",
        "kycStatus": "pending",
        "balance": 50000.0,
        "createdAt": "2024-01-01T00:00:00Z"
    },
    "admin@nubix.com": {
        "password": "admin123",
        "fullName": "Admin User",
        "phoneNumber": "+249987654321",
        "kycStatus": "approved",
        "balance": 100000.0,
        "createdAt": "2024-01-01T00:00:00Z"
    }
}

MOCK_CRYPTO_PRICES = [
    {
        "symbol": "BTC",
        "name": "Bitcoin",
        "priceUSD": 67542.30,
        "priceSDG": 67542.30 * 4000,
        "change24h": 2.45,
        "volume24h": 28500000000,
        "icon": "₿"
    },
    {
        "symbol": "ETH",
        "name": "Ethereum",
        "priceUSD": 3842.15,
        "priceSDG": 3842.15 * 4000,
        "change24h": -1.23,
        "volume24h": 15200000000,
        "icon": "Ξ"
    },
    {
        "symbol": "BNB",
        "name": "Binance Coin",
        "priceUSD": 596.78,
        "priceSDG": 596.78 * 4000,
        "change24h": 0.89,
        "volume24h": 1800000000,
        "icon": "⬡"
    },
    {
        "symbol": "ADA",
        "name": "Cardano",
        "priceUSD": 0.4521,
        "priceSDG": 0.4521 * 4000,
        "change24h": 3.12,
        "volume24h": 850000000,
        "icon": "₳"
    },
    {
        "symbol": "XRP",
        "name": "XRP",
        "priceUSD": 0.6234,
        "priceSDG": 0.6234 * 4000,
        "change24h": 1.76,
        "volume24h": 1200000000,
        "icon": "X"
    }
]

def create_jwt_token(email: str) -> str:
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("email")
    except:
        return None

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "NUBIX API is running"}

@app.post("/api/auth/login")
async def login_user(user_data: UserLogin):
    user = MOCK_USERS.get(user_data.email)
    if not user or user["password"] != user_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user_data.email)
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "email": user_data.email,
            "fullName": user["fullName"],
            "phoneNumber": user.get("phoneNumber"),
            "kycStatus": user.get("kycStatus", "not_started"),
            "balance": user.get("balance", 0.0)
        }
    }

@app.get("/api/crypto/prices")
async def get_crypto_prices():
    return {
        "prices": MOCK_CRYPTO_PRICES,
        "lastUpdated": datetime.utcnow().isoformat(),
        "exchangeRate": {
            "USD_TO_SDG": 4000,
            "description": "1 USD = 4,000 SDG (Sudanese Pounds)"
        }
    }

@app.get("/api/user/profile")
async def get_user_profile(request: Request):
    authorization = request.headers.get("authorization") or request.headers.get("Authorization")
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    token = authorization.split(" ")[1]
    email = verify_jwt_token(token)
    
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = MOCK_USERS.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user": {
            "email": email,
            "fullName": user["fullName"],
            "phoneNumber": user.get("phoneNumber"),
            "kycStatus": user.get("kycStatus", "not_started"),
            "balance": user.get("balance", 0.0),
            "createdAt": user.get("createdAt")
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)