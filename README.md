# PennyWise Frontend

## Overview 
They PennyWise FrontEnd is a React Native mobile application developed as part of the Orbital Project at the National University of Singapore(NUS). This repository contains the frontend code for a finance management app, featuring user authentication (login and registration screens) and a basic home screen. This app is built using Expo, React Navigation and Axios for API calls, with plans for future finance tracking features.

## Project Structure
Location: Frontend/Frontend/PennyWiseApp
Key Files:
App.js: Root component, integrates AuthProvider and navigation stack.
src/context/AuthContext.js: Manages authentication state using AsyncStorage for token storage.
src/navigation/AppNavigator.js: Defines the navigation stack (Login, Register, Home).
src/screens/LoginScreen.js: Login screen with email and password inputs.
src/screens/RegisterScreen.js: Registration screen for new users.
src/screens/HomeScreen.js: Basic home screen displaying the user token.
config.js: Contains BASE_URL for backend API (e.g., http://10.0.2.2:5000).

## Setup Instructions

### Prequisites
Node.js \n
Expo CLI (npm install -g expo-cli) \n
Andriod Studio (for emulator) \n
Backend server running (refer to backend README)

### Installation
1. Navigate to project directory \n
```cd "your path"\Frontend\PennyWise```
2. Install dependencies \n
```npm install```
```npm install expo-secure-store```
```npm install jwt-decode```
3. Start Expo Development Server \n
```npx expo start -c```
4. Open the Andriod emulator and press <a> to load the app.

## Features
1. Authentication Service
    - Login: Allows users to log in with email and password
    - Register: Allows new users to register with email and password
2. Home Page (Content Page)
3. Adding an Income/Expense Entry (to be saved in mongoDB database)

## Known Issues
1. TypeError: Invalid attempt to destructure non-iterable instance error in <App.js> (corrected using {} instead of [])
2. Reverted to default fonts due to rendering issues
