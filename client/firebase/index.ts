import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQ6DuvuNtdUNoLDFuIam9QcvbtxxsbQ6M",
  authDomain: "eshop-8d2b4.firebaseapp.com",
  projectId: "eshop-8d2b4",
  storageBucket: "eshop-8d2b4.appspot.com",
  messagingSenderId: "1075220785410",
  appId: "1:1075220785410:web:47baf06301d7ce413cfa1b",
  measurementId: "G-CD6DENEDK0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
