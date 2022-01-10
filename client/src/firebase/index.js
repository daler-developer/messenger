import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyAxl0YMoWkpX6fKZWvkk8IV40I8uan8CaU",
  authDomain: "messenger-mern-cc405.firebaseapp.com",
  projectId: "messenger-mern-cc405",
  storageBucket: "messenger-mern-cc405.appspot.com",
  messagingSenderId: "298317258743",
  appId: "1:298317258743:web:b03569bce370a01dccd8f2"
}

const app = initializeApp(firebaseConfig)

const storage = getStorage()

export { storage }
