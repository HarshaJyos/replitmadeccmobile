import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBvVyEfKX7m3iecxYoTZT-11G8UFp0LT0",
  authDomain: "syamapp-955e0.firebaseapp.com",
  projectId: "syamapp-955e0",
  storageBucket: "syamapp-955e0.firebasestorage.app",
  messagingSenderId: "599757311255",
  appId: "1:599757311255:web:611944a900e2351bdf7b52",
  measurementId: "G-8V6WTSQGMT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth, firebaseConfig };
