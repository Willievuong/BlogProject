// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-MY5aOjhk7tvaCxK51aw2dAmw8lEpRZ4",
  authDomain: "blog-project-7d092.firebaseapp.com",
  projectId: "blog-project-7d092",
  storageBucket: "blog-project-7d092.appspot.com",
  messagingSenderId: "453279728439",
  appId: "1:453279728439:web:4f6bd856f4c25846d5d0b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)