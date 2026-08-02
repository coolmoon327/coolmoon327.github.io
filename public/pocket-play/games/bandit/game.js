const BUDGET = 15;
const PROBABILITY_SET = [0.2, 0.5, 0.8];

const lab = document.querySelector('#lab');
const dashboard = document.querySelector('#dashboard');
const armsRegion = document.querySelector('#arms');
const armButtons = [...document.querySelectorAll('[data-arm]')];
const remainingOutput = document.querySelector('#remaining');
const totalRewardsOutput = document.querySelector('#total-rewards');
const statusOutput = document.querySelector('#status');
const outcome = document.querySelector('#outcome');
const optimalActionOutput = document.querySelector('#optimal-action');
const expectedRegretOutput = document.querySelector('#expected-regret');
const probabilitySummary = document.querySelector('#probability-summary');
const newTrialButton = document.querySelector('#new-trial');
const description = document.querySelector('#page-description');

const armViews = armButtons.map((button, index) => ({
  button,
  pulls: document.querySelector(`#arm-${index}-pulls`),
  rewards: document.querySelector(`#arm-${index}-rewards`),
  estimate: document.querySelector(`#arm-${index}-estimate`),
  fill: document.querySelector(`#arm-${index}-fill`),
  probability: document.querySelector(`#arm-${index}-probability`),
}));

const copy = {
  en: {
    title: 'Explore–Exploit Lab',
    description: 'A fifteen-pull lab for learning the explore–exploit trade-off.',
    dashboardLabel: 'Experiment budget and current result',
    armsLabel: 'Three actions with unknown reward probabilities',
    outcomeLabel: 'Revealed experiment result',
    newTrialLabel: 'Start a new experiment with the probabilities shuffled',
    initial: 'Choose an action. Numbers 1–3 work while this card has focus.',
    reward: (action, left) => `Action ${action} paid a reward. ${left} pulls left.`,
    miss: (action, left) => `Action ${action} returned no reward. ${left} pulls left.`,
    paused: 'Experiment paused while this page was hidden.',
    resumed: 'Experiment ready again. Choose any action to continue.',
    complete: (rewards) =>
      `Budget used. You observed ${rewards} rewards; the hidden rates are now revealed.`,
    optimal: (action, probability) => `Action ${action} · ${probability}`,
    regretUnit: (value) => `${value} rewards`,
    probabilityItem: (action, probability) => `A${action} ${probability}`,
    armLabel: ({ action, pulls, rewards, estimate, probability, optimal, disabled }) => {
      const estimateText =
        estimate === null ? 'not sampled' : `${Math.round(estimate * 100)} percent`;
      const revealed =
        probability === null
          ? 'The true probability is still hidden.'
          : `True probability ${Math.round(probability * 100)} percent.${optimal ? ' This was optimal.' : ''}`;
      const instruction = disabled ? 'Selection unavailable.' : `Press ${action} to select.`;
      return `Action ${action}. ${pulls} pulls, ${rewards} rewards, Q estimate ${estimateText}. ${revealed} ${instruction}`;
    },
  },
  zh: {
    title: '探索与利用',
    description: '用十五次选择理解探索与利用之间的权衡。',
    dashboardLabel: '实验预算与当前结果',
    armsLabel: '三个奖励概率未知的动作',
    outcomeLabel: '已揭晓的实验结果',
    newTrialLabel: '重新打乱概率并开始一次新实验',
    initial: '请选择一个选项；聚焦本卡片时可按数字 1–3。',
    reward: (action, left) => `选项 ${action} 获得奖励，还剩 ${left} 次。`,
    miss: (action, left) => `选项 ${action} 没有奖励，还剩 ${left} 次。`,
    paused: '页面隐藏期间，实验已暂停。',
    resumed: '实验已恢复，请选择任一动作继续。',
    complete: (rewards) => `预算用完：共观察到 ${rewards} 次奖励，真实概率现已揭晓。`,
    optimal: (action, probability) => `选项 ${action} · ${probability}`,
    regretUnit: (value) => `${value} 个回报单位`,
    probabilityItem: (action, probability) => `选项 ${action}：${probability}`,
    armLabel: ({ action, pulls, rewards, estimate, probability, optimal, disabled }) => {
      const estimateText = estimate === null ? '尚未尝试' : `${Math.round(estimate * 100)}%`;
      const revealed =
        probability === null
          ? '真实概率仍隐藏。'
          : `真实奖励概率为 ${Math.round(probability * 100)}%。${optimal ? '这是最优选项。' : ''}`;
      const instruction = disabled ? '当前不可选择。' : `按数字 ${action} 选择。`;
      return `选项 ${action}，已选择 ${pulls} 次，获得 ${rewards} 次奖励，Q 值估计为 ${estimateText}。${revealed}${instruction}`;
    },
  },
};

let arms = [];
let remaining = BUDGET;
let totalRewards = 0;
let finished = false;
let suspended = document.hidden;
let statusState = { kind: suspended ? 'paused' : 'initial' };
let lastArm = -1;
let lastReward = false;

function language() {
  return window.PocketRuntime.lang === 'zh' ? 'zh' : 'en';
}

function localized() {
  return copy[language()];
}

