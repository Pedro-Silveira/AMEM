import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: ".appspot.com",
  messagingSenderId: "",
  appId: "1::web:1f9bcd2474a53c57a85880",
  databaseURL: "https://-default-rtdb.firebaseio.com",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase();