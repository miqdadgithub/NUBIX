# NUBIX MVP Workspace

This repository contains the current minimum viable product for the NUBIX experience:

- A **Flutter** mobile client that runs completely offline with a mock authentication layer. User onboarding and sessions are persisted with `SharedPreferences` so returning users bypass the introduction screens.
- A **FastAPI** backend that exposes mock authentication, KYC and trading endpoints backed by a JSON data store with bcrypt-hashed passwords. One-time-password challenges return verification IDs and development codes so the Flutter and React clients can complete the flow without Firebase.
- A **React** web client that talks to the FastAPI service. The application reads `REACT_APP_BACKEND_URL` but falls back to `http://localhost:8001`, so local development works without additional configuration.

The codebase is intentionally scoped to showcase the product journey while making it easy to understand where real integrations still need to be added.

## One-command install + configure + run

If you want a single command that prepares dependencies, writes the web `.env`, and starts backend + frontend, run this from the repo root:

```bash
bash -lc '
set -e
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cd frontend
npm install
printf "REACT_APP_BACKEND_URL=http://localhost:8001\n" > .env
cd ..
(cd backend && source .venv/bin/activate && uvicorn server:app --host 0.0.0.0 --port 8001 --reload) &
(cd frontend && npm start)
'
```

Notes:
- Backend will run on `http://localhost:8001`.
- Frontend will run on `http://localhost:3000`.
- If you also want to run Flutter, open a second terminal and run:
  ```bash
  flutter pub get && flutter run
  ```

## Project structure

```
backend/      FastAPI mock API with persisted JSON storage
frontend/     React client that consumes the mock API
lib/          Flutter application source code
pubspec.yaml  Flutter dependencies (Firebase removed in favour of local mocks)
```

## Backend (FastAPI)

The API is a mock-only service. Data is stored in `backend/data_store.json`, so restarting the server keeps registered users, generated OTPs, quotes, orders, inbox threads and KYC submissions.

### Running locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Default credentials and OTPs

| Type        | Details                                   |
|-------------|-------------------------------------------|
| Email login | `test@nubix.com` / `123456`               |
| Admin login | `admin@nubix.com` / `admin123`            |
| Phone auth  | Any `+249` number. OTP is returned by API |

When you request a phone OTP (`/api/auth/phone/send-otp`) the response contains `verificationId`, `developmentOtp` and `expiresAt`. Send all three values to `/api/auth/phone/verify-otp` to complete the mock login.

## Flutter mobile client

Key behaviours:

- All Firebase packages were removed. `lib/core/services/auth_service.dart` now returns concrete `UserModel` instances from an in-app mock repository instead of `null` Firebase users.
- OTP requests return verification IDs that are passed through the router. Resend requests generate new IDs and development codes.
- Onboarding completion and authenticated sessions are saved with `SharedPreferences`. Relaunching the app skips onboarding when appropriate and restores the last signed-in user.

To run the Flutter app:

```bash
flutter pub get
flutter run  # Choose your preferred device
```

## React web client

The web client automatically targets the FastAPI backend at `http://localhost:8001`. To point to another host, create a `.env` file based on `.env.example` inside `frontend/`.

```bash
cd frontend
npm install
npm start
```

## Known limitations

- Authentication, KYC, trading and messaging endpoints are mock implementations designed for demos only.
- Cryptocurrency prices are generated locally; there is no real exchange integration.
- File uploads are accepted but not stored. KYC approvals are simulated.
- There is no production-ready database. The JSON file is intended for development use.

These constraints are documented here and in `RUNNING_STATUS.md` to set accurate expectations for stakeholders.
