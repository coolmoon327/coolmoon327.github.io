const ROUNDS = [
  { gamma: 0.5, a: [4, 0, 0], b: [0, 4, 4] },
  { gamma: 0.9, a: [5, 0, 0], b: [0, 3, 3] },
  { gamma: 0.7, a: [-1, 5, 2], b: [2, 1, 1] },
  { gamma: 0.3, a: [1, 0, 8], b: [2, 1, 0] },
  { gamma: 0.8, a: [0, 4, -1, 3], b: [2, 0, 2, 1] },
  { gamma: 0.95, a: [3, 0, 0, 0], b: [0, 1, 1, 2] },
];

const game = document.querySelector('#game');
const pageDescription = document.querySelector('#page-description');
const roundStrip = document.querySelector('#round-strip');
const routes = document.querySelector('#routes');
const routeButtons = [...document.querySelectorAll('[data-route]')];
const routeAButton = document.querySelector('#route-a');
const scoreOutput = document.querySelector('#score');
const roundOutput = document.querySelector('#round');
const gammaOutput = document.querySelector('#gamma');
const progress = document.querySelector('#progress');
const rewardsA = document.querySelector('#rewards-a');
const rewardsB = document.querySelector('#rewards-b');
const returnAOutput = document.querySelector('#return-a');
const returnBOutput = document.querySelector('#return-b');
const reveal = document.querySelector('#reveal');
const verdict = document.querySelector('#verdict');
const termsA = document.querySelector('#terms-a');
const termsB = document.querySelector('#terms-b');
const totalAOutput = document.querySelector('#total-a');
const totalBOutput = document.querySelector('#total-b');
const status = document.querySelector('#status');
const announcer = document.querySelector('#announcer');
const nextButton = document.querySelector('#next');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const copy = {
  en: {
    title: 'Return Route',
    description: 'Compare short reward routes and learn how discounting changes their return.',
    roundLabel: 'Round and discount factor',
    routesLabel: 'Two reward routes',
    scoreLabel: 'Score',
    choose: 'Pick A or B. Earlier rewards usually matter more.',
    paused: 'Page hidden · your current round is safely paused.',
    correct: 'Correct',
    incorrect: 'Not this time',
    next: 'Next round',
    finish: 'Finish',
    restart: 'Play again',
    chooseButton: 'Choose a route',
    routeLabel: (name, rewards, available, value) =>
      `Route ${name}. Rewards ${rewards.join(', ')}.${available ? ` Discounted return ${value}.` : ''} Press ${name === 'A' ? '1 or Left Arrow' : '2 or Right Arrow'} to choose.`,
    result: (isCorrect, selected, correct, a, b, score, completed) =>
      `${isCorrect ? 'Correct.' : 'Incorrect.'} You chose route ${selected}; route ${correct} is higher. Route A returns ${a}; route B returns ${b}. Score ${score} after ${completed} rounds.`,
    complete: (score) => `Six routes compared · final score ${score} out of ${ROUNDS.length}.`,
    statusResult: (isCorrect, correct, a, b) =>
      `${isCorrect ? 'Correct.' : `Route ${correct} wins.`} A ${a} · B ${b}`,
    rewardStep: (step, reward) => `Step ${step} reward ${reward}`,
    term: (step, reward, weight, value) =>
      `Step ${step}: reward ${reward} times discount weight ${weight} equals ${value}`,
  },
  zh: {
    title: '折扣回报',
    description: '比较几组简短的奖励序列，观察折扣因子如何改变累积折扣回报。',
    roundLabel: '当前回合与折扣因子',
    routesLabel: '两条奖励路线',
    scoreLabel: '得分',
    choose: '选择 A 或 B；越早获得的奖励通常越重要。',
    paused: '页面已隐藏，当前回合已暂停。',
    correct: '回答正确',
    incorrect: '这次不对',
    next: '下一回合',
    finish: '查看结果',
    restart: '再玩一次',
    chooseButton: '请先选择路线',
    routeLabel: (name, rewards, available, value) =>
      `路线 ${name}，奖励依次为 ${rewards.join('、')}。${available ? `折扣回报为 ${value}。` : ''}按${name === 'A' ? '数字 1 或左方向键' : '数字 2 或右方向键'}选择。`,
    result: (isCorrect, selected, correct, a, b, score, completed) =>
      `${isCorrect ? '回答正确。' : '回答错误。'}你选择了路线 ${selected}；路线 ${correct} 的回报更高。路线 A 的折扣回报为 ${a}，路线 B 的折扣回报为 ${b}。完成 ${completed} 回合，得分 ${score}。`,
    complete: (score) => `六组路线比较完成，最终得分 ${score} / ${ROUNDS.length}。`,
    statusResult: (isCorrect, correct, a, b) =>
      `${isCorrect ? '回答正确。' : `路线 ${correct} 更高。`}A ${a} · B ${b}`,
    rewardStep: (step, reward) => `第 ${step} 步奖励 ${reward}`,
    term: (step, reward, weight, value) =>
      `第 ${step} 步：奖励 ${reward} 乘折扣权重 ${weight}，对总回报的贡献为 ${value}`,
  },
};

