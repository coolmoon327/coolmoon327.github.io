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
  { en: 'Small steps still move an idea forward.', zh: '慢一点也没关系，想法仍在向前生长。' },
  { en: 'One clear question is enough to begin.', zh: '一个清楚的问题，就足以成为开始。' },
  {
    en: 'The useful connection may be the one you almost missed.',
    zh: '最有用的联系，也许藏在刚才差点忽略的地方。',
  },
  { en: 'A detour can still become part of the method.', zh: '绕一点路，也可能长成方法的一部分。' },
  {
    en: 'Scattered observations can still form a direction.',
    zh: '零散的观察连起来，也会显出方向。',
  },
  {
    en: 'Save the thought and rest; tomorrow is another iteration.',
    zh: '把想法记下，先休息，明天再迭代。',
  },
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
    promptText = text('Next click places the first idea', '下一次点击会留下第一个想法');
    messageText = text(
      'Blank map ready. Connect ideas at your own pace.',
      '空白星图已经准备好，按自己的节奏连接想法吧。',
    );
    skyLabel = text(
      'Idea constellation canvas open. Click or press Enter to place the first idea node.',
      '灵感星图画布已打开。点击或按 Enter 键放置第一个灵感节点。',
    );
  } else if (viewState === 'cleared') {
    promptText = text('Fresh map · place the first idea', '新星图 · 留下第一个想法');
    messageText = text(
      'The map is clear. Place the first idea node.',
      '星图已经清空，留下第一个灵感节点吧。',
    );
    skyLabel = text(
      'Fresh idea constellation canvas. Click or press Enter to place the first idea node.',
      '全新的灵感星图画布。点击或按 Enter 键放置第一个灵感节点。',
    );
  } else if (viewState === 'drawing') {
    promptText = text(
      `Keep connecting · ${points.length} / ${maxPoints}`,
      `继续连接 · ${points.length} / ${maxPoints}`,
    );
    messageText = text(
      `Idea node ${points.length} recorded.`,
      `已记下第 ${points.length} 个灵感节点。`,
    );
    skyLabel = text(
      `Idea constellation with ${points.length} nodes. Click or press Enter to add the next idea node.`,
      `灵感星图已有 ${points.length} 个节点。点击或按 Enter 键添加下一个灵感节点。`,
    );
  } else if (viewState === 'complete') {
    const fortune = selectedFortune();
    promptText = text('Map complete · activate again to redraw', '星图完成 · 再点一次重新绘制');
    messageText = fortune;
    skyLabel = text(
      `Idea constellation complete. Note: ${fortune} Activate the canvas again to clear and redraw it.`,
      `灵感星图已完成。札记：${fortune} 再点一下画布即可清空重画。`,
    );
  } else {
    promptText = text('Click / Enter to open a blank map', '点击或按 Enter，打开空白星图');
    messageText = text(
      'Open a blank map, then place seven idea nodes.',
      '先打开空白星图，再点下七个灵感节点。',
    );
    skyLabel = text('Open the idea constellation canvas', '打开灵感星图画布');
  }

  count.textContent = `${points.length} / ${maxPoints}`;
  count.setAttribute(
    'aria-label',
    text(
      `Idea node count: ${points.length} of ${maxPoints}`,
      `灵感节点数：${points.length} / ${maxPoints}`,
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
