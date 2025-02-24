// CREDIT FOR THIS CODE GOES TO: https://github.com/nickarocho/minesweeper
class Cell {
    constructor(row, col, board) {
        this.row = row;
        this.col = col;
        this.bomb = false;
        this.board = board;
        this.revealed = false;
        this.flagged = false;
    }

    getAdjCells() {
        var adj = [];
        var lastRow = this.board.length - 1;
        var lastCol = this.board[0].length - 1;
        if (this.row > 0 && this.col > 0) adj.push(this.board[this.row - 1][this.col - 1]);
        if (this.row > 0) adj.push(this.board[this.row - 1][this.col]);
        if (this.row > 0 && this.col < lastCol) adj.push(this.board[this.row - 1][this.col + 1]);
        if (this.col < lastCol) adj.push(this.board[this.row][this.col + 1]);
        if (this.row < lastRow && this.col < lastCol)
            adj.push(this.board[this.row + 1][this.col + 1]);
        if (this.row < lastRow) adj.push(this.board[this.row + 1][this.col]);
        if (this.row < lastRow && this.col > 0) adj.push(this.board[this.row + 1][this.col - 1]);
        if (this.col > 0) adj.push(this.board[this.row][this.col - 1]);

        return adj;
    }

    calcAdjBombs() {
        var adjCells = this.getAdjCells();
        var adjBombs = adjCells.reduce(function (acc, cell) {
            return acc + (cell.bomb ? 1 : 0);
        }, 0);
        this.adjBombs = adjBombs;
    }

    flag() {
        if (!this.revealed) {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }

    reveal() {
        if (this.revealed && !hitBomb) return;
        // If this cell is flagged, unflag it and update bombCount accordingly.
        if (this.flagged) {
            this.flag();
            bombCount++;
            render();
        }
        this.revealed = true;
        if (this.bomb) return true;
        if (this.adjBombs === 0) {
            var adj = this.getAdjCells();
            adj.forEach(function (cell) {
                if (!cell.revealed) cell.reveal();
            });
        }
        return false;
    }
}

/*----- constants -----*/
var bombImage = '<img src="images/mineSweeper/bomb.png">';
var flagImage = '<img src="images/mineSweeper/flag.png">';
var wrongBombImage = '<img src="images/mineSweeper/wrong-bomb.png">';
var windowMult =
    parseFloat(
        window
            .getComputedStyle(document.getElementById("mineSweeper"))
            .getPropertyValue("--windowMult")
    ) || 1;

var colors = [
    "",
    "#0000FA",
    "#4B802D",
    "#DB1300",
    "#202081",
    "#690400",
    "#457A7A",
    "#1B1B1B",
    "#7A7A7A",
];

/*----- app's state (variables) -----*/
var size = 9;
var board;
var bombCount;
var timeElapsed;
var adjBombs;
var hitBomb;
var elapsedTime;
var timerId;
var winner;

/*----- cached element references -----*/
var boardEl = document.getElementById("board");

boardEl.addEventListener("click", function (e) {
    if (winner || hitBomb) return;
    let clickedEl = e.target.tagName.toLowerCase() === "img" ? e.target.parentElement : e.target;
    if (clickedEl.classList.contains("game-cell")) {
        if (!timerId) setTimer();
        let row = parseInt(clickedEl.dataset.row, 10);
        let col = parseInt(clickedEl.dataset.col, 10);
        let cell = board[row][col];

        if (cell.revealed || cell.flagged) return;

        hitBomb = cell.reveal();
        if (hitBomb) {
            revealAll();
            clearInterval(timerId);
            clickedEl.style.backgroundColor = "red";
        }
        winner = getWinner();
        render();
    }
});

// Updated right-click event handler
boardEl.addEventListener("contextmenu", function (e) {
    if (winner || hitBomb) return;
    let clickedEl = e.target.tagName.toLowerCase() === "img" ? e.target.parentElement : e.target;
    if (clickedEl.classList.contains("game-cell")) {
        e.preventDefault();
        if (!timerId) setTimer();
        let row = parseInt(clickedEl.dataset.row, 10);
        let col = parseInt(clickedEl.dataset.col, 10);
        let cell = board[row][col];

        if (!cell.revealed) {
            if (cell.flagged) {
                // Unflag the cell and refund a flag
                cell.flag();
                bombCount++;
            } else {
                // Only flag if flags remain
                if (bombCount <= 0) return;
                cell.flag();
                bombCount--;
            }
            render();
        }
    }
});

function createResetListener() {
    document.getElementById("reset").addEventListener("click", function () {
        init();
        render();
    });
}

/*----- functions -----*/
function setTimer() {
    timerId = setInterval(function () {
        elapsedTime += 1;
        document.getElementById("timer").innerText = elapsedTime.toString().padStart(3, "0");
    }, 1000);
}

function revealAll() {
    board.forEach(function (rowArr) {
        rowArr.forEach(function (cell) {
            cell.reveal();
        });
    });
}

function buildTable() {
    var topRow = `
    <tr>
      <td class="menu" colspan="${size}">
          <section id="status-bar">
            <div id="bomb-counter">000</div>
            <div id="reset"><img src="images/mineSweeper/smiley-face.png"></div>
            <div id="timer">000</div>
          </section>
      </td>
    </tr>
    `;
    boardEl.innerHTML =
        topRow + `<tr>${'<td class="game-cell"></td>'.repeat(size)}</tr>`.repeat(size);

    createResetListener();
    var cells = Array.from(document.querySelectorAll("td:not(.menu)"));
    cells.forEach(function (cell, idx) {
        cell.setAttribute("data-row", Math.floor(idx / size));
        cell.setAttribute("data-col", idx % size);
    });
}

function buildArrays() {
    var arr = Array(size).fill(null);
    arr = arr.map(function () {
        return new Array(size).fill(null);
    });
    return arr;
}

function buildCells() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (slot, colIdx) {
            board[rowIdx][colIdx] = new Cell(rowIdx, colIdx, board);
        });
    });
    addBombs();
    runCodeForAllCells(function (cell) {
        cell.calcAdjBombs();
    });
}

