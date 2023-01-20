import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSFAb_JbC7dSXf2-gCtd49EaUxC5R0q_8",
  authDomain: "aiwaka-bunko.firebaseapp.com",
  projectId: "aiwaka-bunko",
  storageBucket: "aiwaka-bunko.appspot.com",
  messagingSenderId: "975825867856",
  appId: "1:975825867856:web:547c5b65d32291f980ad55",
  measurementId: "G-0P386NTC80",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

// https://blog.35d.jp/2020-04-06-nuxt-firebase-auth
// ユーザーを常に正しく取得できるためのpromise wrapper
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resolve(user);
      unsubscribe();
    });
  });
}

export { firebaseApp, analytics, db, storage, auth };
