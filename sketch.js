function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}let farmer;
let hay;
let cows = [];
let score = 0;
let gameOver = false;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  farmer = new Farmer();
  hay = new Hay();

  // Vacas espalhadas em diferentes locais
  cows.push(new Cow(100, 500));
  cows.push(new Cow(700, 500));
  cows.push(new Cow(150, 150));
  cows.push(new Cow(650, 200));
  cows.push(new Cow(400, 100));
}

function draw() {
  background(100, 200, 100); // Fundo verde simulando o campo

  if (gameOver) {
    fill(255, 0, 0);
    textSize(48);
    text("Game Over!", width / 2, height / 2);
    textSize(24);
    text("Pressione 'R' para reiniciar", width / 2, height / 2 + 50);
    return;
  }

  farmer.show();
  farmer.move();

  hay.show();

  for (let cow of cows) {
    cow.show();
    cow.update();

    if (cow.hungry) {
      fill(255, 0, 0);
      textSize(16);
      text("Fome!", cow.x, cow.y - 60);
    }

    if (cow.timer <= 0) {
      gameOver = true;
    }
  }

  // Pegar o feno (trigo)
  if (!farmer.carrying && dist(farmer.x, farmer.y, hay.x, hay.y) < 30) {
    farmer.carrying = true;
    hay.respawn();
  }

  // Alimentar vacas
  if (farmer.carrying) {
    for (let cow of cows) {
      if (dist(farmer.x, farmer.y, cow.x, cow.y) < 40) {
        cow.feed();
        farmer.carrying = false;
        score++;
      }
    }
  }

  // Mostrar pontuação
  fill(0);
  textSize(20);
  text("Fenos entregues: " + score, 120, 30);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    restartGame();
  }
}

function restartGame() {
  farmer = new Farmer();
  hay = new Hay();
  cows = [];
  cows.push(new Cow(100, 500));
  cows.push(new Cow(700, 500));
  cows.push(new Cow(150, 150));
  cows.push(new Cow(650, 200));
  cows.push(new Cow(400, 100));
  score = 0;
  gameOver = false;
}

// 🧑‍🌾 Classe Fazendeiro
class Farmer {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = 40;
    this.speed = 4;
    this.carrying = false;
  }

  show() {
    textSize(this.size);
    text("👨‍🌾", this.x, this.y);
    if (this.carrying) {
      textSize(20);
      text("🌾", this.x, this.y - 40);
    }
  }

  move() {
    if (keyIsDown(65)) this.x -= this.speed; // A - esquerda
    if (keyIsDown(68)) this.x += this.speed; // D - direita
    if (keyIsDown(87)) this.y -= this.speed; // W - cima
    if (keyIsDown(83)) this.y += this.speed; // S - baixo

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
}

// 🌾 Classe Feno (agora emoji de trigo)
class Hay {
  constructor() {
    this.respawn();
  }

  respawn() {
    this.x = random(50, width - 50);
    this.y = random(50, height - 200);
  }

  show() {
    textSize(30);
    text("🌾", this.x, this.y);
  }
}

// 🐄 Classe Vaca
class Cow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.timer = 1000; // Tempo até ficar com fome
    this.maxTimer = 1000;
    this.hungry = false;
  }

  show() {
    textSize(this.size);
    text("🐄", this.x, this.y);

    // Barra de fome
    fill(200);
    rect(this.x - 20, this.y + 30, 40, 5);
    fill(0, 255, 0);
    let barWidth = map(this.timer, 0, this.maxTimer, 0, 40);
    rect(this.x - 20, this.y + 30, barWidth, 5);
  }

  update() {
    this.timer--;
    this.hungry = this.timer < this.maxTimer / 2;
  }

  feed() {
    this.timer = this.maxTimer;
    this.hungry = false;
  }
}
