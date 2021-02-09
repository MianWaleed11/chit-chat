import firebase from "firebase";
import firestore from "firebase/firestore";

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "AIzaSyBE8VrPXvpywXQJI4sLnA5-FQEhyCNT4FU",
  authDomain: "chatrooms-19281.firebaseapp.com",
  databaseURL: "https://chatrooms-19281-default-rtdb.firebaseio.com",
  projectId: "chatrooms-19281",
  storageBucket: "chatrooms-19281.appspot.com",
  messagingSenderId: "2175076216",
  appId: "1:2175076216:web:75df43d85c2d9e7b8a6a8d",
  measurementId: "G-4Q7FKN21SY",
};
firebase.initializeApp(config);

// firebase.firestore().settings(settings);

export default firebase;
