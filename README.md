# PennyWise Frontend

## Overview 
The **PennyWise Frontend** is a React Native mobile application developed as part of the *Orbital Project* at the National University of Singapore (NUS). This repository contains the frontend code for a finance management app, featuring user authentication (login and registration screens) and a basic home screen. The app is built using **Expo**, **React Navigation**, and **Axios** for API calls, with plans for future finance tracking features.

---

## Project Structure

**Location**: `Frontend/Frontend/PennyWiseApp`

**Key Files:**
- `App.js`: Root component, integrates `AuthProvider` and navigation stack.
- `src/context/AuthContext.js`: Manages authentication state using AsyncStorage for token storage.
- `src/navigation/AppNavigator.js`: Defines the navigation stack (Login, Register, Home).
- `src/screens/LoginScreen.js`: Login screen with email and password inputs.
- `src/screens/RegisterScreen.js`: Registration screen for new users.
- `src/screens/HomeScreen.js`: Basic home screen displaying the user token.
- `config.js`: Contains `BASE_URL` for backend API (e.g., `http://10.0.2.2:5000`).

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/)
- Expo CLI  
```bash
npm install -g expo-cli
```

### Installation
1. Navigate to project directory
```bash
cd "your path"/frontend/PennyWise
```

2. Install dependencies
```bash
npm install
npm install expo-secure-store
npm install jwt-decode
npm install react-native-chart-kit react-native-svg
```

3. Start Expo Development Server
If on Expo Go, Press **s** to switch to development build.

4. Open the andriod emulator and press **a** in the terminal to load the app.
