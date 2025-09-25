from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from datetime import datetime, timedelta
import jwt
import bcrypt
from pymongo import MongoClient
import uuid
import random

app = FastAPI(title="NUBIX API", description="Cryptocurrency Trading API for Sudanese Users", version="1.1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# MongoDB connection (not used in mock, but kept for future)
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URL)
db = client.nubix_db

# JWT secret
JWT_SECRET = os.getenv('JWT_SECRET', 'nubix-secret-key-2024')

# ========================
# Models
# ========================
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

class QuoteRequest(BaseModel):
    symbol: str
    amountUSD: Optional[float] = None
    amountSDG: Optional[float] = None

class CreateOrderRequest(BaseModel):
    quoteId: str
    paymentMethod: str  # 'bank_transfer'

class ConfirmPaymentRequest(BaseModel):
    orderId: str
    reference: Optional[str] = None

# ========================
# Mock Data
# ========================
MOCK_USERS: Dict[str, Dict[str, Any]] = {
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

BASE_COINS = [
    ("BTC", "Bitcoin"), ("ETH", "Ethereum"), ("BNB", "Binance Coin"), ("ADA", "Cardano"), ("XRP", "XRP"),
    ("SOL", "Solana"), ("DOGE", "Dogecoin"), ("DOT", "Polkadot"), ("LTC", "Litecoin"), ("LINK", "Chainlink"),
    ("MATIC", "Polygon"), ("TON", "Toncoin"), ("TRX", "TRON"), ("ATOM", "Cosmos"), ("AVAX", "Avalanche"),
    ("XLM", "Stellar"), ("APT", "Aptos"), ("ARB", "Arbitrum"), ("OP", "Optimism"), ("SUI", "Sui")
]

ICON_MAP = {"BTC": "₿", "ETH": "Ξ", "BNB": "⬡", "ADA": "₳", "XRP": "X", "LTC": "Ł", "DOT": "●", "LINK": "🔗", "XLM": "🌟", "SOL": "◎", "DOGE": "Ð", "ATOM": "⚛"}

USD_TO_SDG = 4000

# In-memory stores (MVP)
QUOTES: Dict[str, Dict[str, Any]] = {}
ORDERS: Dict[str, Dict[str, Any]] = {}
KYC_DATA: Dict[str, Dict[str, Any]] = {}
INBOX_THREADS: Dict[str, Dict[str, Any]] = {}

# ========================
# Helpers
# ========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_jwt_token(email: str) -> str:
    payload = {"email": email, "exp": datetime.utcnow() + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("email")
    except Exception:
        return None

# ========================
# Routes - Health
# ========================
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "NUBIX API is running"}

# ========================
# Routes - Auth
# ========================
@app.post("/api/auth/register")
async def register_user(user_data: UserRegistration):
    if user_data.email in MOCK_USERS:
        raise HTTPException(status_code=400, detail="User already exists")
    MOCK_USERS[user_data.email] = {
        "password": user_data.password,  # For dev only
        "fullName": user_data.fullName,
        "phoneNumber": user_data.phoneNumber,
        "kycStatus": "not_started",
        "balance": 0.0,
        "createdAt": datetime.utcnow().isoformat()
    }
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
    user = MOCK_USERS.get(user_data.email)
    if not user or user.get("password") != user_data.password:
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

@app.post("/api/auth/phone/send-otp")
async def send_phone_otp(phone_data: PhoneAuth):
    test_numbers = ["+249123456789", "+249987654321"]
    if phone_data.phoneNumber not in test_numbers:
        raise HTTPException(status_code=400, detail="Invalid phone number for development mode")
    return {
        "message": "OTP sent successfully",
        "verificationId": "dev-verification-id",
        "developmentOtp": "123456"
    }

@app.post("/api/auth/phone/verify-otp")
async def verify_phone_otp(otp_data: OTPVerification):
    if otp_data.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP")
    phone_user = None
    for email, user in MOCK_USERS.items():
        if user.get("phoneNumber") == otp_data.phoneNumber:
            phone_user = {"email": email, **user}
            break
    if not phone_user:
        email = f"user_{otp_data.phoneNumber.replace('+', '').replace(' ', '')}@nubix.com"
        MOCK_USERS[email] = {
            "password": "temp123",
            "fullName": "Phone User",
            "phoneNumber": otp_data.phoneNumber,
            "kycStatus": "not_started",
            "balance": 0.0,
            "createdAt": datetime.utcnow().isoformat()
        }
        phone_user = {"email": email, **MOCK_USERS[email]}
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

# ========================
# Routes - Markets & Prices
# ========================

def _gen_price(symbol: str) -> Dict[str, Any]:
    random.seed(symbol)
    base = random.uniform(0.3, 2.0)
    if symbol == "BTC": base = 67542.30
    if symbol == "ETH": base = 3842.15
    change = random.uniform(-5, 5)
    price = max(0.01, base * (1 + change/100.0))
    sdg = price * USD_TO_SDG
    spark = [round(price * (1 + random.uniform(-0.02, 0.02)), 2) for _ in range(20)]
    return {
        "symbol": symbol,
        "name": dict(BASE_COINS).get(symbol, symbol),
        "priceUSD": round(price, 4),
        "priceSDG": round(sdg, 2),
        "change24h": round(change, 2),
        "icon": ICON_MAP.get(symbol, "●"),
        "spark": spark
    }

@app.get("/api/crypto/prices")
async def get_crypto_prices():
    coins = ["BTC", "ETH", "BNB", "ADA", "XRP"]
    data = [_gen_price(c) for c in coins]
    return {"prices": data, "lastUpdated": datetime.utcnow().isoformat(), "exchangeRate": {"USD_TO_SDG": USD_TO_SDG}}

@app.get("/api/markets/list")
async def markets_list(limit: int = 20):
    symbols = [s for s, _ in BASE_COINS][:max(1, min(limit, len(BASE_COINS)))]
    data = [_gen_price(s) for s in symbols]
    return {"markets": data, "count": len(data)}

@app.get("/api/markets/coin/{symbol}")
async def market_coin_detail(symbol: str):
    symbol = symbol.upper()
    if symbol not in dict(BASE_COINS):
        raise HTTPException(status_code=404, detail="Symbol not found")
    return {"coin": _gen_price(symbol)}

# ========================
# Routes - Orders (MVP)
# ========================

@app.post("/api/orders/quote")
async def create_quote(req: QuoteRequest, request: Request):
    if not req.amountUSD and not req.amountSDG:
        raise HTTPException(status_code=400, detail="Provide amountUSD or amountSDG")
    coin = _gen_price(req.symbol.upper())
    amountUSD = req.amountUSD if req.amountUSD is not None else (req.amountSDG / USD_TO_SDG)
    crypto_amount = round(amountUSD / coin["priceUSD"], 8)
    fee = round(amountUSD * 0.0075, 2)
    processing_fee = 0.5  # USD
    totalUSD = round(amountUSD + fee + processing_fee, 2)
    quote_id = str(uuid.uuid4())
    QUOTES[quote_id] = {
        "id": quote_id,
        "symbol": coin["symbol"],
        "amountUSD": amountUSD,
        "cryptoAmount": crypto_amount,
        "priceUSD": coin["priceUSD"],
        "feeUSD": fee,
        "processingFeeUSD": processing_fee,
        "totalUSD": totalUSD,
        "expiresAt": (datetime.utcnow() + timedelta(minutes=3)).isoformat()
    }
    return {"quote": QUOTES[quote_id], "slippage": 0.2}

@app.post("/api/orders/create")
async def create_order(req: CreateOrderRequest, request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    email = verify_jwt_token(auth.split(" ")[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    quote = QUOTES.get(req.quoteId)
    if not quote:
        raise HTTPException(status_code=400, detail="Invalid quoteId")
    order_id = str(uuid.uuid4())
    reference = f"NBX-{order_id[:8].upper()}"
    ORDERS[order_id] = {
        "id": order_id,
        "user": email,
        "symbol": quote["symbol"],
        "status": "PENDING_PAYMENT",
        "paymentMethod": req.paymentMethod,
        "reference": reference,
        "createdAt": datetime.utcnow().isoformat(),
        "amountUSD": quote["amountUSD"],
        "cryptoAmount": quote["cryptoAmount"],
        "priceUSD": quote["priceUSD"],
        "feeUSD": quote["feeUSD"],
        "processingFeeUSD": quote["processingFeeUSD"],
        "totalUSD": quote["totalUSD"],
        "bankInstructions": {
            "bank": "Bank of Khartoum",
            "accountName": "NubiX Trading LTD",
            "accountNumber": "123456789",
            "swift": "BOKHSudanXXX",
            "reference": reference
        }
    }
    return {"order": ORDERS[order_id]}

@app.post("/api/orders/confirm-payment")
async def confirm_payment(req: ConfirmPaymentRequest, request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    order = ORDERS.get(req.orderId)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Simulate processing
    order["status"] = "PROCESSING"
    order["paymentReference"] = req.reference or order["reference"]
    order["updatedAt"] = datetime.utcnow().isoformat()
    # Immediately complete for MVP
    order["status"] = "COMPLETED"
    order["completedAt"] = datetime.utcnow().isoformat()
    return {"order": order}

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str, request: Request):
    order = ORDERS.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": order}

@app.get("/api/transactions")
async def get_transactions(request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    email = verify_jwt_token(auth.split(" ")[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_orders = [o for o in ORDERS.values() if o.get("user") == email]
    user_orders.sort(key=lambda x: x.get("createdAt"), reverse=True)
    return {"transactions": user_orders}

# ========================
# Routes - KYC (MVP)
# ========================

@app.post("/api/kyc/submit-basic")
async def kyc_submit_basic(request: Request, fullName: str = Form(...), dob: str = Form(...), email: str = Form(...), phone: str = Form(...)):
    KYC_DATA[email] = KYC_DATA.get(email, {})
    KYC_DATA[email].update({
        "fullName": fullName,
        "dob": dob,
        "email": email,
        "phone": phone,
        "status": "under_review",
        "submittedAt": datetime.utcnow().isoformat()
    })
    # Update user status if exists
    if email in MOCK_USERS:
        MOCK_USERS[email]["kycStatus"] = "under_review"
    return {"message": "KYC basic submitted", "status": "under_review"}

@app.post("/api/kyc/upload")
async def kyc_upload(email: str = Form(...), fileType: str = Form(...), file: UploadFile = File(...)):
    # In MVP we don't store the file; just mark received
    entry = KYC_DATA.get(email, {"email": email, "status": "under_review"})
    files = entry.get("files", [])
    files.append({"fileType": fileType, "filename": file.filename, "size": file.size if hasattr(file, 'size') else None})
    entry["files"] = files
    entry["updatedAt"] = datetime.utcnow().isoformat()
    KYC_DATA[email] = entry
    return {"message": "File received", "files": files}

@app.get("/api/kyc/status")
async def kyc_status(email: str):
    entry = KYC_DATA.get(email)
    if not entry:
        return {"status": "not_started"}
    # Auto-approve quickly for MVP demo
    entry["status"] = entry.get("status", "under_review")
    if entry.get("files"):
        entry["status"] = "verified"
        if email in MOCK_USERS:
            MOCK_USERS[email]["kycStatus"] = "approved"
    return {"status": entry["status"], "submittedAt": entry.get("submittedAt"), "updatedAt": entry.get("updatedAt")}

# ========================
# Routes - Inbox (MVP)
# ========================

@app.get("/api/inbox/threads")
async def inbox_threads(request: Request):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    email = verify_jwt_token(auth.split(" ")[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    threads = [t for t in INBOX_THREADS.values() if t.get("user") == email]
    return {"threads": threads}

@app.post("/api/inbox/threads")
async def inbox_create_thread(request: Request, subject: str = Form(...), category: str = Form(...)):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    email = verify_jwt_token(auth.split(" ")[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    tid = str(uuid.uuid4())
    INBOX_THREADS[tid] = {"id": tid, "user": email, "subject": subject, "category": category, "messages": [
        {"id": str(uuid.uuid4()), "from": "system", "text": "Thanks for contacting Nubix. We'll get back to you shortly.", "createdAt": datetime.utcnow().isoformat()}
    ]}
    return {"thread": INBOX_THREADS[tid]}

@app.post("/api/inbox/threads/{thread_id}/messages")
async def inbox_post_message(thread_id: str, request: Request, text: str = Form(...)):
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    email = verify_jwt_token(auth.split(" ")[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    thread = INBOX_THREADS.get(thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    msg = {"id": str(uuid.uuid4()), "from": email, "text": text, "createdAt": datetime.utcnow().isoformat()}
    thread["messages"].append(msg)
    return {"message": msg}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)