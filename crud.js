import { database } from "./firebaseConfig.js";
import {
  ref,
  push,
  set,
  get,
  child,
  update,
  remove,
  query,
  orderByChild,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const referencia = ref(database, "Pontuacoes");

export async function salvar(score) {
  const novo = push(referencia);
  await set(novo, score);
}

export async function lerMaiores() {
  const q = query(referencia, orderByChild("pontuacao"), limitToLast(10));

  const snapshot = await get(q);
  return snapshot.val();
}

export async function deletarMenores(limite = 10) {
  const snapshot = await get(referencia);

  const dados = snapshot.val();
  if (!dados) return;

  const lista = Object.entries(dados).map(([id, valor]) => ({
    id,
    ...valor,
  }));

  lista.sort((a, b) => b.pontuacao - a.pontuacao);

  const paraDeletar = lista.slice(limite);

  for (let item of paraDeletar) {
    await remove(ref(database, `Pontuacoes/${item.id}`));
  }
}