let roundIndex = 0;
let score = 0;
let phase = 'choice';
let selected = '';
let suspended = document.hidden;

function language() {
  return window.PocketRuntime.lang === 'zh' ? 'zh' : 'en';
}

function strings() {
  return copy[language()];
}

function discountedReturn(rewards, gamma) {
  return rewards.reduce((sum, reward, index) => sum + reward * gamma ** index, 0);
}

function roundValues(round = ROUNDS[roundIndex]) {
  const a = discountedReturn(round.a, round.gamma);
  const b = discountedReturn(round.b, round.gamma);
  return { a, b, correct: a > b ? 'a' : 'b' };
}

function displayNumber(value) {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value;
  return normalized.toFixed(2);
}

function dataNumber(value) {
  return value.toFixed(3);
}

function rewardText(value) {
  if (value > 0) return `+${value}`;
  return String(value).replace('-', '−');
}

function contributionText(value, index) {
  const amount = displayNumber(Math.abs(value));
  if (index === 0) return value < 0 ? `−${amount}` : amount;
  return `${value < 0 ? '−' : '+'}${amount}`;
}

function renderRewards(container, rewards, localized) {
  const nodes = rewards.map((reward, index) => {
    const chip = document.createElement('span');
    chip.className = 'reward';
    chip.dataset.step = String(index);
    chip.dataset.reward = String(reward);
    chip.textContent = rewardText(reward);
    chip.title = localized.rewardStep(index + 1, reward);
    return chip;
  });
  container.replaceChildren(...nodes);
}

function renderTerms(container, rewards, gamma, localized) {
  const nodes = rewards.map((reward, index) => {
    const weight = gamma ** index;
    const value = reward * weight;
    const term = document.createElement('span');
    term.className = 'term';
    term.dataset.step = String(index);
    term.dataset.reward = String(reward);
    term.dataset.weight = dataNumber(weight);
    term.dataset.value = dataNumber(value);
    term.style.setProperty('--delay', `${index * 65}ms`);
    term.textContent = contributionText(value, index);
    term.title = localized.term(
      index + 1,
      reward,
      displayNumber(weight),
      displayNumber(value),
    );
    return term;
  });
  container.replaceChildren(...nodes);
}

function resultState(values) {
  if (suspended) return 'paused';
  if (phase === 'choice') return 'pending';
  if (phase === 'complete') return 'complete';
  return selected === values.correct ? 'correct' : 'incorrect';
}

function statusText(localized, values) {
  if (suspended) return localized.paused;
  if (phase === 'choice') return localized.choose;
  if (phase === 'complete') return localized.complete(score);
  return localized.statusResult(
    selected === values.correct,
    values.correct.toUpperCase(),
    displayNumber(values.a),
    displayNumber(values.b),
  );
}

function announcement(localized, values) {
  if (suspended) return localized.paused;
  if (phase === 'choice') return localized.choose;
  if (phase === 'complete') return localized.complete(score);
  return localized.result(
    selected === values.correct,
    selected.toUpperCase(),
    values.correct.toUpperCase(),
    displayNumber(values.a),
    displayNumber(values.b),
    score,
    roundIndex + 1,
  );
}

