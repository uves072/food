# Android APK बनाने की Complete Guide

## Method 1: EAS Build (सबसे आसान - Recommended) ⭐

### Prerequisites:
```bash
# EAS CLI install करें
npm install -g eas-cli

# Expo account बनाएं (free)
eas login
```

### Step 1: Project Configure करें
```bash
cd /app/frontend

# EAS Build configure करें
eas build:configure
```

यह `eas.json` file बनाएगा।

### Step 2: APK Build करें
```bash
# Production APK build करें
eas build --platform android --profile production

# या Preview APK build करें (testing के लिए)
eas build --platform android --profile preview
```

**Build time:** 10-15 minutes

**Output:** Download link मिलेगा APK file का

### Step 3: APK Download & Install करें
1. Build complete होने पर link मिलेगा
2. APK download करें
3. अपने phone में transfer करें
4. "Install from Unknown Sources" enable करें
5. APK install करें

---

## Method 2: Android Studio से Local Build (Advanced)

### Prerequisites:
1. **Android Studio** install करें: https://developer.android.com/studio
2. **Java JDK** install करें (version 11 या 17)
3. **Environment Variables** set करें

### Step 1: Environment Variables Setup

**Windows:**
```bash
# System Environment Variables में add करें:
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17

# Path में add करें:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%JAVA_HOME%\bin
```

**Mac/Linux:**
```bash
# ~/.bashrc या ~/.zshrc में add करें:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

### Step 2: Native Android Project Generate करें
```bash
cd /app/frontend

# Prebuild - native code generate करता है
npx expo prebuild --platform android

# या clean prebuild
npx expo prebuild --platform android --clean
```

यह `/app/frontend/android` folder बनाएगा।

### Step 3: Android Studio में Open करें

1. **Android Studio** खोलें
2. **"Open an Existing Project"** select करें
3. Navigate करें: `/app/frontend/android`
4. Project open हो जाएगा

### Step 4: Gradle Sync करें
- Android Studio में project open होने के बाद
- **File → Sync Project with Gradle Files**
- Wait करें sync complete होने तक (5-10 minutes पहली बार)

### Step 5: APK Build करें

#### Option A: Android Studio से (GUI)
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait करें build complete होने तक
3. Success notification में **"locate"** click करें
4. APK मिलेगा: `android/app/build/outputs/apk/release/app-release.apk`

#### Option B: Command Line से
```bash
cd /app/frontend/android

# Debug APK (testing के लिए)
./gradlew assembleDebug

# Release APK (production के लिए)
./gradlew assembleRelease

# या Windows में:
gradlew.bat assembleRelease
```

**APK Location:**
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

---

## Method 3: Expo से Direct Build (सबसे Fast)

```bash
cd /app/frontend

# Development build (testing)
npx expo run:android

# Release build
npx expo run:android --variant release
```

**APK Location:** 
`android/app/build/outputs/apk/release/app-release.apk`

---

## 🔧 Step-by-Step: Complete Process (Detailed)

### Step 1: Prerequisites Install करें

#### 1.1 Node.js & npm
```bash
# Check version
node --version
npm --version

# अगर नहीं है तो install करें
# https://nodejs.org/
```

#### 1.2 Android Studio Install
1. Download: https://developer.android.com/studio
2. Install करें (सभी components select करें)
3. Android SDK install करें:
   - Open Android Studio
   - **More Actions → SDK Manager**
   - Install: Android SDK Platform 33 या 34
   - Install: Android SDK Build-Tools
   - Install: Android SDK Platform-Tools

#### 1.3 Java JDK
```bash
# Java version check करें
java -version

# अगर नहीं है तो download करें:
# https://www.oracle.com/java/technologies/downloads/
# Install JDK 17 (recommended)
```

### Step 2: Project Setup

```bash
# Project directory में जाएं
cd /app/frontend

# Dependencies install करें
yarn install

# Expo CLI update करें
npm install -g expo-cli@latest

# EAS CLI install करें (optional)
npm install -g eas-cli
```

### Step 3: Native Code Generate करें

```bash
cd /app/frontend

# Android native code generate करें
npx expo prebuild --platform android

