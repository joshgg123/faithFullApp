import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUs2UV1wBW8j_N379T6vk9o4c_nXzechQ",

  authDomain: "faithfull-17224.firebaseapp.com",

  projectId: "faithfull-17224",

  storageBucket: "faithfull-17224.firebasestorage.app",

  messagingSenderId: "576982061788",

  appId: "1:576982061788:web:6e6b9184caf8204be55a19",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);