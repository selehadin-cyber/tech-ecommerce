import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmPSNjzsrii7nU9tjZynYhCYwpGMyR_gI",
  authDomain: "ihsan-store.firebaseapp.com",
  projectId: "ihsan-store",
  storageBucket: "ihsan-store.appspot.com",
  messagingSenderId: "931508397319",
  appId: "1:931508397319:web:b3c9c0b76b31fc1970d1a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()