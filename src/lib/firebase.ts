import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyB9ioieUceMSv1ASICDekaImP9v_Glx-v4',
  authDomain: 'chatcom-ffe8d.firebaseapp.com',
  projectId: 'chatcom-ffe8d',
  storageBucket: 'chatcom-ffe8d.firebasestorage.app',
  messagingSenderId: '727742147643',
  measurementId: "G-L5XVYWE36W",
  appId: '1:727742147643:web:ddc49a332e87ff6d5fc01e'
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);