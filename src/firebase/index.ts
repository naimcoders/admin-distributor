import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/messaging";
import { getToken, MessagePayload, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpgMv7dGnkWnHxN5PNGlKuCjH9o6O0XKw",
  authDomain: "development-pilipilih.firebaseapp.com",
  projectId: "development-pilipilih",
  storageBucket: "development-pilipilih.appspot.com",
  messagingSenderId: "434614842838",
  appId: "1:434614842838:web:e06f88c86d4acc305fa077",
  measurementId: "G-YYSTL6LGRK",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const FbApp = firebase.app();
const FbAuth = firebase.auth();
const FbMessage = firebase.messaging();
const FbStorage = getStorage(firebase.app());

export { FbApp, FbAuth, FbMessage, FbStorage };

export const requestForToken = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    getToken(FbMessage, {
      vapidKey: import.meta.env.VITE_KEY_WEB_PUSH,
    })
      .then((currentToken) => {
        if (currentToken) {
          // console.log(currentToken);
          resolve(currentToken);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const onMessageListener = () =>
  new Promise<MessagePayload>((resolve) => {
    onMessage(FbMessage, (payload) => {
      console.log("payload", payload.data);
      resolve(payload);
    });
  });
