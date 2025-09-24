from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime, timedelta
import jwt
import bcrypt
from pymongo import MongoClient
from bson import ObjectId
import json

app = FastAPI(title="NUBIX API", description="Cryptocurrency Trading API for Sudanese Users", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URL)
db = client.nubix_db

# JWT secret
JWT_SECRET = os.getenv('JWT_SECRET', 'nubix-secret-key-2024')

# Models
class UserRegistration(BaseModel):
    fullName: str
    email: str
    password: str
    phoneNumber: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class PhoneAuth(BaseModel):
    phoneNumber: str

class OTPVerification(BaseModel):
    phoneNumber: str
    otp: str

class CryptoPrice(BaseModel):
    symbol: str
    name: str
    price: float
    change24h: float
    volume24h: float

# Mock data for development
MOCK_USERS = {
    "test@nubix.com": {
        "password": "123456",  # Plain text for development
        "fullName": "Test User",
        "phoneNumber": "+249123456789",
        "kycStatus": "pending",
        "balance": 0.0,
        "createdAt": "2024-01-01T00:00:00Z"
    },
    "admin@nubix.com": {
        "password": "admin123",  # Plain text for development
        "fullName": "Admin User",
        "phoneNumber": "+249987654321",
        "kycStatus": "approved",
        "balance": 50000.0,
        "createdAt": "2024-01-01T00:00:00Z"
    }
}

MOCK_CRYPTO_PRICES = [
    {
        "symbol": "BTC",
        "name": "Bitcoin",
        "price": 67542.30,
        "change24h": 2.45,
        "volume24h": 28500000000,
        "icon": "₿"
    },
    {
        "symbol": "ETH",
        "name": "Ethereum",
        "price": 3842.15,
        "change24h": -1.23,
        "volume24h": 15200000000,
        "icon": "Ξ"
    },
    {
        "symbol": "BNB",
        "name": "Binance Coin",
        "price": 596.78,
        "change24h": 0.89,
        "volume24h": 1800000000,
        "icon": "⬡"
    },
    {
        "symbol": "ADA",
        "name": "Cardano",
        "price": 0.4521,
        "change24h": 3.12,
        "volume24h": 850000000,
        "icon": "₳"
    },
    {
        "symbol": "XRP",
        "name": "XRP",
        "price": 0.6234,
        "change24h": 1.76,
        "volume24h": 1200000000,
        "icon": "X"
    }
]

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

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
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "NUBIX API is running"}

@app.post("/api/auth/register")
async def register_user(user_data: UserRegistration):
    # Check if user already exists
    if user_data.email in MOCK_USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash password
    hashed_password = hash_password(user_data.password)
    
    # Create user (in real app, save to MongoDB)
    MOCK_USERS[user_data.email] = {
        "password": hashed_password,
        "fullName": user_data.fullName,
        "phoneNumber": user_data.phoneNumber,
        "kycStatus": "not_started",
        "balance": 0.0,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    # Generate token
    token = create_jwt_token(user_data.email)
    
    return {
        "message": "Registration successful",
        "token": token,
        "user": {
            "email": user_data.email,
            "fullName": user_data.fullName,
            "phoneNumber": user_data.phoneNumber,
            "kycStatus": "not_started",
            "balance": 0.0
        }
    }

@app.post("/api/auth/login")
async def login_user(user_data: UserLogin):
    # Check if user exists
    user = MOCK_USERS.get(user_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # For development mode, use simple password comparison
    if user["password"] != user_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate token
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

@app.post("/api/auth/phone/send-otp")
async def send_phone_otp(phone_data: PhoneAuth):
    # In development mode, accept specific test numbers
    test_numbers = ["+249123456789", "+249987654321"]
    if phone_data.phoneNumber not in test_numbers:
        raise HTTPException(status_code=400, detail="Invalid phone number for development mode")
    
    # In real app, send actual SMS via service like Twilio
    return {
        "message": "OTP sent successfully",
        "verificationId": "dev-verification-id",
        "developmentOtp": "123456"  # Remove this in production
    }

@app.post("/api/auth/phone/verify-otp")
async def verify_phone_otp(otp_data: OTPVerification):
    # Development mode - accept 123456 as valid OTP
    if otp_data.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Find or create user with phone number
    phone_user = None
    for email, user in MOCK_USERS.items():
        if user.get("phoneNumber") == otp_data.phoneNumber:
            phone_user = {"email": email, **user}
            break
    
    if not phone_user:
        # Create new user with phone number
        email = f"user_{otp_data.phoneNumber.replace('+', '').replace(' ', '')}@nubix.com"
        MOCK_USERS[email] = {
            "password": hash_password("temp123"),  # Temporary password
            "fullName": "Phone User",
            "phoneNumber": otp_data.phoneNumber,
            "kycStatus": "not_started",
            "balance": 0.0,
            "createdAt": datetime.utcnow().isoformat()
        }
        phone_user = {"email": email, **MOCK_USERS[email]}
    
    # Generate token
    token = create_jwt_token(phone_user["email"])
    
    return {
        "message": "Phone verification successful",
        "token": token,
        "user": {
            "email": phone_user["email"],
            "fullName": phone_user["fullName"],
            "phoneNumber": phone_user["phoneNumber"],
            "kycStatus": phone_user.get("kycStatus", "not_started"),
            "balance": phone_user.get("balance", 0.0)
        }
    }

@app.get("/api/crypto/prices")
async def get_crypto_prices():
    # Updated crypto prices with SDG conversion (1 USD = 4000 SDG)
    USD_TO_SDG = 4000
    
    updated_prices = []
    for crypto in MOCK_CRYPTO_PRICES:
        crypto_with_sdg = crypto.copy()
        crypto_with_sdg["priceSDG"] = crypto["price"] * USD_TO_SDG
        crypto_with_sdg["priceUSD"] = crypto["price"]
        updated_prices.append(crypto_with_sdg)
    
    return {
        "prices": updated_prices,
        "lastUpdated": datetime.utcnow().isoformat(),
        "exchangeRate": {
            "USD_TO_SDG": USD_TO_SDG,
            "description": "1 USD = 4,000 SDG (Sudanese Pounds)"
        }
    }

@app.get("/api/user/profile")
async def get_user_profile(authorization: str = None):
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

@app.get("/api/transactions")
async def get_transactions(authorization: str = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Mock empty transactions for now
    return {
        "transactions": [],
        "message": "No transactions yet"
    }

@app.get("/api/portfolio")
async def get_portfolio(authorization: str = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Mock empty portfolio for now
    return {
        "portfolio": [],
        "totalValue": 0.0,
        "message": "Portfolio is empty"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)