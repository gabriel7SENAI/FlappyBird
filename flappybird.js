import { salvar, lerMaiores, deletarMenores } from "./crud.js";

const board = document.getElementById("board");

/** @type {CanvasRenderingContext2D} */
const context = board.getContext("2d"); // Canvas
board.width = 360;
board.height = 640;

// Pássaro
const birdWidth = 34;
const birdHeight = 24;
let birdX = board.width / 8;
let birdY = board.height / 2;

const birdImg = new Image();

let bird = {
  x: birdX,
  y: birdY,
  height: birdHeight,
  width: birdWidth,
};

// Canos
let pipeArray = [];

const pipeWidth = 64;
const pipeHeight = 512;
let pipeX = board.width;
let pipeY = 0;

const topPipeImg = new Image();
const bottomPipeImg = new Image();

// Física
const velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

// Informações
let gameOver = false;
let podeReiniciar = false;
let score = 0;
let scoreSalvo = false;

function mostrarPontuacoes(dados) {
  const lista = document.getElementById("pontuacoes");
  lista.innerHTML = "";

  if (!dados) return;

  const array = Object.values(dados);

  // ordenar do maior para o menor
  array.sort((a, b) => b.pontuacao - a.pontuacao);

  array.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.pontuacao}`;
    lista.appendChild(li);
  });
}

async function carregarScores() {
  const dados = await lerMaiores();

  if (!dados) return;

  mostrarPontuacoes(dados);
}

// Quando carregar tudo ele começa
window.onload = async function () {
  await carregarScores();

  birdImg.src = "./img/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg.src = "./img/toppipe.png";
  bottomPipeImg.src = "./img/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);

  board.addEventListener("click", moveBird);
  board.addEventListener("touchstart", (e) => {
    e.preventDefault(); // evita scroll
    moveBird(e);
  });
};

async function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    if (!scoreSalvo) {
      scoreSalvo = true;
      salvar({ pontuacao: score });

      await deletarMenores(10);

      // trava o restart
      podeReiniciar = false;

      setTimeout(() => {
        podeReiniciar = true;
      }, 1000); // 1 segundo
    }
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);

  context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);

  if (bird.y > board.height) {
    gameOver = true;
  }

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // Limpar canos
  while (pipeArray.length > 0 && pipeArray[0].x < -60) {
    pipeArray.shift(); // remove o primeiro elemento do vetor
  }

  // Pontuação
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillStyle = "white";
    context.fillText("GAME OVER", 40, 320);
  }
}

function placePipes() {
  const randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  const openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe, bottomPipe);
}

// function moveBird(e) {
//   if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
//     velocityY = -6;

//     if (gameOver) {
//       bird.y = birdY;
//       pipeArray = [];
//       score = 0;
//       gameOver = false;
//     }
//   }
// }

function moveBird(e) {
  if (
    e.type === "click" ||
    e.type === "touchstart" ||
    e.code === "Space" ||
    e.code === "ArrowUp" ||
    e.code === "KeyX"
  ) {
    velocityY = -6;

    if (gameOver) {
      if (!podeReiniciar) return; // BLOQUEIA

      bird.y = birdY;
      velocityY = 0;
      pipeArray = [];
      score = 0;
      gameOver = false;
      scoreSalvo = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
