from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

JWT_SECRET = 'nubix-secret-key-2024'

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

def create_jwt_token(email):
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("email")
    except:
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "NUBIX API is running"})

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = MOCK_USERS.get(email)
    if not user or user["password"] != password:
        return jsonify({"detail": "Invalid credentials"}), 401
    
    token = create_jwt_token(email)
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "email": email,
            "fullName": user["fullName"],
            "phoneNumber": user.get("phoneNumber"),
            "kycStatus": user.get("kycStatus", "not_started"),
            "balance": user.get("balance", 0.0)
        }
    })

@app.route('/api/crypto/prices', methods=['GET'])
def get_crypto_prices():
    return jsonify({
        "prices": MOCK_CRYPTO_PRICES,
        "lastUpdated": datetime.utcnow().isoformat(),
        "exchangeRate": {
            "USD_TO_SDG": 4000,
            "description": "1 USD = 4,000 SDG (Sudanese Pounds)"
        }
    })

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    authorization = request.headers.get("Authorization")
    
    if not authorization or not authorization.startswith("Bearer "):
        return jsonify({"detail": "Authentication required"}), 401
    
    token = authorization.split(" ")[1]
    email = verify_jwt_token(token)
    
    if not email:
        return jsonify({"detail": "Invalid or expired token"}), 401
    
    user = MOCK_USERS.get(email)
    if not user:
        return jsonify({"detail": "User not found"}), 404
    
    return jsonify({
        "user": {
            "email": email,
            "fullName": user["fullName"],
            "phoneNumber": user.get("phoneNumber"),
            "kycStatus": user.get("kycStatus", "not_started"),
            "balance": user.get("balance", 0.0),
            "createdAt": user.get("createdAt")
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001, debug=False)