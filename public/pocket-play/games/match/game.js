const symbols = [
  { id: 'blossom', glyph: '✿', en: 'blossom', zh: '花朵' },
  { id: 'moon', glyph: '☾', en: 'crescent moon', zh: '月牙' },
  { id: 'ripple', glyph: '⌁', en: 'ripple', zh: '涟漪' },
  { id: 'star', glyph: '✦', en: 'star', zh: '星星' },
  { id: 'cloud', glyph: '☁', en: 'cloud', zh: '云朵' },
  { id: 'sunburst', glyph: '❋', en: 'sunburst', zh: '日芒' },
  { id: 'ring', glyph: '◌', en: 'ring', zh: '圆环' },
  { id: 'clover', glyph: '♧', en: 'clover', zh: '三叶草' },
];
const board = document.querySelector('#board');
const stats = document.querySelector('.stats');
const movesOutput = document.querySelector('#moves');
const pairsOutput = document.querySelector('#pairs');
const bestOutput = document.querySelector('#best');
const statusOutput = document.querySelector('#status');
const resetButton = document.querySelector('#reset');

let openCards = [];
let moves = 0;
let pairs = 0;
let locked = false;
let turnTimer = 0;
let bestScore = readBest();
let statusState = { kind: 'initial' };

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function symbolName(id) {
  const symbol = symbols.find((candidate) => candidate.id === id);
  return text(symbol.en, symbol.zh);
}

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
    const stored = Number.parseInt(localStorage.getItem('pocket-play.match.best'), 10);
    return Number.isFinite(stored) && stored > 0 ? stored : null;
  } catch {
    return null;
  }
}

function writeBest(value) {
  bestScore = value;
  try {
    localStorage.setItem('pocket-play.match.best', String(value));
  } catch {
    // Sandboxed embeds may intentionally deny storage.
  }
}

function updateStats() {
  movesOutput.textContent = String(moves);
  pairsOutput.textContent = `${pairs} / 8`;
  bestOutput.textContent = bestScore ?? '—';
}

function cardState(button) {
  if (button.classList.contains('is-matched')) return 'matched';
  if (button.classList.contains('is-open')) return 'open';
  return 'hidden';
}

function describeCard(button, state = cardState(button)) {
  const position = Number(button.dataset.position) + 1;
  const symbol = symbolName(button.dataset.symbol);

  if (state === 'hidden') {
    button.setAttribute('aria-disabled', 'false');
    button.setAttribute(
      'aria-label',
      text(`Card ${position}, face down`, `第 ${position} 张牌，未翻开`),
    );
  } else if (state === 'matched') {
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute(
      'aria-label',
      text(`Card ${position}, matched ${symbol}`, `第 ${position} 张牌，已配对 ${symbol}`),
    );
  } else {
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute(
      'aria-label',
      text(`Card ${position}, symbol ${symbol}`, `第 ${position} 张牌，图案 ${symbol}`),
    );
  }
}

function statusText() {
  if (statusState.kind === 'pair') {
    const name = symbolName(statusState.symbol);
    return text(`Pair found: ${name}.`, `找到一对${name}。`);
  }
  if (statusState.kind === 'mismatch') {
    return text('The symbols differ. Remember their positions.', '图案不同，记住它们的位置。');
  }
  if (statusState.kind === 'finished-best') {
    return text(
      `The garden is in bloom! Finished in ${moves} moves — a new best.`,
      `花园盛开了！${moves} 步完成，也是新的最佳成绩。`,
    );
  }
  if (statusState.kind === 'finished') {
    return text(
      `The garden is in bloom! You found every pair in ${moves} moves.`,
      `花园盛开了！你用 ${moves} 步找齐了全部图案。`,
    );
  }
  if (statusState.kind === 'hidden-close') {
    return text(
      'Unmatched cards were closed while the page was hidden.',
      '页面切到后台时，未配对的牌已自动翻回背面。',
    );
  }
  return text('Find the eight hidden pairs.', '找出八对藏在叶片下的图案。');
}

function renderUI() {
  updateStats();
  statusOutput.textContent = statusText();
  resetButton.textContent = text('New board', '新一局');
  resetButton.setAttribute('aria-label', text('Start a new matching board', '开始新一局翻牌'));
  stats.setAttribute('aria-label', text('Game status', '本局状态'));
  board.setAttribute(
    'aria-label',
    text(
      `Four by four matching board, ${pairs} of 8 pairs found`,
      `四乘四翻牌棋盘，已找到 ${pairs} / 8 对`,
    ),
  );
  board.querySelectorAll('.card').forEach((button) => describeCard(button));
}

function closeUnmatched() {
  openCards.forEach((card) => {
    card.classList.remove('is-open');
    describeCard(card, 'hidden');
  });
  openCards = [];
  locked = false;
  turnTimer = 0;
}

function finishGame() {
  const previousBest = bestScore;
  if (!previousBest || moves < previousBest) {
    writeBest(moves);
    statusState = { kind: 'finished-best' };
  } else {
    statusState = { kind: 'finished' };
  }
  renderUI();
}

function compareOpenCards() {
  const [first, second] = openCards;
  moves += 1;

  if (first.dataset.symbol === second.dataset.symbol) {
    pairs += 1;
    openCards.forEach((card) => {
      card.classList.remove('is-open');
      card.classList.add('is-matched');
      describeCard(card, 'matched');
    });
    openCards = [];
    locked = false;
    statusState = { kind: 'pair', symbol: first.dataset.symbol };
    renderUI();
    if (pairs === symbols.length) finishGame();
    return;
  }

  locked = true;
  statusState = { kind: 'mismatch' };
  renderUI();
  turnTimer = window.setTimeout(closeUnmatched, 720);
}

function revealCard(button) {
  if (locked || button.classList.contains('is-open') || button.classList.contains('is-matched')) {
    return;
  }

  button.classList.add('is-open');
  describeCard(button, 'open');
  openCards.push(button);

  if (openCards.length === 2) compareOpenCards();
}

function buildBoard() {
  window.clearTimeout(turnTimer);
  moves = 0;
  pairs = 0;
  locked = false;
  openCards = [];
  statusState = { kind: 'initial' };
  board.replaceChildren();

  shuffle([...symbols, ...symbols]).forEach((symbol, position) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'card';
    button.dataset.position = String(position);
    button.dataset.symbol = symbol.id;
    button.textContent = symbol.glyph;
    describeCard(button, 'hidden');
    button.addEventListener('click', () => revealCard(button));
    board.append(button);
  });

  renderUI();
}

resetButton.addEventListener('click', buildBoard);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && locked) {
    window.clearTimeout(turnTimer);
    closeUnmatched();
    statusState = { kind: 'hidden-close' };
    renderUI();
  }
});

window.PocketRuntime.onChange(renderUI);
buildBoard();
