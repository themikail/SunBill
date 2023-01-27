import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCge915LnLxoYK6W0VTEm_Vrtvd-NV5wOo",
  authDomain: "sunbill-2481d.firebaseapp.com",
  databaseURL:
    "https://sunbill-2481d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sunbill-2481d",
  storageBucket: "sunbill-2481d.appspot.com",
  messagingSenderId: "29273611053",
  appId: "1:29273611053:web:e892be3d0d941f2e0dd1a4",
};

const app = initializeApp(firebaseConfig);
const provider = new EmailAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { provider, auth, storage };
export default db;
