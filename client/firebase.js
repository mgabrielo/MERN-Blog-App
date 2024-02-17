// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-app-fcec4.firebaseapp.com",
    projectId: "mern-blog-app-fcec4",
    storageBucket: "mern-blog-app-fcec4.appspot.com",
    messagingSenderId: "337118796011",
    appId: import.meta.env.VITE_FIREBASE_API_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);