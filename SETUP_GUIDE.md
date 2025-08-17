# NUBIX Flutter App Setup Guide

This guide will help you set up and run the NUBIX Flutter application on your development environment.

## Prerequisites

### Required Software
- **Flutter SDK**: 3.10.0 or higher
- **Dart SDK**: 3.0.0 or higher
- **Android Studio**: Latest version with Android SDK
- **VS Code**: Recommended editor with Flutter extension
- **Git**: For version control

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: At least 10GB free space
- **Network**: Stable internet connection for package downloads

## Installation Steps

### 1. Install Flutter SDK

#### Windows
```bash
# Download Flutter SDK from https://flutter.dev/docs/get-started/install/windows
# Extract to C:\flutter
# Add C:\flutter\bin to PATH environment variable
```

#### macOS
```bash
# Using Homebrew
brew install --cask flutter

# Or download manually from https://flutter.dev/docs/get-started/install/macos
```

#### Linux
```bash
# Download Flutter SDK from https://flutter.dev/docs/get-started/install/linux
# Extract to ~/flutter
# Add ~/flutter/bin to PATH in ~/.bashrc
```

### 2. Verify Flutter Installation
```bash
flutter doctor
```

Fix any issues reported by `flutter doctor` before proceeding.

### 3. Clone the Repository
```bash
git clone <repository-url>
cd nubix_app
```

### 4. Install Dependencies
```bash
flutter pub get
```

### 5. Setup Firebase

#### Install FlutterFire CLI
```bash
dart pub global activate flutterfire_cli
```

#### Configure Firebase Project
```bash
# Create a new Firebase project at https://console.firebase.google.com/
# Enable Authentication, Firestore, Storage, and Messaging

# Configure Flutter app
flutterfire configure

# This will generate firebase_options.dart with your project configuration
```

#### Update Firebase Configuration
Replace the placeholder values in `lib/firebase_options.dart` with your actual Firebase project details.

### 6. Setup Android Configuration

#### Update Application ID
In `android/app/build.gradle`, verify the application ID:
```gradle
applicationId "com.nubix.app"
```

#### Add Signing Configuration (for release builds)
Create `android/key.properties`:
```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=your_key_alias
storeFile=path_to_your_keystore_file
```

Uncomment the signing configuration in `android/app/build.gradle`.

#### Update Network Security Config
In `android/app/src/main/res/xml/network_security_config.xml`, add your actual certificate pins for production.

### 7. Setup iOS Configuration (if developing for iOS)

#### Update Bundle Identifier
In `ios/Runner.xcodeproj/project.pbxproj`, update the bundle identifier to `com.nubix.app`.

#### Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

## Configuration

### Environment Variables
Create a `.env` file in the project root:
```env
# API Configuration
API_BASE_URL=https://api.nubix.app
BINANCE_API_URL=https://api.binance.com
BANKA_API_URL=https://api.bankak.com

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key

# Development Settings
ENABLE_MOCK_SERVICES=true
ENABLE_DEBUG_LOGGING=true
```

### Mock Services Configuration
For development and testing, the app includes mock services. Configure them in `lib/core/utils/constants.dart`:
```dart
// Development Settings
static const bool isDevelopment = true;
static const bool enableMockServices = true;
static const bool enableDebugLogging = true;
```

## Running the App

### Development Mode
```bash
# Run on connected device/emulator
flutter run

# Run with specific flavor
flutter run --flavor development

# Run with hot reload
flutter run --hot
```

### Build APK
```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# Split APKs by architecture
flutter build apk --split-per-abi --release
```

### Build App Bundle (for Play Store)
```bash
flutter build appbundle --release
```

## Project Structure

