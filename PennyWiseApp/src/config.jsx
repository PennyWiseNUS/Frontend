import Constants from'expo-constants';

// storeClient is for deploying in expo go, check standAlone for APK
isDeployment = Constants.executionEnvironment === "storeClient";
// alias for the host machine
export const server_base_URL = isDeployment
    ? "https://backend-1-j18w.onrender.com"
    : "http://10.0.2.2:5000";
console.log("Base URL being used:", server_base_URL);