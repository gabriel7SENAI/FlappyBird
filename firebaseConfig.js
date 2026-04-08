import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1uUqZGKIpvGMBX7qPNznySniYt44kB6s",
  authDomain: "flappy-bird-d4dea.firebaseapp.com",
  projectId: "flappy-bird-d4dea",
  storageBucket: "flappy-bird-d4dea.firebasestorage.app",
  messagingSenderId: "575881655882",
  appId: "1:575881655882:web:27c8dabe3e7bdf4320d8b3",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
