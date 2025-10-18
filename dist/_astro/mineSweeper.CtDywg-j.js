/* Minesweeper: adapted for Astro public paths */
class Cell {
  constructor(row, col, boardInstance) {
    this.row = row;
    this.col = col;
    this.bomb = false;
    this.board = boardInstance;
    this.revealed = false;
    this.flagged = false;
  }
  getAdjCells() {
    const boardArray = this.board.board;
    const adj = [];
    const lastRow = boardArray.length - 1;
    const lastCol = boardArray[0].length - 1;
    if (this.row > 0 && this.col > 0) adj.push(boardArray[this.row - 1][this.col - 1]);
    if (this.row > 0) adj.push(boardArray[this.row - 1][this.col]);
    if (this.row > 0 && this.col < lastCol) adj.push(boardArray[this.row - 1][this.col + 1]);
    if (this.col < lastCol) adj.push(boardArray[this.row][this.col + 1]);
    if (this.row < lastRow && this.col < lastCol) adj.push(boardArray[this.row + 1][this.col + 1]);
    if (this.row < lastRow) adj.push(boardArray[this.row + 1][this.col]);
    if (this.row < lastRow && this.col > 0) adj.push(boardArray[this.row + 1][this.col - 1]);
    if (this.col > 0) adj.push(boardArray[this.row][this.col - 1]);
    return adj;
  }
  calcAdjBombs() {
    const adjCells = this.getAdjCells();
    this.adjBombs = adjCells.reduce((acc, cell) => acc + (cell.bomb ? 1 : 0), 0);
  }
  flag() {
    if (!this.revealed) {
      this.flagged = !this.flagged;
      return this.flagged;
    }
  }
  reveal() {
    if (this.revealed && !this.board.hitBomb) return;
    if (this.flagged) {
      this.flag();
      this.board.bombCount++;
      this.board.render();
    }
    this.revealed = true;
    if (this.bomb) return true;
    if (this.adjBombs === 0) {
      const adj = this.getAdjCells();
      adj.forEach((cell) => { if (!cell.revealed) cell.reveal(); });
    }
    return false;
  }
}

