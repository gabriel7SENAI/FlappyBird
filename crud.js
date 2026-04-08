import { database } from "./firebaseConfig.js";
import {
  ref,
  push,
  set,
  get,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

export async function salvar(score) {
  return push(ref(database, "Pontuações"));
  await set(newScoreRef, score);
}
