# NubiX

## Overview

NubiX is a mobile-first cryptocurrency purchase platform prototype for the Sudanese market. Users buy BTC, ETH, and BNB with Sudanese Pounds (SDG) via Bank of Khartoum transfers. Built as an Expo React Native app with web preview.

## Stack

- pnpm workspace monorepo
- Expo Router 6 (file-based routing)
- React Native + Reanimated + expo-clipboard
- DM Serif Display (headlines), DM Sans (UI), Space Mono (numbers)
- Brand palette: Navy `#0B2D4D`, Gold `#C99A2E`, Ivory `#FAF2E6`

## Artifacts

- `artifacts/nubix` (mobile, slug `nubix`, port 23992) — main NubiX app
- `artifacts/api-server` (api) — placeholder
- `artifacts/mockup-sandbox` (design) — Canvas component sandbox

## NubiX architecture

All 21 screens live flat under `artifacts/nubix/app/`:
splash (`index`) → onboarding → signin / forgot-password → otp →
kyc-overview → kyc-personal → kyc-id-upload → kyc-selfie → kyc-approved →
home / markets / coin-detail → buy-step1..4 → orders → profile → support.

Data is mocked in `data/mockData.ts`. Auth/KYC state lives in `context/AuthContext.tsx` (in-memory).
The custom `BottomNav` component is mounted directly on Home/Markets/Orders/Profile (not via expo-router tabs).
`PhoneFrame` wraps the app on web only, centering it in a 375px phone shell.
OTP demo code: `123456`.
