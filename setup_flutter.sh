#!/bin/bash

echo "NUBIX Flutter Setup Script"
echo "========================="

# Check architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

# Set Flutter version and URL based on architecture
if [ "$ARCH" = "x86_64" ]; then
    FLUTTER_URL="https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.16.9-stable.tar.xz"
elif [ "$ARCH" = "aarch64" ]; then
    echo "ARM64 architecture detected. Flutter requires manual compilation for ARM64."
    echo "Please visit: https://github.com/flutter/flutter/wiki/Building-Flutter-on-ARM64"
    echo ""
    echo "Alternative: Use Flutter through Docker or install on x86_64 system"
    exit 1
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Download and install Flutter
echo "Downloading Flutter..."
cd /tmp
wget -q $FLUTTER_URL
tar xf flutter_linux_3.16.9-stable.tar.xz

# Move to /opt and set permissions
sudo mv flutter /opt/flutter
sudo chown -R $USER:$USER /opt/flutter

# Add to PATH
echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.bashrc
export PATH="$PATH:/opt/flutter/bin"

# Run flutter doctor
echo "Running flutter doctor..."
flutter doctor

# Setup Flutter project
cd /app
echo "Setting up Flutter project dependencies..."
flutter pub get

echo ""
echo "Flutter setup complete!"
echo "To run the Flutter app:"
echo "1. Connect an Android device or start an emulator"
echo "2. Run: flutter run"
echo ""
echo "For web version:"
echo "1. Run: flutter run -d chrome"