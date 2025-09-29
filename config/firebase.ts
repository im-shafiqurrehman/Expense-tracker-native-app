// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxgmr930lC8IKccaK3Y77-Qz_KFON8wWY",
  authDomain: "expense-tracker-app-1d498.firebaseapp.com",
  projectId: "expense-tracker-app-1d498",
  storageBucket: "expense-tracker-app-1d498.firebasestorage.app",
  messagingSenderId: "544666023196",
  appId: "1:544666023196:web:436eab01f5ff30adf776d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);
