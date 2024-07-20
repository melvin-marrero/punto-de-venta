
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCRUT2wIxgVY-F1Xn5IAzmlvmaNjOVg2jo",
  authDomain: "punto-de-venta-8383b.firebaseapp.com",
  projectId: "punto-de-venta-8383b",
  storageBucket: "punto-de-venta-8383b.appspot.com",
  messagingSenderId: "78294500631",
  appId: "1:78294500631:web:6b616821150071a8cda352"
};

const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;