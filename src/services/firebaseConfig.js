import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB_QSokbotT3uhYTSPp_dFSWUrKm5wfxdQ",
  authDomain: "budgetease-d27ca.firebaseapp.com",
  databaseURL: "https://budgetease-d27ca.firebaseio.com",
  projectId: "budgetease-d27ca",
  storageBucket: "budgetease-d27ca.firebasestorage.app",
  messagingSenderId: "874627671403",
  appId: "1:874627671403:android:e4e1db9f970f603889182e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
