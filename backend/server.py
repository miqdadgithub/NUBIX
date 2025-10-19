from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import json
from pathlib import Path
from datetime import datetime, timedelta
import jwt
import bcrypt
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
    verificationId: str

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
# Data persistence
# ========================

DATA_FILE = Path(os.getenv('NUBIX_DATA_FILE', Path(__file__).with_name('data_store.json')))


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except ValueError:
        return False


def _looks_hashed(value: str) -> bool:
    return value.startswith('$2') and len(value) > 20


def _default_users() -> Dict[str, Dict[str, Any]]:
    base_timestamp = "2024-01-01T00:00:00Z"
    return {
        "test@nubix.com": {
            "id": "user-test",
            "email": "test@nubix.com",
            "password": hash_password("123456"),
            "fullName": "Test User",
            "phoneNumber": "+249123456789",
            "kycStatus": "pending",
            "balance": 0.0,
            "createdAt": base_timestamp,
            "lastLogin": base_timestamp,
        },
        "admin@nubix.com": {
            "id": "user-admin",
            "email": "admin@nubix.com",
            "password": hash_password("admin123"),
            "fullName": "Admin User",
            "phoneNumber": "+249987654321",
            "kycStatus": "approved",
            "balance": 50000.0,
            "createdAt": base_timestamp,
            "lastLogin": base_timestamp,
        },
    }


def _default_data() -> Dict[str, Any]:
    return {
        "users": _default_users(),
        "quotes": {},
        "orders": {},
        "kyc": {},
        "inbox": {},
        "pendingOtps": {},
    }


def _load_data() -> Dict[str, Any]:
    data = _default_data()
    if DATA_FILE.exists():
        try:
            with DATA_FILE.open('r', encoding='utf-8') as f:
                loaded = json.load(f)
            if isinstance(loaded, dict):
                for key in data.keys():
                    if key in loaded and isinstance(loaded[key], dict):
                        data[key] = loaded[key]
        except Exception:
            pass

    users = data.get("users", {})
    for email, info in list(users.items()):
        password = info.get("password")
        if isinstance(password, str) and not _looks_hashed(password):
            info["password"] = hash_password(password)
        info.setdefault("email", email)
        info.setdefault("id", f"user-{uuid.uuid4()}")
        info.setdefault("createdAt", datetime.utcnow().isoformat())
    data["users"] = users
    data.setdefault("quotes", {})
    data.setdefault("orders", {})
    data.setdefault("kyc", {})
    data.setdefault("inbox", {})
    data.setdefault("pendingOtps", {})
    return data