function render() {
  const localized = strings();
  const round = ROUNDS[roundIndex];
  const values = roundValues(round);
  const revealed = phase === 'revealed' || phase === 'complete';
  const state = resultState(values);
  const renderedPhase = suspended ? 'paused' : phase;

  document.title = localized.title;
  pageDescription.content = localized.description;
  roundStrip.setAttribute('aria-label', localized.roundLabel);
  routes.setAttribute('aria-label', localized.routesLabel);
  game.setAttribute('aria-label', `${localized.title}. ${localized.roundLabel}.`);
  game.querySelector('.score-card').setAttribute('aria-label', localized.scoreLabel);

  scoreOutput.textContent = String(score);
  roundOutput.textContent = String(roundIndex + 1);
  gammaOutput.textContent = String(round.gamma);
  progress.style.width = `${((roundIndex + (phase === 'choice' ? 0 : 1)) / ROUNDS.length) * 100}%`;

  renderRewards(rewardsA, round.a, localized);
  renderRewards(rewardsB, round.b, localized);
  renderTerms(termsA, round.a, round.gamma, localized);
  renderTerms(termsB, round.b, round.gamma, localized);

  returnAOutput.textContent = revealed ? displayNumber(values.a) : '?';
  returnBOutput.textContent = revealed ? displayNumber(values.b) : '?';
  totalAOutput.textContent = `= ${displayNumber(values.a)}`;
  totalBOutput.textContent = `= ${displayNumber(values.b)}`;

  routeButtons.forEach((button) => {
    const routeId = button.dataset.route;
    const name = routeId.toUpperCase();
    const rewards = round[routeId];
    const value = values[routeId];
    button.disabled = suspended || phase !== 'choice';
    button.dataset.correct = String(routeId === values.correct);
    button.dataset.selected = String(routeId === selected);
    button.dataset.return = dataNumber(value);
    button.setAttribute('aria-pressed', String(routeId === selected));
    button.setAttribute(
      'aria-label',
      localized.routeLabel(name, rewards, revealed, displayNumber(value)),
    );
  });

  reveal.dataset.visible = String(revealed);
  reveal.setAttribute('aria-hidden', String(!revealed));
  verdict.textContent =
    phase === 'complete'
      ? `${score} / ${ROUNDS.length}`
      : selected === values.correct
        ? localized.correct
        : localized.incorrect;
  verdict.dataset.result = state;

  status.textContent = statusText(localized, values);
  announcer.textContent = announcement(localized, values);

  nextButton.disabled = suspended || phase === 'choice';
  if (phase === 'complete') {
    nextButton.textContent = localized.restart;
  } else if (phase === 'revealed' && roundIndex === ROUNDS.length - 1) {
    nextButton.textContent = localized.finish;
  } else if (phase === 'revealed') {
    nextButton.textContent = localized.next;
  } else {
    nextButton.textContent = localized.chooseButton;
  }
  nextButton.setAttribute('aria-label', nextButton.textContent);

  game.dataset.phase = renderedPhase;
  game.dataset.pausedFrom = suspended ? phase : '';
  game.dataset.round = String(roundIndex + 1);
  game.dataset.roundIndex = String(roundIndex);
  game.dataset.totalRounds = String(ROUNDS.length);
  game.dataset.gamma = round.gamma.toFixed(2);
  game.dataset.correct = values.correct;
  game.dataset.selected = selected;
  game.dataset.returnA = dataNumber(values.a);
  game.dataset.returnB = dataNumber(values.b);
  game.dataset.result = state;
  game.dataset.score = String(score);
  game.dataset.suspended = String(suspended);
  game.dataset.motion = reducedMotion.matches ? 'reduced' : 'full';
}

function chooseRoute(routeId) {
  if (suspended || document.hidden || phase !== 'choice') return;

  const values = roundValues();
  selected = routeId;
  if (selected === values.correct) score += 1;
  phase = 'revealed';
  render();
  nextButton.focus();
}

function advance() {
  if (suspended || document.hidden) return;

  if (phase === 'complete') {
    roundIndex = 0;
    score = 0;
    selected = '';
    phase = 'choice';
    render();
    routeAButton.focus();
    return;
  }

  if (phase !== 'revealed') return;

  if (roundIndex === ROUNDS.length - 1) {
    phase = 'complete';
    render();
    nextButton.focus();
    return;
  }

  roundIndex += 1;
  selected = '';
  phase = 'choice';
  render();
  routeAButton.focus();
}

routeButtons.forEach((button) => {
  button.addEventListener('click', () => chooseRoute(button.dataset.route));
});

nextButton.addEventListener('click', advance);

game.addEventListener('keydown', (event) => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

  const key = event.key.toLowerCase();
  const chooseA = key === '1' || key === 'a' || event.key === 'ArrowLeft';
  const chooseB = key === '2' || key === 'b' || event.key === 'ArrowRight';

  if (phase === 'choice' && chooseA) {
    event.preventDefault();
    chooseRoute('a');
  } else if (phase === 'choice' && chooseB) {
    event.preventDefault();
    chooseRoute('b');
  } else if ((phase === 'revealed' || phase === 'complete') && key === 'n') {
    event.preventDefault();
    advance();
  }
});

document.addEventListener('visibilitychange', () => {
  suspended = document.hidden;
  render();
});

reducedMotion.addEventListener('change', render);
window.PocketRuntime.onChange(render);
render();
