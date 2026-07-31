const SIZE = 4;
const CELL_COUNT = SIZE * SIZE;
const BEST_SCORE_KEY = "pocket-play.merge-garden.best.v1";

const TILE_STAGES = new Map([
  [2, { symbol: "🌰", label: "种子" }],
  [4, { symbol: "🌱", label: "萌芽" }],
  [8, { symbol: "🍃", label: "叶片" }],
  [16, { symbol: "🌿", label: "幼苗" }],
  [32, { symbol: "🪴", label: "盆栽" }],
  [64, { symbol: "🌼", label: "开花" }],
  [128, { symbol: "🧫", label: "标本" }],
  [256, { symbol: "🔬", label: "观察" }],
  [512, { symbol: "📓", label: "记录" }],
  [1024, { symbol: "💡", label: "发现" }],
  [2048, { symbol: "📄", label: "论文" }],
  [4096, { symbol: "🌳", label: "花园" }],
]);

const KEY_DIRECTIONS = {
  ArrowLeft: "left",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowRight: "right",
};

const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const statusElement = document.querySelector("#status");
const announcerElement = document.querySelector("#announcer");
const toggleButton = document.querySelector("#toggle-game");
const restartButton = document.querySelector("#restart-game");
const directionButtons = [...document.querySelectorAll("[data-direction]")];

let board = Array(CELL_COUNT).fill(0);
let score = 0;
let storageAvailable = true;
let bestScore = readBestScore();
let phase = "idle";
let keyboardArmed = false;
let newestTileIndex = -1;
let mergedTileIndices = new Set();
let highestAnnouncedValue = 32;
let announceTimer = 0;

function readBestScore() {
  try {
    const storedValue = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? "0", 10);
    return Number.isFinite(storedValue) && storedValue >= 0 ? storedValue : 0;
  } catch {
    storageAvailable = false;
    return 0;
  }
}

function saveBestScore() {
  if (!storageAvailable) return;

  try {
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  } catch {
    storageAvailable = false;
  }
}

function tileStage(value) {
  return TILE_STAGES.get(value) ?? { symbol: "🧬", label: "新物种" };
}

function announce(message) {
  window.clearTimeout(announceTimer);
  announcerElement.textContent = "";
  announceTimer = window.setTimeout(() => {
    announcerElement.textContent = message;
  }, 20);
}

function setStatus(message) {
  statusElement.textContent = message;
}

function addRandomTile() {
  const emptyIndices = [];

  board.forEach((value, index) => {
    if (value === 0) emptyIndices.push(index);
  });

  if (emptyIndices.length === 0) return -1;

  const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[index] = Math.random() < 0.9 ? 2 : 4;
  return index;
}

function mergeLine(values) {
  const compact = values.filter((value) => value !== 0);
  const merged = [];
  const mergedPositions = [];
  let gained = 0;

  for (let index = 0; index < compact.length; index += 1) {
    const value = compact[index];

    if (value === compact[index + 1]) {
      const combined = value * 2;
      merged.push(combined);
      mergedPositions.push(merged.length - 1);
      gained += combined;
      index += 1;
    } else {
      merged.push(value);
    }
  }

  while (merged.length < SIZE) merged.push(0);

  return { values: merged, gained, mergedPositions };
}

function lineIndices(direction, line) {
  const forward = Array.from({ length: SIZE }, (_, index) => index);
  const backward = [...forward].reverse();

  switch (direction) {
    case "left":
      return forward.map((column) => line * SIZE + column);
    case "right":
      return backward.map((column) => line * SIZE + column);
    case "up":
      return forward.map((row) => row * SIZE + line);
    case "down":
      return backward.map((row) => row * SIZE + line);
    default:
      return [];
  }
}

function calculateMove(direction) {
  const nextBoard = Array(CELL_COUNT).fill(0);
  const nextMergedIndices = new Set();
  let gained = 0;

  for (let line = 0; line < SIZE; line += 1) {
    const indices = lineIndices(direction, line);
    const result = mergeLine(indices.map((index) => board[index]));
    gained += result.gained;

    indices.forEach((boardIndex, position) => {
      nextBoard[boardIndex] = result.values[position];
      if (result.mergedPositions.includes(position)) {
        nextMergedIndices.add(boardIndex);
      }
    });
  }

  const changed = nextBoard.some((value, index) => value !== board[index]);
  return { board: nextBoard, gained, mergedIndices: nextMergedIndices, changed };
}

function hasAvailableMove() {
  if (board.some((value) => value === 0)) return true;

  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const index = row * SIZE + column;
      const right = column + 1 < SIZE ? index + 1 : -1;
      const below = row + 1 < SIZE ? index + SIZE : -1;

      if (
        (right >= 0 && board[index] === board[right]) ||
        (below >= 0 && board[index] === board[below])
      ) {
        return true;
      }
    }
  }

  return false;
}

function updateBestScore() {
  if (score <= bestScore) return;
  bestScore = score;
  saveBestScore();
}

function updateControls() {
  const isActive = phase === "active";
  directionButtons.forEach((button) => {
    button.disabled = !isActive;
  });

  const labels = {
    idle: "开始培育",
    active: "暂停",
    paused: "继续培育",
    gameover: "重新播种",
  };
  toggleButton.textContent = labels[phase];
  toggleButton.setAttribute("aria-pressed", String(isActive));
}