def _save_data(payload: Dict[str, Any]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open('w', encoding='utf-8') as f:
        json.dump(payload, f, indent=2)


DATA = _load_data()
MOCK_USERS: Dict[str, Dict[str, Any]] = DATA["users"]
QUOTES: Dict[str, Dict[str, Any]] = DATA["quotes"]
ORDERS: Dict[str, Dict[str, Any]] = DATA["orders"]
KYC_DATA: Dict[str, Dict[str, Any]] = DATA["kyc"]
INBOX_THREADS: Dict[str, Dict[str, Any]] = DATA["inbox"]
PENDING_OTPS: Dict[str, Dict[str, Any]] = DATA["pendingOtps"]


def save_data() -> None:
    _save_data({
        "users": MOCK_USERS,
        "quotes": QUOTES,
        "orders": ORDERS,
        "kyc": KYC_DATA,
        "inbox": INBOX_THREADS,
        "pendingOtps": PENDING_OTPS,
    })


# Ensure the storage file exists with the normalized defaults
save_data()


BASE_COINS = [
    ("BTC", "Bitcoin"), ("ETH", "Ethereum"), ("BNB", "Binance Coin"), ("ADA", "Cardano"), ("XRP", "XRP"),
    ("SOL", "Solana"), ("DOGE", "Dogecoin"), ("DOT", "Polkadot"), ("LTC", "Litecoin"), ("LINK", "Chainlink"),
    ("MATIC", "Polygon"), ("TON", "Toncoin"), ("TRX", "TRON"), ("ATOM", "Cosmos"), ("AVAX", "Avalanche"),
    ("XLM", "Stellar"), ("APT", "Aptos"), ("ARB", "Arbitrum"), ("OP", "Optimism"), ("SUI", "Sui")
]

ICON_MAP = {"BTC": "₿", "ETH": "Ξ", "BNB": "⬡", "ADA": "₳", "XRP": "X", "LTC": "Ł", "DOT": "●", "LINK": "🔗", "XLM": "🌟", "SOL": "◎", "DOGE": "Ð", "ATOM": "⚛"}

USD_TO_SDG = 4000

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
    timestamp = datetime.utcnow().isoformat()
    MOCK_USERS[user_data.email] = {
        "id": f"user-{uuid.uuid4()}",
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "fullName": user_data.fullName,
        "phoneNumber": user_data.phoneNumber,
        "kycStatus": "not_started",
        "balance": 0.0,
        "createdAt": timestamp,
        "lastLogin": timestamp,
    }
    save_data()
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
    if not user or not verify_password(user_data.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user["lastLogin"] = datetime.utcnow().isoformat()
    save_data()
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
    if not phone_data.phoneNumber.startswith('+'):
        raise HTTPException(status_code=400, detail="Phone number must include country code")
    verification_id = str(uuid.uuid4())
    otp = f"{random.randint(100000, 999999):06d}"
    expires_at = (datetime.utcnow() + timedelta(minutes=5)).isoformat()
    PENDING_OTPS[verification_id] = {
        "phoneNumber": phone_data.phoneNumber,
        "otp": otp,
        "expiresAt": expires_at,
    }
    save_data()
    return {
        "message": "OTP sent successfully",
        "verificationId": verification_id,
        "developmentOtp": otp,
        "expiresAt": expires_at,
    }

@app.post("/api/auth/phone/verify-otp")
async def verify_phone_otp(otp_data: OTPVerification):
    pending = PENDING_OTPS.get(otp_data.verificationId)
    if not pending or pending.get("phoneNumber") != otp_data.phoneNumber:
        raise HTTPException(status_code=400, detail="Invalid or expired verification request")

    expires_at_str = pending.get("expiresAt")
    if expires_at_str:
        try:
            expires_at = datetime.fromisoformat(expires_at_str)
            if datetime.utcnow() > expires_at:
                PENDING_OTPS.pop(otp_data.verificationId, None)
                save_data()
                raise HTTPException(status_code=400, detail="Verification code expired")
        except ValueError:
            pass

    if pending.get("otp") != otp_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    PENDING_OTPS.pop(otp_data.verificationId, None)

    phone_user_email = None
    user_record = None
    for email, user in MOCK_USERS.items():
        if user.get("phoneNumber") == otp_data.phoneNumber:
            phone_user_email = email
            user_record = user
            break

    now_iso = datetime.utcnow().isoformat()

    if not user_record:
        phone_user_email = f"user_{otp_data.phoneNumber.replace('+', '').replace(' ', '')}@nubix.com"
        user_record = {
            "id": f"user-{uuid.uuid4()}",
            "email": phone_user_email,
            "password": hash_password("temp123"),
            "fullName": "Phone User",
            "phoneNumber": otp_data.phoneNumber,
            "kycStatus": "not_started",
            "balance": 0.0,
            "createdAt": now_iso,
            "lastLogin": now_iso,
        }
        MOCK_USERS[phone_user_email] = user_record
    else:
        user_record["lastLogin"] = now_iso

    save_data()

    token = create_jwt_token(phone_user_email)
    return {
        "message": "Phone verification successful",
        "token": token,
        "user": {
            "email": phone_user_email,
            "fullName": user_record.get("fullName", "Phone User"),
            "phoneNumber": user_record.get("phoneNumber"),
            "kycStatus": user_record.get("kycStatus", "not_started"),
            "balance": user_record.get("balance", 0.0)
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
    save_data()
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
    save_data()
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
    save_data()
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
    save_data()
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
    save_data()
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
    save_data()
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
    save_data()
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
    save_data()
    return {"message": msg}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)