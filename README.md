# NUBIX Flutter App

A comprehensive cryptocurrency trading application built for Sudanese users, enabling purchases with Sudanese Pounds (SDG) through Khartoum Bank's Bankak payment channel and Binance integration.

## 🚀 Features

- **Multi-Language Support**: Arabic (RTL) and English
- **Secure Authentication**: Phone, Email, 2FA, Biometric
- **KYC Integration**: Sumsub/Onfido with automated verification
- **Bank Integration**: Khartoum Bank/Bankak API + OCR fallback
- **Cryptocurrency Trading**: Binance integration with real-time data
- **Custodial Wallet**: Hot/cold storage with Cloud KMS
- **Low Bandwidth Optimized**: Efficient for challenging network conditions

## 🏗️ Architecture

- **Frontend**: Flutter (Android primary, iOS-ready)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions, Storage)
- **Security**: Google Cloud KMS, HMAC webhooks, TLS 1.3
- **Exchange**: Binance API with adapter pattern
- **KYC**: Sumsub/Onfido via webhooks

## 📱 Core Screens

1. **Splash & Onboarding**: Language selection, app introduction
2. **Authentication**: Phone/email registration, OTP, 2FA, biometric
3. **Home**: Balance display, portfolio, BUY CTA
4. **Buy Flow**: Coin selection, amount input, price calculator
5. **Deposits**: Bank instructions, Bankak deep-link, receipt upload
6. **KYC**: Document upload, selfie capture, status tracking
7. **Profile**: Security settings, transaction history, support

## 🔐 Security Features

- Multi-layer authentication system
- JWT tokens with automatic revocation
- HMAC-signed webhooks
- Certificate pinning
- PII redaction in logs
- Regular security audits

## 💰 Fee Structure

- **Default**: 0.75% of purchase amount + SDG 50 processing fee
- **Configurable**: Admin controls for per-coin and transaction type fees

## 🌍 Localization

- Complete Arabic RTL support
- Number formatting for Arabic locales
- Date/time formatting
- Currency display in Arabic numerals

## 📊 KYC Tiers

- **Level 1 (Basic)**: Daily limit SDG 5,000
- **Level 2 (Enhanced)**: Monthly limit SDG 100,000

## 🚀 Getting Started

### Prerequisites

- Flutter SDK 3.10.0+
- Dart SDK 3.0.0+
- Android Studio / VS Code
- Firebase project setup
- Binance API credentials
- Bankak API credentials

### Installation

1. Clone the repository
2. Install dependencies: `flutter pub get`
3. Configure Firebase: `flutterfire configure`
4. Set up environment variables
5. Run the app: `flutter run`

### Environment Setup

Create `.env` file with:
```
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret
BANKA_API_KEY=your_bankak_api_key
BANKA_SECRET=your_bankak_secret
SUMSUB_API_KEY=your_sumsub_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 🧪 Testing

- **Unit Tests**: `flutter test`
- **Widget Tests**: `flutter test test/widget_test/`
- **Integration Tests**: `flutter test integration_test/`
- **E2E Tests**: Complete user journey testing

## 📈 Monitoring

- Daily active users and transaction volume
- KYC approval rates and processing times
- Deposit success rates and time-to-credit
- Order execution success rates
- API response times and error rates

## 🔄 CI/CD

- Automated testing on PR creation
- Security scans and code quality checks
- Staged deployment (dev → staging → production)
- Firebase deployment automation
- APK signing and Play Store deployment

## 📋 Compliance

- Data protection with AES-256 encryption
- GDPR-compliant data handling
- Transaction monitoring and reporting
- Suspicious activity flagging
- Regulatory reporting capabilities

## 🎯 Success Metrics

- Closed beta (200-500 users) with 95%+ successful trades
- KYC automation handling 90%+ of clean documents
- Webhook deposits auto-crediting within 120 seconds
- Zero P0 security findings in penetration test
- Admin panel fully functional for operations team

## 📞 Support

For technical support or integration questions, contact the development team.

## 📄 License

This project is proprietary software. All rights reserved.
