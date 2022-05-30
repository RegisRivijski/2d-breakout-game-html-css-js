
class Config{
  constructor() {
    this.boardWidth = 1280;
    this.boardHeight = 720;
    this.blockAmong = 10;
    this.blockLifeCount = 3;
    this.blockCountX = 10;
    this.blockCountY = 6;
    this.blockWidth = 108;
    this.blockHeight = 25;
  }
}

class Grid {
  constructor() {
    this.grid = document.querySelector('.grid');
  }
  addBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
      this.grid.appendChild(blocks[i].block);
    }
  }
  appendChild(child) {
    this.grid.appendChild(child);
  }
  clearGrid() {
    this.grid.innerHTML = '';
  }
}

class Score {
  constructor(score = 0) {
    this.score = score;
    this.highScore = 0;
    this.scoreDisplay = document.querySelector('#score');
  }
  addCount(count = 1) {
    this.score += count;
    this.drawScore();
  }
  getHighScore() {
    this.highScore = this.highScore < this.score ? this.score : this.highScore;
    return this.highScore;
  }
  newScore() {
    this.score = 0;
    this.drawScore();
  }
  drawScore() {
    this.scoreDisplay.innerHTML = `Score: ${this.score}`;
  }
}

class User extends Config {
  constructor() {
    super();
    this.user = document.createElement('div');
    this.user.classList.add('user');
    this.blockWidth = 108;
    this.blockHeight = 25;
    this.setStartPosition();
    this.drawUser();
  }
  setStartPosition() {
    this.currentPosition = [this.boardWidth / 2 - this.blockWidth / 2, this.blockAmong];
  }
  moveUser(e) {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.currentPosition[0] > 0) {
          this.currentPosition[0] -= 10;
          this.drawUser();
        }
        break;
      case 'ArrowRight':
        if (this.currentPosition[0] < (this.boardWidth - this.blockWidth)) {
          this.currentPosition[0] += 10;
          this.drawUser();
        }
        break;
    }
  }
  drawUser() {
    this.user.style.width = this.blockWidth + 'px';
    this.user.style.left = this.currentPosition[0] + 'px';
    this.user.style.bottom = this.currentPosition[1] + 'px';
    this.user.style.height = this.blockHeight + 'px';
  }
}

class Ball extends Config {
  constructor() {
    super();
    this.ball = document.createElement('div');
    this.ball.classList.add('ball');
    this.diameter = 20;
    this.setStartPosition();
    this.setStartDirection();
    this.drawBall();
  }
  setStartPosition() {
    this.currentPosition = [this.boardWidth / 2, this.blockAmong * 4];
  }
  setStartDirection() {
    this.xDirection = -2;
    this.yDirection = 2;
  }
  changeDirection() {
    switch (true) {
      case (this.xDirection === 2 && this.yDirection === 2):
        this.yDirection = -2;
        break;
      case (this.xDirection === 2 && this.yDirection === -2):
        this.xDirection = -2;
        break;
      case (this.xDirection === -2 && this.yDirection === -2):
        this.yDirection = 2;
        break;
      case (this.xDirection === -2 && this.yDirection === 2):
        this.xDirection = 2;
        break;
      default:
        break;
    }
  }
  moveBall() {
    this.currentPosition[0] += this.xDirection;
    this.currentPosition[1] += this.yDirection;
    this.drawBall();
  }
  drawBall() {
    this.ball.style.left = this.currentPosition[0] + 'px';
    this.ball.style.bottom = this.currentPosition[1] + 'px';
  }
}

class Block extends Config {
  constructor(xAxis, yAxis) {
    super();

    this.blockWidth = 108;
    this.blockHeight = 25;

    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + this.blockWidth, yAxis];
    this.topRight = [xAxis + this.blockWidth, yAxis + this.blockHeight];
    this.topLeft = [xAxis, yAxis + this.blockHeight];

    this.lifeCount = this.blockLifeCount;

    this.block = document.createElement('div');
    this.drawBlock();
  }
  hit() {
    this.lifeCount -= 1;
    if (this.lifeCount === 0) {
      this.block.remove();
    } else {
      this.block.style['background-color'] = this.lifeCount === 2 ? 'rgb(56, 56, 56)' : 'rgb(112, 112, 112)';
    }
  }
  drawBlock() {
    this.block.classList.add('block');
    this.block.style.left = this.bottomLeft[0] + 'px';
    this.block.style.bottom = this.bottomLeft[1] + 'px';
    this.block.style.width = this.blockWidth + 'px';
    this.block.style.height = this.blockHeight + 'px';
  }
}

