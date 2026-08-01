const symbols = ["✿", "☾", "⌁", "✦", "☁", "❋", "◌", "♧"];
const board = document.querySelector("#board");
const movesOutput = document.querySelector("#moves");
const pairsOutput = document.querySelector("#pairs");
const bestOutput = document.querySelector("#best");
const statusOutput = document.querySelector("#status");
const resetButton = document.querySelector("#reset");

let openCards = [];
let moves = 0;
let pairs = 0;
let locked = false;
let turnTimer = 0;
let bestScore = readBest();

function shuffle(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function readBest() {
  try {
    const stored = Number.parseInt(localStorage.getItem("pocket-play.match.best"), 10);
    return Number.isFinite(stored) && stored > 0 ? stored : null;
  } catch {
    return null;
  }
}

function writeBest(value) {
  bestScore = value;
  try {
    localStorage.setItem("pocket-play.match.best", String(value));
  } catch {
    // Sandboxed embeds may intentionally deny storage.
  }
}

function updateStats() {
  movesOutput.textContent = String(moves);
  pairsOutput.textContent = `${pairs} / 8`;
  bestOutput.textContent = bestScore ?? "—";
}

function describeCard(button, state) {
  const position = Number(button.dataset.position) + 1;
  const symbol = button.dataset.symbol;
  if (state === "hidden") {
    button.setAttribute("aria-disabled", "false");
    button.setAttribute("aria-label", `第 ${position} 张牌，未翻开`);
  } else if (state === "matched") {
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("aria-label", `第 ${position} 张牌，已配对 ${symbol}`);
  } else {
    button.setAttribute("aria-disabled", "true");
    button.setAttribute("aria-label", `第 ${position} 张牌，图案 ${symbol}`);
  }
}

function closeUnmatched() {
  openCards.forEach((card) => {
    card.classList.remove("is-open");
    describeCard(card, "hidden");
  });
  openCards = [];
  locked = false;
  turnTimer = 0;
}

function finishGame() {
  const previousBest = bestScore;
  if (!previousBest || moves < previousBest) {
    writeBest(moves);
    statusOutput.textContent = `花园盛开了！${moves} 步完成，也是新的最佳成绩。`;
  } else {
    statusOutput.textContent = `花园盛开了！你用 ${moves} 步找齐了全部图案。`;
  }
  updateStats();
}

function compareOpenCards() {
  const [first, second] = openCards;
  moves += 1;

  if (first.dataset.symbol === second.dataset.symbol) {
    pairs += 1;
    openCards.forEach((card) => {
      card.classList.remove("is-open");
      card.classList.add("is-matched");
      describeCard(card, "matched");
    });
    openCards = [];
    locked = false;
    statusOutput.textContent = `找到一对 ${first.dataset.symbol}。`;
    updateStats();
    if (pairs === symbols.length) finishGame();
    return;
  }

  locked = true;
  statusOutput.textContent = "图案不同，记住它们的位置。";
  updateStats();
  turnTimer = window.setTimeout(closeUnmatched, 720);
}

function revealCard(button) {
  if (
    locked ||
    button.classList.contains("is-open") ||
    button.classList.contains("is-matched")
  ) {
    return;
  }

  button.classList.add("is-open");
  describeCard(button, "open");
  openCards.push(button);

  if (openCards.length === 2) compareOpenCards();
}

function buildBoard() {
  window.clearTimeout(turnTimer);
  moves = 0;
  pairs = 0;
  locked = false;
  openCards = [];
  board.replaceChildren();

  shuffle([...symbols, ...symbols]).forEach((symbol, position) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.position = String(position);
    button.dataset.symbol = symbol;
    button.textContent = symbol;
    describeCard(button, "hidden");
    button.addEventListener("click", () => revealCard(button));
    board.append(button);
  });

  statusOutput.textContent = "找出八对藏在叶片下的图案。";
  updateStats();
}

resetButton.addEventListener("click", buildBoard);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && locked) {
    window.clearTimeout(turnTimer);
    closeUnmatched();
    statusOutput.textContent = "已在离开页面时收起未配对的牌。";
  }
});

buildBoard();
