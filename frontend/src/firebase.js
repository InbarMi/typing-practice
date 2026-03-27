import {initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyD6wl4E7UteuzsNBXTE_4hAY0SzwbUXqUU",
    authDomain: "typing-practice-5c463.firebaseapp.com",
    projectId: "typing-practice-5c463",
    storageBucket: "typing-practice-5c463.firebasestorage.app",
    messagingSenderId: "314546393246",
    appId: "1:314546393246:web:ae53a613d92fe3dac32b8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);