class MinesweeperBoard {
  constructor(boardEl) {
    this.boardEl = boardEl;
    this.windowMult = parseFloat(window.getComputedStyle(boardEl).getPropertyValue("--windowMult")) || 1;
    this.size = 9;
    this.board = [];
    this.bombCount = 0;
    this.elapsedTime = 0;
    this.timerId = null;
    this.hitBomb = false;
    this.winner = false;
    this.init();
    this.addEventListeners();
  }
  init() {
    this.buildTable();
    this.board = this.buildArrays();
    this.buildCells();
    this.bombCount = this.getBombCount();
    this.elapsedTime = 0;
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
    this.hitBomb = false;
    this.winner = false;
    this.render();
  }
  buildTable() {
    const topRow = `
      <tr>
        <td class="menu" colspan="${this.size}">
          <section class="status-bar">
            <div class="bomb-counter">000</div>
            <div class="reset"><img src="/images/mineSweeper/smiley-face.png"></div>
            <div class="timer">000</div>
          </section>
        </td>
      </tr>`;
    this.boardEl.innerHTML = topRow + `<tr>${'<td class="game-cell"></td>'.repeat(this.size)}</tr>`.repeat(this.size);
    this.attachDataAttributes();
    this.attachResetListener();
  }
  attachDataAttributes() {
    const cells = Array.from(this.boardEl.querySelectorAll("td:not(.menu)"));
    cells.forEach((cell, idx) => {
      cell.setAttribute("data-row", Math.floor(idx / this.size));
      cell.setAttribute("data-col", idx % this.size);
    });
  }
  attachResetListener() {
    const resetEl = this.boardEl.querySelector(".reset");
    resetEl.addEventListener("click", () => { this.init(); });
  }
  buildArrays() {
    let arr = new Array(this.size).fill(null);
    return arr.map(() => new Array(this.size).fill(null));
  }
  buildCells() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.board[row][col] = new Cell(row, col, this);
      }
    }
    this.addBombs();
    this.runCodeForAllCells((cell) => cell.calcAdjBombs());
  }
  addBombs() {
    let currentTotalBombs = 10;
    while (currentTotalBombs !== 0) {
      const row = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      const currentCell = this.board[row][col];
      if (!currentCell.bomb) { currentCell.bomb = true; currentTotalBombs--; }
    }
  }
  getBombCount() {
    let count = 0;
    this.board.forEach((row) => { count += row.filter((cell) => cell.bomb).length; });
    return count;
  }
  getWinner() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[0].length; col++) {
        const cell = this.board[row][col];
        if (!cell.revealed && !cell.bomb) return false;
      }
    }
    return true;
  }
  runCodeForAllCells(cb) { this.board.forEach((rowArr) => rowArr.forEach((cell) => cb(cell))); }
  setTimer() {
    this.timerId = setInterval(() => {
      this.elapsedTime++;
      const timerEl = this.boardEl.querySelector(".timer");
      timerEl.innerText = this.elapsedTime.toString().padStart(3, "0");
    }, 1000);
  }
  revealAll() { this.board.forEach((rowArr) => rowArr.forEach((cell) => cell.reveal())); }
  render() {
    const bombCounterEl = this.boardEl.querySelector(".bomb-counter");
    bombCounterEl.innerText = this.bombCount.toString().padStart(3, "0");
    const tdList = Array.from(this.boardEl.querySelectorAll("[data-row]"));
    tdList.forEach((td) => {
      const rowIdx = parseInt(td.getAttribute("data-row"), 10);
      const colIdx = parseInt(td.getAttribute("data-col"), 10);
      const cell = this.board[rowIdx][colIdx];
      if (cell.flagged) {
        td.innerHTML = flagImage;
      } else if (cell.revealed) {
        if (cell.bomb) {
          td.innerHTML = bombImage;
        } else if (cell.adjBombs) {
          td.className = "revealed";
          td.style.color = colors[cell.adjBombs];
          td.textContent = cell.adjBombs;
        } else {
          td.className = "revealed";
        }
      } else {
        td.innerHTML = "";
      }
    });
    if (this.hitBomb) {
      const resetEl = this.boardEl.querySelector(".reset");
      resetEl.innerHTML = '<img src="/images/mineSweeper/dead-face.png">';
      this.runCodeForAllCells((cell) => {
        if (!cell.bomb && cell.flagged) {
          const td = this.boardEl.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
          td.innerHTML = wrongBombImage;
        }
      });
    } else if (this.winner) {
      const resetEl = this.boardEl.querySelector(".reset");
      resetEl.innerHTML = '<img src="/images/mineSweeper/cool-face.png">';
      clearInterval(this.timerId);
    }
  }
  addEventListeners() {
    this.boardEl.addEventListener("click", (e) => {
      if (this.winner || this.hitBomb) return;
      const clickedEl = e.target.tagName.toLowerCase() === "img" ? e.target.parentElement : e.target;
      if (clickedEl.classList.contains("game-cell")) {
        if (!this.timerId) this.setTimer();
        const row = parseInt(clickedEl.dataset.row, 10);
        const col = parseInt(clickedEl.dataset.col, 10);
        const cell = this.board[row][col];
        if (cell.revealed || cell.flagged) return;
        this.hitBomb = cell.reveal();
        if (this.hitBomb) { this.revealAll(); clearInterval(this.timerId); clickedEl.style.backgroundColor = "red"; }
        this.winner = this.getWinner();
        this.render();
      }
    });
    this.boardEl.addEventListener("contextmenu", (e) => {
      if (this.winner || this.hitBomb) return;
      const clickedEl = e.target.tagName.toLowerCase() === "img" ? e.target.parentElement : e.target;
      if (clickedEl && clickedEl.classList.contains("game-cell")) {
        e.preventDefault();
        if (!this.timerId) this.setTimer();
        const row = parseInt(clickedEl.dataset.row, 10);
        const col = parseInt(clickedEl.dataset.col, 10);
        const cell = this.board[row][col];
        if (!cell.revealed) {
          if (cell.flagged) { cell.flag(); this.bombCount++; }
          else { if (this.bombCount <= 0) return; cell.flag(); this.bombCount--; }
          this.render();
        }
      }
    });
  }
}

var bombImage = '<img src="/images/mineSweeper/bomb.png">';
var flagImage = '<img src="/images/mineSweeper/flag.png">';
var wrongBombImage = '<img src="/images/mineSweeper/wrong-bomb.png">';
var colors = ["", "#0000FA", "#4B802D", "#DB1300", "#202081", "#690400", "#457A7A", "#1B1B1B", "#7A7A7A"]; 

document.querySelectorAll(".board").forEach((boardEl) => { new MinesweeperBoard(boardEl); });