function shuffle(values) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function percentage(value) {
  return `${Math.round(value * 100)}%`;
}

function estimate(arm) {
  return arm.pulls === 0 ? null : arm.rewards / arm.pulls;
}

function bestArmIndex() {
  const bestProbability = Math.max(...arms.map((arm) => arm.probability));
  return arms.findIndex((arm) => arm.probability === bestProbability);
}

function expectedRegret() {
  const bestProbability = Math.max(...PROBABILITY_SET);
  const oracleExpectedReward = BUDGET * bestProbability;
  const chosenExpectedReward = arms.reduce((sum, arm) => sum + arm.pulls * arm.probability, 0);
  return Math.max(0, oracleExpectedReward - chosenExpectedReward);
}

function statusText(strings) {
  if (statusState.kind === 'reward') {
    return strings.reward(statusState.action, remaining);
  }
  if (statusState.kind === 'miss') {
    return strings.miss(statusState.action, remaining);
  }
  if (statusState.kind === 'paused') return strings.paused;
  if (statusState.kind === 'resumed') return strings.resumed;
  if (statusState.kind === 'complete') return strings.complete(totalRewards);
  return strings.initial;
}

function render() {
  const strings = localized();
  const bestIndex = finished ? bestArmIndex() : -1;
  const controlsDisabled = finished || suspended;

  document.title = strings.title;
  description.content = strings.description;
  dashboard.setAttribute('aria-label', strings.dashboardLabel);
  armsRegion.setAttribute('aria-label', strings.armsLabel);
  outcome.setAttribute('aria-label', strings.outcomeLabel);
  newTrialButton.setAttribute('aria-label', strings.newTrialLabel);

  remainingOutput.textContent = String(remaining);
  totalRewardsOutput.textContent = String(totalRewards);
  statusOutput.textContent = statusText(strings);
  lab.classList.toggle('is-finished', finished);

  arms.forEach((arm, index) => {
    const view = armViews[index];
    const qEstimate = estimate(arm);
    view.pulls.textContent = String(arm.pulls);
    view.rewards.textContent = String(arm.rewards);
    view.estimate.textContent = qEstimate === null ? '—' : percentage(qEstimate);
    view.fill.style.width = qEstimate === null ? '0%' : percentage(qEstimate);
    view.probability.textContent = finished ? `p = ${percentage(arm.probability)}` : 'p = ?';
    view.button.disabled = controlsDisabled;
    view.button.classList.toggle('is-best', index === bestIndex);
    view.button.dataset.last = index === lastArm ? (lastReward ? 'reward' : 'miss') : '';
    view.button.setAttribute(
      'aria-label',
      strings.armLabel({
        action: index + 1,
        pulls: arm.pulls,
        rewards: arm.rewards,
        estimate: qEstimate,
        probability: finished ? arm.probability : null,
        optimal: index === bestIndex,
        disabled: controlsDisabled,
      }),
    );
  });

  outcome.hidden = !finished;
  if (finished) {
    const bestIndex = bestArmIndex();
    const regret = expectedRegret().toFixed(1);
    optimalActionOutput.textContent = strings.optimal(
      bestIndex + 1,
      percentage(arms[bestIndex].probability),
    );
    expectedRegretOutput.textContent = strings.regretUnit(regret);
    probabilitySummary.textContent = arms
      .map((arm, index) => strings.probabilityItem(index + 1, percentage(arm.probability)))
      .join(' · ');
  }
}

function pullArm(index) {
  if (finished || suspended || document.hidden) return;

  const arm = arms[index];
  const rewarded = Math.random() < arm.probability;
  arm.pulls += 1;
  remaining -= 1;
  lastArm = index;
  lastReward = rewarded;

  if (rewarded) {
    arm.rewards += 1;
    totalRewards += 1;
  }

  if (remaining === 0) {
    finished = true;
    statusState = { kind: 'complete' };
  } else {
    statusState = { kind: rewarded ? 'reward' : 'miss', action: index + 1 };
  }

  render();
  if (finished) newTrialButton.focus();
}

function startTrial(focusFirst = false) {
  arms = shuffle(PROBABILITY_SET).map((probability) => ({
    probability,
    pulls: 0,
    rewards: 0,
  }));
  remaining = BUDGET;
  totalRewards = 0;
  finished = false;
  suspended = document.hidden;
  statusState = { kind: suspended ? 'paused' : 'initial' };
  lastArm = -1;
  lastReward = false;
  render();
  if (focusFirst && !suspended) armButtons[0].focus();
}

armButtons.forEach((button, index) => {
  button.addEventListener('click', () => pullArm(index));
});

lab.addEventListener('keydown', (event) => {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    !lab.contains(document.activeElement)
  ) {
    return;
  }

  const index = ['1', '2', '3'].indexOf(event.key);
  if (index === -1) return;
  event.preventDefault();
  pullArm(index);
});

newTrialButton.addEventListener('click', () => startTrial(true));

document.addEventListener('visibilitychange', () => {
  if (finished) return;
  suspended = document.hidden;
  statusState = { kind: suspended ? 'paused' : 'resumed' };
  render();
});

window.PocketRuntime.onChange(render);
startTrial();
