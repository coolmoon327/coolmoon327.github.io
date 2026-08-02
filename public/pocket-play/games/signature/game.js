const sky = document.querySelector('#sky');
const lines = document.querySelector('#lines');
const count = document.querySelector('#count');
const prompt = document.querySelector('#prompt');
const message = document.querySelector('#message');

const maxPoints = 7;
const points = [];
const keyboardPoints = [
  { x: 17, y: 60 },
  { x: 30, y: 34 },
  { x: 44, y: 49 },
  { x: 57, y: 24 },
  { x: 73, y: 39 },
  { x: 64, y: 69 },
  { x: 84, y: 57 },
];
const fortunes = [
  { en: 'May you move slowly and still arrive.', zh: '愿你慢一点，也仍然抵达。' },
  { en: 'Tonight’s small light has been kept for you.', zh: '今晚的微光，刚好替你留着。' },
  { en: 'No rush; your star will shine in its own time.', zh: '别急，属于你的星会自己亮起来。' },
  { en: 'May this little path lead to a lighter mood.', zh: '愿这条小路，通向一点好心情。' },
  {
    en: 'Even a light placed casually can become a direction.',
    zh: '你随手落下的光，也算一种方向。',
  },
  { en: 'You have done enough today. Rest for a while.', zh: '今天已经够努力了，歇一会儿吧。' },
];

let mode = 'sleeping';
let viewState = 'sleeping';
let fortuneIndex = -1;

if (new URLSearchParams(window.location.search).get('embed') === '1') {
  document.documentElement.dataset.embed = 'true';
}

function text(english, chinese) {
  return window.PocketRuntime.text(english, chinese);
}

function selectedFortune() {
  if (fortuneIndex < 0) return '';
  const fortune = fortunes[fortuneIndex];
  return text(fortune.en, fortune.zh);
}

function renderUI() {
  let promptText;
  let messageText;
  let skyLabel;

  if (viewState === 'awakened') {
    promptText = text('Your next click leaves the first star', '下一次点击，会留下第一颗星');
    messageText = text(
      'The night is awake. Draw your stars slowly.',
      '夜色醒了。慢慢写下你的星点吧。',
    );
    skyLabel = text(
      'Stardust canvas awake. Click or press Enter to place the first star.',
      '星屑签名画布已唤醒。点击或按 Enter 放置第一颗星。',
    );
  } else if (viewState === 'cleared') {
    promptText = text('Fresh sky · place the first star', '星纸换新 · 落下第一颗星');
    messageText = text('The sky is fresh. Place the first star.', '星纸换新了。落下第一颗星吧。');
    skyLabel = text(
      'Fresh stardust canvas. Click or press Enter to place the first star.',
      '全新的星屑签名画布。点击或按 Enter 放置第一颗星。',
    );
  } else if (viewState === 'drawing') {
    promptText = text(
      `Keep drawing · ${points.length} / ${maxPoints}`,
      `继续写下星点 · ${points.length} / ${maxPoints}`,
    );
    messageText = text(`Star ${points.length} is in place.`, `第 ${points.length} 颗星，落好了。`);
    skyLabel = text(
      `Stardust canvas with ${points.length} stars. Click or press Enter to add the next star.`,
      `星屑签名画布，已放置 ${points.length} 颗星。点击或按 Enter 添加下一颗。`,
    );
  } else if (viewState === 'complete') {
    const fortune = selectedFortune();
    promptText = text('Signature complete · activate again to rewrite', '签名完成 · 再点一次重写');
    messageText = fortune;
    skyLabel = text(
      `Stardust signature complete. Note: ${fortune} Activate the canvas again to clear and rewrite it.`,
      `星屑签名已完成。签语：${fortune} 再次激活画布可以清空并重写。`,
    );
  } else {
    promptText = text('Click / Enter to wake the sky', '点一下 / Enter，唤醒夜色');
    messageText = text('Tap softly and wake the night.', '先轻轻点一下，让夜色醒来。');
    skyLabel = text('Wake the stardust signature canvas', '唤醒星屑签名画布');
  }

  count.textContent = `${points.length} / ${maxPoints}`;
  count.setAttribute(
    'aria-label',
    text(
      `Star count: ${points.length} of ${maxPoints}`,
      `星点数量：${points.length} / ${maxPoints}`,
    ),
  );
  prompt.textContent = promptText;
  message.textContent = messageText;
  sky.setAttribute('aria-label', skyLabel);
}

function awaken() {
  mode = 'drawing';
  viewState = 'awakened';
  sky.classList.add('is-awake');
  renderUI();
}

function clearSignature() {
  points.length = 0;
  fortuneIndex = -1;
  lines.replaceChildren();
  sky.querySelectorAll('.star').forEach((star) => star.remove());
  sky.classList.remove('is-complete');
  viewState = 'cleared';
  renderUI();
}

function pointFromEvent(event) {
  if (event.detail === 0) {
    return keyboardPoints[points.length];
  }

  const bounds = sky.getBoundingClientRect();
  const drawingWidth = sky.clientWidth;
  const drawingHeight = sky.clientHeight;
  const marginX = Math.min(12, (22 / drawingWidth) * 100);
  const marginY = Math.min(20, (22 / drawingHeight) * 100);
  const x = ((event.clientX - bounds.left - sky.clientLeft) / drawingWidth) * 100;
  const y = ((event.clientY - bounds.top - sky.clientTop) / drawingHeight) * 100;

  return {
    x: Math.max(marginX, Math.min(100 - marginX, x)),
    y: Math.max(marginY, Math.min(100 - marginY, y)),
  };
}

function drawConnection(from, to) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.classList.add('connection');
  line.setAttribute('x1', from.x);
  line.setAttribute('y1', from.y);
  line.setAttribute('x2', to.x);
  line.setAttribute('y2', to.y);
  line.setAttribute('pathLength', '1');
  lines.append(line);
}

function drawStar(point) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${point.x}%`;
  star.style.top = `${point.y}%`;
  sky.append(star);
}

function finishSignature() {
  mode = 'complete';
  viewState = 'complete';
  fortuneIndex = Math.floor(Math.random() * fortunes.length);
  sky.classList.add('is-complete');
  renderUI();
}

function addPoint(point) {
  const previous = points.at(-1);
  points.push(point);
  if (previous) drawConnection(previous, point);
  drawStar(point);

  if (points.length === maxPoints) {
    finishSignature();
  } else {
    viewState = 'drawing';
    renderUI();
  }
}

sky.addEventListener('click', (event) => {
  if (mode === 'sleeping') {
    awaken();
    return;
  }

  if (mode === 'complete') {
    mode = 'drawing';
    clearSignature();
    return;
  }

  addPoint(pointFromEvent(event));
});

window.PocketRuntime.onChange(renderUI);
renderUI();