class Modal {
  constructor() {
    this.GAME_START = 0;
    this.GAME_RESULT_VICTORY = 1;
    this.GAME_RESULT_DEFEAT = 2;

    this.modal = document.createElement('div');
    this.modalContent = document.createElement('div');
    this.modal.appendChild(this.modalContent);
    this.drawModal();
  }
  drawModal() {
    this.modal.classList.add('modal')
    this.modalContent.classList.add('modal_content');
  }
  showModal(gameResult, score = 0, highScore = 0) {
    let modalH3 = '';
    const scoreHTML = `<p>Score: ${score}</p>`;
    const highScoreHTML = `<p>High score: ${highScore}</p>`;
    switch (gameResult) {
      case this.GAME_START:
        modalH3 = '<h3 style="color: rgb(0, 0, 150)">START</h3>';
        break;
      case this.GAME_RESULT_VICTORY:
        modalH3 = '<h3 style="color: rgb(0, 150, 0)">Victory</h3>';
        break;
      case this.GAME_RESULT_DEFEAT:
        modalH3 = '<h3 style="color: rgb(150, 0, 0)">Defeat</h3>';
        break;
      default:
        break;
    }
    this.modal.style.display = 'block';
    this.modalContent.innerHTML = modalH3 + scoreHTML + highScoreHTML;
  }
  closeModal() {
    this.modal.style.display = 'none';
  }
}

class Game extends Config {
  constructor() {
    super();
    this.Grid = new Grid;
    this.Score = new Score;
    this.User = new User;
    this.Ball = new Ball;
    this.Modal = new Modal;
    this.blocks = [];
    this.setAllBlocks();
    this.appendBaseClassesToGrid();
    this.Grid.addBlocks(this.blocks);
    this.timerId = null;
    this.Modal.modalContent.onclick = () => {
      this.Modal.closeModal();
      if (this.Score.highScore !== 0) {
        this.startNewGame();
      }
      this.start();
    };
  }
  checkForCollisions() {
    for (let i = 0; i < this.blocks.length; i++) {

      if ((this.Ball.currentPosition[0] > this.blocks[i].bottomLeft[0] && this.Ball.currentPosition[0] < this.blocks[i].bottomRight[0]) &&
        ((this.Ball.currentPosition[1] + this.Ball.diameter) > this.blocks[i].bottomLeft[1] && this.Ball.currentPosition[1] < this.blocks[i].topLeft[1])) {

        this.blocks[i].hit();

        if (this.blocks[i].lifeCount === 0) {
          this.blocks.splice(i,1);
          this.Score.addCount();
        }

        this.Ball.changeDirection();

        if (this.blocks.length === 0) {
          this.Modal.showModal(this.Modal.GAME_RESULT_VICTORY, this.Score.score, this.Score.getHighScore());
          this.Score.newScore();
          clearInterval(this.timerId);
          document.removeEventListener('keydown', (e) => {
            this.User.moveUser(e);
          });
        }
      }
    }

    if (this.Ball.currentPosition[0] >= (this.boardWidth - this.Ball.diameter) || this.Ball.currentPosition[0] <= 0 || this.Ball.currentPosition[1] >= (this.boardHeight - this.Ball.diameter)) {
      this.Ball.changeDirection();
    }

    if ((this.Ball.currentPosition[0] > this.User.currentPosition[0] && this.Ball.currentPosition[0] < this.User.currentPosition[0] + this.User.blockWidth) &&
      (this.Ball.currentPosition[1] > this.User.currentPosition[1] && this.Ball.currentPosition[1] < this.User.currentPosition[1] + this.User.blockHeight)) {
      this.Ball.changeDirection();
    }

    if (this.Ball.currentPosition[1] <= 0) {
      this.Modal.showModal(this.Modal.GAME_RESULT_DEFEAT, this.Score.score, this.Score.getHighScore());
      this.Score.newScore();
      clearInterval(this.timerId);
      document.removeEventListener('keydown', (e) => {
        this.User.moveUser(e);
      });
    }
  }
  setAllBlocks() {
    for (let x = 0; x < this.blockCountX; x += 1) {
      for (let y = 1; y <= this.blockCountY; y += 1) {
        this.blocks.push(new Block(this.blockAmong + x * (this.blockWidth + this.blockAmong * 2), this.boardHeight - y * (this.blockHeight + this.blockAmong)));
      }
    }
  }
  appendBaseClassesToGrid() {
    this.Grid.appendChild(this.User.user);
    this.Grid.appendChild(this.Ball.ball);
    this.Grid.appendChild(this.Modal.modal);
  }
  gameLoop() {
    this.Ball.moveBall();
    this.checkForCollisions();
  }
  startNewGame() {
    this.Grid.clearGrid();
    this.User.setStartPosition();
    this.User.drawUser();
    this.Ball.setStartPosition();
    this.Ball.setStartDirection();
    this.Ball.drawBall();
    this.appendBaseClassesToGrid();
    if (this.Score.highScore === 0) {
      this.Modal.showModal(this.Modal.GAME_START)
    } else {
      this.Modal.closeModal();
    }
    this.blocks = [];
    this.setAllBlocks();
    this.Grid.addBlocks(this.blocks);
  }
  start() {
    window.document.addEventListener('keydown', (e) => {
      this.User.moveUser(e);
    });
    this.timerId = setInterval(() => {
      this.gameLoop();
    }, 10);
  }
}

function main() {
  const game = new Game();
  game.startNewGame();
}
main();