function renderBoard() {
  const fragment = document.createDocumentFragment();
  const occupiedCount = board.filter(Boolean).length;
  const largestValue = Math.max(...board);

  for (let rowIndex = 0; rowIndex < SIZE; rowIndex += 1) {
    const rowElement = document.createElement("div");
    rowElement.className = "board-row";
    rowElement.setAttribute("role", "row");

    for (let columnIndex = 0; columnIndex < SIZE; columnIndex += 1) {
      const index = rowIndex * SIZE + columnIndex;
      const value = board[index];
      const row = rowIndex + 1;
      const column = columnIndex + 1;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role", "gridcell");
      cell.setAttribute("aria-rowindex", String(row));
      cell.setAttribute("aria-colindex", String(column));

      if (value === 0) {
        cell.setAttribute("aria-label", `第 ${row} 行第 ${column} 列，空地`);
      } else {
        const stage = tileStage(value);
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.value = String(value);
        if (value > 4096) tile.dataset.large = "true";
        if (index === newestTileIndex) tile.classList.add("is-new");
        if (mergedTileIndices.has(index)) tile.classList.add("is-merged");

        const symbol = document.createElement("span");
        symbol.className = "tile-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = stage.symbol;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = stage.label;

        const number = document.createElement("span");
        number.className = "tile-number";
        number.textContent = String(value);

        tile.append(symbol, label, number);
        cell.append(tile);
        cell.setAttribute(
          "aria-label",
          `第 ${row} 行第 ${column} 列，${value}，${stage.label}`,
        );
      }

      rowElement.append(cell);
    }

    fragment.append(rowElement);
  }

  boardElement.replaceChildren(fragment);
  boardElement.setAttribute(
    "aria-label",
    `4×4 方块花园，已有 ${occupiedCount} 个样本，最高等级 ${largestValue || 0}`,
  );
  scoreElement.textContent = String(score);
  bestScoreElement.textContent = String(bestScore);
  updateControls();
}

function endGame() {
  phase = "gameover";
  setStatus("温室已经排满，且没有可继续合并的样本。");
  updateControls();
  announce(`本局结束，最终得分 ${score}。`);
}

function maybeAnnounceDiscovery() {
  const largestValue = Math.max(...board);
  if (largestValue < 64 || largestValue <= highestAnnouncedValue) return;

  highestAnnouncedValue = largestValue;
  const stage = tileStage(largestValue);
  announce(`新发现：${stage.label}，等级 ${largestValue}。`);
}

function move(direction) {
  if (phase !== "active") return;

  const result = calculateMove(direction);
  newestTileIndex = -1;
  mergedTileIndices = result.mergedIndices;

  if (!result.changed) {
    setStatus("这个方向没有变化，换个方向试试。");
    announce("这个方向没有变化。");
    if (!hasAvailableMove()) endGame();
    return;
  }

  board = result.board;
  score += result.gained;
  updateBestScore();
  newestTileIndex = addRandomTile();
  setStatus(result.gained > 0 ? `本步收获 ${result.gained} 分。` : "样本已重新排列。");
  renderBoard();
  const largestValue = Math.max(...board);
  const directionNames = { left: "左", right: "右", up: "上", down: "下" };
  announce(
    `向${directionNames[direction]}移动，${result.gained > 0 ? `获得 ${result.gained} 分，` : ""}当前分数 ${score}，最高等级 ${largestValue}。`,
  );
  maybeAnnounceDiscovery();

  if (!hasAvailableMove()) endGame();
}

function resetGame(activate = false) {
  board = Array(CELL_COUNT).fill(0);
  score = 0;
  newestTileIndex = addRandomTile();
  addRandomTile();
  mergedTileIndices = new Set();
  highestAnnouncedValue = 32;
  phase = activate ? "active" : "idle";
  keyboardArmed = activate;
  setStatus(
    activate
      ? "培育开始：把相同样本推到一起。"
      : "点“开始培育”，再用按钮移动所有样本。",
  );
  renderBoard();
}

function pauseGame(message = "培育已暂停。", announcement = "游戏已暂停。") {
  if (phase !== "active") return;
  phase = "paused";
  setStatus(message);
  updateControls();
  announce(announcement);
}

function toggleGame() {
  if (phase === "active") {
    pauseGame();
    return;
  }

  if (phase === "gameover") {
    resetGame(true);
    announce("新一轮方块花园开始。");
    return;
  }

  phase = "active";
  keyboardArmed = true;
  setStatus(phase === "active" ? "培育进行中：把相同样本推到一起。" : "");
  updateControls();
  announce("方块花园开始。");
}

toggleButton.addEventListener("click", toggleGame);

restartButton.addEventListener("click", () => {
  resetGame(false);
  announce("棋盘已重置，点击开始培育。");
});

directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    move(button.dataset.direction);
  });
});

window.addEventListener("keydown", (event) => {
  if (!keyboardArmed || phase !== "active") return;

  if (event.key === "Escape") {
    event.preventDefault();
    pauseGame();
    return;
  }

  const direction = KEY_DIRECTIONS[event.key];
  if (!direction) return;
  event.preventDefault();
  move(direction);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && phase === "active") {
    pauseGame("页面已隐藏，已自动暂停。", "页面已隐藏，游戏已自动暂停。");
  }
});

const embedRequested =
  new URLSearchParams(window.location.search).get("embed") === "1" ||
  window.self !== window.top;
if (embedRequested) document.documentElement.dataset.embed = "true";

bestScoreElement.textContent = String(bestScore);
resetGame(false);
