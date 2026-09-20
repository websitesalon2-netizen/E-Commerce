// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhA79wtQL8gj4SRMXlTkLAv8FR4sw0K9g",
  authDomain: "e-commerce-26f17.firebaseapp.com",
  projectId: "e-commerce-26f17",
  storageBucket: "e-commerce-26f17.firebasestorage.app",
  messagingSenderId: "368086828482",
  appId: "1:368086828482:web:a169961e0c5ddaf3d9425b",
  measurementId: "G-N5VXEQXSPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