# Output:
# ✔ Created native Android project.
# android folder बन जाएगा
```

### Step 4: Android Studio में Build करें

1. **Android Studio खोलें**

2. **Open Project:**
   - File → Open
   - Select: `/app/frontend/android`
   - Click "OK"

3. **Wait for Gradle Sync:**
   - Bottom right में sync progress दिखेगा
   - First time में 10-15 minutes लग सकता है
   - Dependencies download होंगे

4. **Build APK:**
   - Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - या Toolbar में: **Build → Build APK**
   
5. **Build Success:**
   - Notification आएगा: "APK(s) generated successfully"
   - Click "locate" या "Show in Explorer"
   - APK path: `app/build/outputs/apk/release/app-release.apk`

6. **APK File:**
   - File size: 50-80 MB (approx)
   - अब इसे phone में install कर सकते हैं

### Step 5: APK को Sign करें (Production के लिए)

#### Generate Keystore
```bash
cd /app/frontend/android/app

# Keystore generate करें
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Password enter करें (याद रखें!)
# Details fill करें (name, organization, etc.)
```

#### Configure Signing

**File: `/app/frontend/android/app/build.gradle`**

Add करें:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'my-key-alias'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Build Signed APK
```bash
cd /app/frontend/android

# Signed release APK
./gradlew assembleRelease

# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Quick Commands Cheat Sheet

```bash
# 1. Generate native code
npx expo prebuild --platform android

# 2. Build APK (command line)
cd android && ./gradlew assembleRelease

# 3. या Direct expo command
npx expo run:android --variant release

# 4. या EAS build (online)
eas build --platform android --profile production
```

---

## 📦 APK Install करने के तरीके

### Method 1: USB से Transfer
1. APK को USB cable से phone में copy करें
2. File manager open करें
3. APK file पर tap करें
4. "Install" tap करें

### Method 2: WhatsApp/Email
1. APK file को WhatsApp/Email से भेजें
2. Phone में receive करें
3. Download करें और install करें

### Method 3: Google Drive
1. APK को Google Drive पर upload करें
2. Phone से drive open करें
3. APK download और install करें

---

## ⚠️ Common Issues & Solutions

### Issue 1: "ANDROID_HOME not set"
**Solution:**
```bash
# Windows
setx ANDROID_HOME "C:\Users\YourName\AppData\Local\Android\Sdk"

# Mac/Linux
export ANDROID_HOME=$HOME/Android/Sdk
```

### Issue 2: "SDK not found"
**Solution:**
- Android Studio खोलें
- Tools → SDK Manager
- Android SDK Platform 33/34 install करें

### Issue 3: "Java not found"
**Solution:**
- JDK 17 install करें
- JAVA_HOME set करें

### Issue 4: Gradle build fail
**Solution:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

### Issue 5: "unsigned APK"
**Solution:**
- Keystore generate करें (ऊपर देखें)
- build.gradle में signing config add करें

---

## 📊 Build Comparison

| Method | Time | Difficulty | Best For |
|--------|------|------------|----------|
| EAS Build | 15 min | Easy ⭐ | Quick testing |
| Android Studio | 30-60 min | Medium | Full control |
| Expo CLI | 20 min | Medium | Development |

---

## 🚀 Recommended Approach

### For Testing:
```bash
# सबसे fast
eas build --platform android --profile preview
```

### For Production:
```bash
# Android Studio से signed APK
cd /app/frontend
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

---

## 📱 Final APK Details

**Size:** 50-80 MB  
**Min Android:** 5.0 (API 21)  
**Target Android:** 13 (API 33)  
**Architecture:** arm64-v8a, armeabi-v7a, x86, x86_64

---

## ✅ Testing Checklist

After building APK:
- [ ] Install on physical device
- [ ] Test customer flow (menu, cart, order)
- [ ] Test admin login
- [ ] Test real-time order updates
- [ ] Test image upload
- [ ] Test offline behavior

---

## 📝 Notes

1. **First build** में time लगेगा (dependencies download)
2. **Release APK** production के लिए sign करना जरूरी है
3. **Debug APK** testing के लिए काफी है
4. **EAS Build** सबसे आसान है beginners के लिए

---

## 🔗 Useful Links

- Android Studio: https://developer.android.com/studio
- Expo Docs: https://docs.expo.dev/build/setup/
- EAS Build: https://docs.expo.dev/build/introduction/
- Signing APK: https://reactnative.dev/docs/signed-apk-android
