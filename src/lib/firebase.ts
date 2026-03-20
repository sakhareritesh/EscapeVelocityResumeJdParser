
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC13fCGzh5R_pLTYJAXxSe6o4cbiGLMSOU",
  authDomain: "codecrush-enrqe.firebaseapp.com",
  projectId: "codecrush-enrqe",
  storageBucket: "codecrush-enrqe.appspot.com",
  messagingSenderId: "721183583766",
  appId: "1:721183583766:web:caf045f5fd781d862c8f37",
  databaseURL: "https://codecrush-enrqe-default-rtdb.firebaseio.com"
};

let app: FirebaseApp;
let auth: Auth;
let db: Database;
let firestore: Firestore;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getDatabase(app);
firestore = getFirestore(app);

export { app, auth, db, firestore };