function init() {
    buildTable();
    board = buildArrays();
    buildCells();
    bombCount = getBombCount();
    elapsedTime = 0;
    clearInterval(timerId);
    timerId = null;
    hitBomb = false;
    winner = false;
}

function getBombCount() {
    var count = 0;
    board.forEach(function (row) {
        count += row.filter(function (cell) {
            return cell.bomb;
        }).length;
    });
    return count;
}

function addBombs() {
    var currentTotalBombs = 10;
    while (currentTotalBombs !== 0) {
        var row = Math.floor(Math.random() * size);
        var col = Math.floor(Math.random() * size);
        var currentCell = board[row][col];
        if (!currentCell.bomb) {
            currentCell.bomb = true;
            currentTotalBombs -= 1;
        }
    }
}

function getWinner() {
    for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[0].length; col++) {
            var cell = board[row][col];
            if (!cell.revealed && !cell.bomb) return false;
        }
    }
    return true;
}

function render() {
    document.getElementById("bomb-counter").innerText = bombCount.toString().padStart(3, "0");
    var tdList = Array.from(document.querySelectorAll("[data-row]"));
    tdList.forEach(function (td) {
        var rowIdx = parseInt(td.getAttribute("data-row"));
        var colIdx = parseInt(td.getAttribute("data-col"));
        var cell = board[rowIdx][colIdx];
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
    if (hitBomb) {
        document.getElementById("reset").innerHTML = "<img src=images/mineSweeper/dead-face.png>";
        runCodeForAllCells(function (cell) {
            if (!cell.bomb && cell.flagged) {
                var td = document.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                td.innerHTML = wrongBombImage;
            }
        });
    } else if (winner) {
        document.getElementById("reset").innerHTML = "<img src=images/mineSweeper/cool-face.png>";
        clearInterval(timerId);
    }
}

function runCodeForAllCells(cb) {
    board.forEach(function (rowArr) {
        rowArr.forEach(function (cell) {
            cb(cell);
        });
    });
}

init();
render();