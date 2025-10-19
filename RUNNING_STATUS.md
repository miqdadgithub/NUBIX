# NUBIX Application – Running Status

_Last updated: Mock-focused MVP_ 

## Summary

| Component          | Status      | Notes |
|--------------------|-------------|-------|
| FastAPI backend    | ✅ Running   | Mock API with hashed passwords and JSON persistence (`backend/data_store.json`). |
| React web client   | ✅ Running   | Uses `REACT_APP_BACKEND_URL` (defaults to `http://localhost:8001`). |
| Flutter mobile app | ⚠️ Build locally | Works with the in-app mock auth service; Firebase integrations removed. |

## Backend details

- Commands:
  ```bash
  cd backend
  python -m venv .venv
  source .venv/bin/activate  # Windows: .venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn server:app --reload --host 0.0.0.0 --port 8001
  ```
- Passwords are hashed with bcrypt. Default demo users:
  - `test@nubix.com` / `123456`
  - `admin@nubix.com` / `admin123`
- Phone OTP flow:
  - POST `/api/auth/phone/send-otp` → returns `verificationId`, `developmentOtp`, `expiresAt`.
  - POST `/api/auth/phone/verify-otp` with the three values to finish login.
- Orders, quotes, KYC submissions and inbox threads are stored in `backend/data_store.json` so they survive restarts.
- MongoDB, Binance and Bank integrations are **not** implemented. Endpoints respond with curated mock data only.

## Flutter application

- Firebase dependencies were removed. `SharedPreferences` now stores onboarding completion and user sessions.
- OTP flows use the mock repository that surfaces verification IDs and dev codes directly to the UI.
- To run:
  ```bash
  flutter pub get
  flutter run
  ```
  (Use a local Flutter environment; CI images in this workspace do not include the SDK.)

## React client

- Located in `frontend/`.
- `.env.example` documents the only required variable. The app defaults to `http://localhost:8001` so a `.env` file is optional.
- Commands:
  ```bash
  cd frontend
  npm install
  npm start
  ```

## Known limitations / next steps

- All authentication, trading, KYC and messaging flows are mock implementations for demonstration purposes.
- No production database or messaging infrastructure is connected; the JSON store is for local development only.
- Screens and API responses intentionally return static or randomly generated data. Replace with real integrations as the product matures.