```
nubix_app/
├── lib/
│   ├── core/                 # Core app functionality
│   │   ├── models/          # Data models
│   │   ├── providers/       # State management
│   │   ├── services/        # Business logic services
│   │   ├── theme/           # App theming
│   │   ├── utils/           # Utility functions
│   │   └── widgets/         # Reusable widgets
│   ├── features/            # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── home/            # Home screen
│   │   ├── buy/             # Buy flow
│   │   ├── kyc/             # KYC process
│   │   ├── profile/         # User profile
│   │   └── deposit/         # Deposit flow
│   └── main.dart            # App entry point
├── assets/                   # App assets
│   ├── logos/               # Logo files
│   ├── fonts/               # Font files
│   ├── images/              # Image files
│   └── translations/        # Localization files
├── android/                  # Android-specific code
├── ios/                     # iOS-specific code
└── test/                    # Test files
```

## Testing

### Unit Tests
```bash
flutter test
```

### Widget Tests
```bash
flutter test test/widget_test/
```

### Integration Tests
```bash
flutter test integration_test/
```

### Test Coverage
```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

## Common Issues and Solutions

### 1. Flutter Doctor Issues
- **Android SDK not found**: Install Android Studio and configure Android SDK
- **Xcode not found**: Install Xcode (macOS only)
- **Flutter version mismatch**: Update Flutter to latest stable version

### 2. Build Issues
- **Gradle sync failed**: Clean and rebuild project
- **Firebase configuration error**: Verify firebase_options.dart configuration
- **Permission denied**: Check file permissions and Android manifest

### 3. Runtime Issues
- **App crashes on startup**: Check Firebase configuration and network permissions
- **Authentication not working**: Verify Firebase Authentication setup
- **Images not loading**: Check asset paths and Firebase Storage configuration

### 4. Performance Issues
- **Slow app startup**: Enable R8/ProGuard optimization
- **Memory leaks**: Check for proper disposal of controllers and listeners
- **Network timeouts**: Adjust timeout values in API services

## Development Workflow

### 1. Feature Development
1. Create feature branch from `develop`
2. Implement feature with tests
3. Update documentation
4. Create pull request

### 2. Code Quality
- Follow Flutter style guide
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure proper error handling

### 3. Testing Strategy
- Write unit tests for business logic
- Test UI components with widget tests
- Perform integration testing for user flows
- Test on multiple devices and screen sizes

### 4. Performance Monitoring
- Monitor app startup time
- Check memory usage
- Monitor network requests
- Test on low-end devices

## Deployment

### Pre-release Checklist
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Accessibility compliance verified
- [ ] Localization complete
- [ ] App signing configured
- [ ] Release notes prepared

### Play Store Deployment
1. Build release app bundle
2. Test on multiple devices
3. Upload to Play Console
4. Complete store listing
5. Submit for review

### Production Configuration
- Disable debug logging
- Enable production APIs
- Configure certificate pinning
- Set up monitoring and analytics
- Configure crash reporting

## Support and Resources

### Documentation
- [Flutter Documentation](https://flutter.dev/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Material Design Guidelines](https://material.io/design)

### Community
- [Flutter Community](https://flutter.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/flutter)
- [Flutter Discord](https://discord.gg/flutter)

### Tools
- [Flutter Inspector](https://flutter.dev/docs/development/tools/inspector)
- [Flutter Performance](https://flutter.dev/docs/development/tools/devtools/performance)
- [Flutter DevTools](https://flutter.dev/docs/development/tools/devtools)

## Troubleshooting

### Debug Mode
```bash
# Enable verbose logging
flutter run --verbose

# Check device logs
flutter logs

# Analyze app size
flutter build apk --analyze-size
```

### Performance Profiling
```bash
# Profile app performance
flutter run --profile

# Check for memory leaks
flutter run --trace-startup
```

### Network Debugging
- Use Charles Proxy or Fiddler for network inspection
- Enable network logging in debug mode
- Check Firebase console for authentication issues

## Next Steps

After setting up the development environment:

1. **Explore the codebase** to understand the architecture
2. **Run the app** on a device or emulator
3. **Review the features** and test user flows
4. **Set up your IDE** with Flutter extensions
5. **Configure debugging** tools and breakpoints
6. **Start developing** new features or fixing issues

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is proprietary software. All rights reserved.

---

For additional support or questions, please contact the development team or create an issue in the repository.
