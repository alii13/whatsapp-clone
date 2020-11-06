import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// const firebaseConfig = {
//     apiKey: "AIzaSyB13PntUEDMkFbTt2psiHOZtQih83qrf88",
//     authDomain: "whatsapp-clone-fafc9.firebaseapp.com",
//     databaseURL: "https://whatsapp-clone-fafc9.firebaseio.com",
//     projectId: "whatsapp-clone-fafc9",
//     storageBucket: "whatsapp-clone-fafc9.appspot.com",
//     messagingSenderId: "1027981883218",
//     appId: "1:1027981883218:web:f62f32ffe8e5701f0f2c8b",
//     measurementId: "G-0YMF5ZZL8N"
//   };
const firebaseConfig = {
  apiKey: "AIzaSyD3c-g9buyeJnYZ-6_1NDZ8TQz1n4fhKn4",
  authDomain: "whatsapp-73989.firebaseapp.com",
  databaseURL: "https://whatsapp-73989.firebaseio.com",
  projectId: "whatsapp-73989",
  storageBucket: "whatsapp-73989.appspot.com",
  messagingSenderId: "166827944927",
  appId: "1:166827944927:web:28451dca14499bc919326a",
  measurementId: "G-E7CXYXDVYG",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
