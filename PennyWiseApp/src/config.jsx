import Constants from "expo-constants";
const {server_API_URL} = Constants.expoConfig?.extra || {};
export const server_base_URL = server_API_URL || "http://localhost:5000";