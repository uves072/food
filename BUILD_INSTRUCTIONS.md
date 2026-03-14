# How to Build & Install APK Without Play Store

## Option 1: Build APK using EAS Build (Expo's Build Service)

### Prerequisites:
```bash
npm install -g eas-cli
eas login
```

### Step 1: Configure EAS Build
```bash
cd /app/frontend
eas build:configure
```

### Step 2: Build Android APK
```bash
# Build APK (not AAB, so you can install directly)
eas build --platform android --profile preview

# Wait 10-20 minutes for build to complete
# You'll get a download link for the APK
```

### Step 3: Install APK
1. Download APK from the link provided
2. Transfer to your Android phone
3. Enable "Install from Unknown Sources" in phone settings
4. Tap the APK file to install
5. Open and use!

---

## Option 2: Build Locally (Faster but requires Android Studio)

### Prerequisites:
- Install Android Studio
- Install Java JDK

### Build Command:
```bash
cd /app/frontend

# Generate Android build
npx expo run:android --variant release

# This creates an APK in:
# android/app/build/outputs/apk/release/app-release.apk
```

### Install:
```bash
# Install via ADB (if phone is connected)
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## Option 3: For iPhone (TestFlight)

### Using EAS Build:
```bash
cd /app/frontend

# Build for iOS
eas build --platform ios --profile preview

# This creates an IPA file
# You can distribute via TestFlight (requires Apple Developer account)
```

---

## Easiest Method Summary:

**For Quick Testing:**
1. Install **Expo Go** app from your app store
2. Scan QR code from: `https://food-queue-sys.preview.emergentagent.com`
3. Done! App runs on your phone

**For Standalone App:**
1. Run: `eas build --platform android --profile preview`
2. Download APK from link
3. Install APK on Android phone
4. Use like any normal app!

---

## Current Access Methods:

### 1️⃣ **Expo Go (No Build Needed)**
- Install Expo Go app
- Scan QR code
- ✅ Works immediately

### 2️⃣ **Web Browser (No Build Needed)**
- Open: https://food-queue-sys.preview.emergentagent.com
- ✅ Works on any device

### 3️⃣ **APK Build (One-time Setup)**
- Build APK once
- Install on Android phones
- ✅ Standalone app

### 4️⃣ **Internal Distribution**
- Share APK file directly
- Users install manually
- ✅ No Play Store needed

---

## Sharing with Restaurant Staff:

**Option A: Expo Go (Easiest)**
1. Ask staff to install Expo Go
2. Share QR code or URL
3. They scan and use

**Option B: APK Distribution**
1. Build APK once
2. Share APK file (via Google Drive, email, etc.)
3. Staff install on their phones
4. Works offline after first load

**Option C: Web Version**
1. Share URL: https://food-queue-sys.preview.emergentagent.com
2. Staff bookmark on home screen
3. Works like an app

---

## Production Deployment (Optional)

If you want to eventually publish:

### Google Play Store:
```bash
eas build --platform android --profile production
# Upload AAB to Play Console
```

### Apple App Store:
```bash
eas build --platform ios --profile production
# Upload to App Store Connect
```

---

## Notes:

- **Expo Go:** Free, instant, perfect for testing
- **APK Build:** Free, requires one-time setup
- **Play Store:** Requires $25 one-time fee (Google) or $99/year (Apple)
- **Web Version:** Free, works everywhere

**Recommendation:** Start with Expo Go for testing, then build APK when ready for staff use.
