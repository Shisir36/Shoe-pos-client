// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCRR7lX7ni_2X_q9y3Dxhy2AOU7IyFME0",
  authDomain: "shoes-pos.firebaseapp.com",
  projectId: "shoes-pos",
  storageBucket: "shoes-pos.firebasestorage.app",
  messagingSenderId: "30086217892",
  appId: "1:30086217892:web:693e8ea10afe5f1b422631"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);