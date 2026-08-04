(() => {
  'use strict';

  const TOTAL_SLOTS = 12;
  const SEGMENT_SIZE = 3;
  const CHECKPOINTS = 3;
  const RECENT_WINDOW = 4;
  const MONITOR_THRESHOLD = 1 / 3;
  const runtime = window.PocketRuntime;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const game = document.querySelector('#game');
  const pageDescription = document.querySelector('#page-description');
  const timeline = document.querySelector('#timeline');
  const prompt = document.querySelector('#prompt');
  const responseCopy = document.querySelector('#response-copy');
  const responseGroup = document.querySelector('#response-actions');
  const responseButtons = [...document.querySelectorAll('[data-response]')];
  const resetButton = document.querySelector('#reset-button');
  const startButton = document.querySelector('#start-button');
  const announcer = document.querySelector('#announcer');
  const deliveredOutput = document.querySelector('#delivered');
  const violationOutput = document.querySelector('#violation-rate');
  const marginOutput = document.querySelector('#semantic-margin');
  const costOutput = document.querySelector('#response-cost');
  const checkpointOutput = document.querySelector('#checkpoint');
  const rateFill = document.querySelector('#rate-fill');

  const copy = {
    en: {
      title: 'Semantic Sentinel',
      description:
        'Watch a twelve-slot semantic trace and decide when a wireless controller should hold, repair locally, or probe longer.',
      ready:
        'Start the trace. Isolated failures are noise; persistent mismatch calls for a response.',
      running: (slot) =>
        `Slot ${slot}/${TOTAL_SLOTS} · the STL layer observes meaning over time, but never changes reward.`,
      decision: (checkpoint, rate, margin) =>
        `Checkpoint ${checkpoint}/${CHECKPOINTS} · recent violations ${rate}, semantic margin ${margin}. How much response is justified?`,
      paused: 'Page hidden · the trace is paused without losing the current slot.',
      complete: (score, delivered, cost) =>
        `Trace complete · score ${score}/100, ${delivered} packets delivered, response cost ${cost}.`,
      correctHold: 'Good restraint: an isolated mismatch did not justify structural change.',
      correctRepair: 'Good repair: persistent drift justified a small, targeted response.',
      correctProbe:
        'Good escalation: drift survived local repair, so a longer probe was justified.',
      tooEarly: 'The response was stronger than the evidence justified; extra cost was added.',
      tooLate: 'The response lagged the evidence; the next segment remains exposed to drift.',
      responseReady: 'Choose only when the trace pauses at a checkpoint.',
      responseRunning: 'The response layer is separate and waits for the monitor report.',
      responseDecision: 'Choose a response for the next segment: keys 1, 2, or 3.',
      responseComplete:
        'The monitor reported evidence; your independent responses shaped recovery cost.',
      start: 'Start trace',
      restart: 'New trace',
      responseLabel: 'Choose a controller response',
      timelineEmpty: 'Empty twelve-slot observation, action, and result timeline',
      timelineSummary: (completed, violations, response) =>
        `Twelve-slot observation, action, and result timeline. ${completed} slots complete, ${violations} semantic violations. Current response ${response}.`,
      rowObservation: 'Obs.',
      rowAction: 'Act.',
      rowResult: 'Result',
      clear: 'clear channel observed',
      carrier: 'usable carrier observed',
      send: 'send',
      reuse: 'reuse signal',
      probe: 'long probe',
      success: 'result matched the observation',
      failure: 'result violated the observation',
      probed: 'probe slot, no reward sample',
      responseNames: { hold: 'hold', repair: 'local repair', probe: 'probe longer' },
      choiceAnnouncement: (choice, message) => `${choice}. ${message}`,
    },
    zh: {
      title: '时序语义哨兵',
      description: '观察 12 时隙语义轨迹，判断无线控制器何时应保持现状、局部修复或延长探测。',
      ready: '启动轨迹。零星失败可能只是噪声，持续的不一致才需要响应。',
      running: (slot) =>
        `第 ${slot}/${TOTAL_SLOTS} 个时隙 · STL 层只监测一段时间内的语义一致性，不直接修改奖励。`,
      decision: (checkpoint, rate, margin) =>
        `检查点 ${checkpoint}/${CHECKPOINTS} · 近期违例率 ${rate}，语义裕度 ${margin}。现有证据足以支持哪种响应？`,
      paused: '页面已隐藏，轨迹已暂停，当前时隙不会丢失。',
      complete: (score, delivered, cost) =>
        `轨迹结束 · 得分 ${score}/100，成功传输 ${delivered} 个数据包，响应成本 ${cost}。`,
      correctHold: '判断克制：一次孤立的不一致还不足以支持结构调整。',
      correctRepair: '判断合理：持续漂移足以支持一次小范围、定向的修复。',
      correctProbe: '升级合理：局部修复后漂移仍在，值得采用更长的探测。',
      tooEarly: '当前证据还不支持这么强的响应，系统因此付出了额外成本。',
      tooLate: '响应落后于监测证据，下一段轨迹仍会暴露在语义漂移下。',
      responseReady: '轨迹停在检查点时，再选择控制器的响应。',
      responseRunning: '响应层与监测层相互独立，正在等待监测器给出证据。',
      responseDecision: '请为下一段轨迹选择响应，也可按数字键 1、2 或 3。',
      responseComplete: '监测器只提供证据；恢复效果与成本来自你在响应层作出的选择。',
      start: '启动轨迹',
      restart: '生成新轨迹',
      responseLabel: '选择控制器响应',
      timelineEmpty: '空白的 12 时隙观测、动作与结果时间线',
      timelineSummary: (completed, violations, response) =>
        `12 时隙观测、动作与结果时间线。已完成 ${completed} 个时隙，其中 ${violations} 次语义违例；当前响应为${response}。`,
      rowObservation: '观测',
      rowAction: '动作',
      rowResult: '结果',
      clear: '观测到信道空闲',
      carrier: '观测到可用载波',
      send: '发送',
      reuse: '复用信号',
      probe: '延长探测',
      success: '结果与观测语义相符',
      failure: '结果违背观测语义',
      probed: '探测时隙，不产生奖励样本',
      responseNames: { hold: '保持', repair: '局部修复', probe: '延长探测' },
      choiceAnnouncement: (choice, message) => `选择${choice}。${message}`,
    },
  };

  const scenarios = [
    { driftStart: 3, kind: 'repairable', noiseSlot: 1 },
    { driftStart: 3, kind: 'persistent', noiseSlot: 2 },
    { driftStart: 6, kind: 'repairable', noiseSlot: 1 },
    { driftStart: 6, kind: 'persistent', noiseSlot: 2 },
  ];
  const responseRank = { hold: 0, repair: 1, probe: 2 };
  const cells = { observation: [], action: [], result: [] };

  let phase = 'ready';
  let suspended = document.hidden;
  let slotIndex = 0;
  let checkpoint = 0;
  let delivered = 0;
  let responseCost = 0;
  let correctChoices = 0;
  let lateChoices = 0;
  let currentResponse = 'hold';
  let selectedResponse = '';
  let scenario = scenarios[0];
  let episodeSeed = 0;
  let events = [];
  let violationSamples = [];
  let feedbackKey = '';
  let timer = 0;
  let pendingAction = null;

  function language() {
    return runtime.lang === 'zh' ? 'zh' : 'en';
  }

  function strings() {
    return copy[language()];
  }

  function formatRate(value) {
    return `${Math.round(value * 100)}%`;
  }

  function formatMargin(value) {
    return `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(2)}`;
  }

  function recentRate() {
    const recent = violationSamples.slice(-RECENT_WINDOW);
    if (recent.length === 0) return 0;
    return recent.reduce((sum, value) => sum + value, 0) / recent.length;
  }

  function semanticMargin() {
    return (MONITOR_THRESHOLD - recentRate()) / MONITOR_THRESHOLD;
  }

  function recommendedResponse() {
    const rate = recentRate();
    const currentSegment = violationSamples.slice(-SEGMENT_SIZE);
    const segmentRate =
      currentSegment.reduce((sum, value) => sum + value, 0) / Math.max(1, currentSegment.length);
    if (currentResponse === 'repair') return segmentRate <= MONITOR_THRESHOLD ? 'hold' : 'probe';
    if (rate <= MONITOR_THRESHOLD) return 'hold';
    return 'repair';
  }

  function score() {
    const deliveryPoints = (delivered / TOTAL_SLOTS) * 62;
    const judgmentPoints = (correctChoices / CHECKPOINTS) * 38;
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(deliveryPoints + judgmentPoints - responseCost * 2 - lateChoices * 3),
      ),
    );
  }

  function buildTimeline() {
    const localized = strings();
    const corner = document.createElement('span');
    corner.className = 'slot-number';
    corner.setAttribute('aria-hidden', 'true');
    timeline.append(corner);

    for (let slot = 0; slot < TOTAL_SLOTS; slot += 1) {
      const number = document.createElement('span');
      number.className = `slot-number${(slot + 1) % SEGMENT_SIZE === 0 ? ' is-checkpoint' : ''}`;
      number.textContent = String(slot + 1);
      number.setAttribute('aria-hidden', 'true');
      timeline.append(number);
    }

    [
      ['observation', localized.rowObservation],
      ['action', localized.rowAction],
      ['result', localized.rowResult],
    ].forEach(([row, label]) => {
      const rowLabel = document.createElement('span');
      rowLabel.className = 'trace-label';
      rowLabel.dataset.row = row;
      rowLabel.textContent = label;
      rowLabel.setAttribute('aria-hidden', 'true');
      timeline.append(rowLabel);

      for (let slot = 0; slot < TOTAL_SLOTS; slot += 1) {
        const cell = document.createElement('span');
        cell.className = `trace-cell${(slot + 1) % SEGMENT_SIZE === 0 ? ' is-checkpoint' : ''}`;
        cell.dataset.row = row;
        cell.dataset.slot = String(slot);
        cell.setAttribute('aria-hidden', 'true');
        timeline.append(cell);
        cells[row].push(cell);
      }
    });
  }

  function eventForSlot(slot) {
    const carrier = (slot + episodeSeed) % 3 !== 0;
    const driftActive = slot >= scenario.driftStart;
    const segmentStart = slot % SEGMENT_SIZE === 0;
    const probing = currentResponse === 'probe' && segmentStart;
    let violation = false;

    if (!probing && slot === scenario.noiseSlot) {
      violation = true;
    } else if (!probing && driftActive) {
      if (currentResponse === 'hold') {
        violation = (slot + episodeSeed) % SEGMENT_SIZE !== 0;
      } else if (currentResponse === 'repair') {
        violation =
          scenario.kind === 'repairable'
            ? (slot + episodeSeed) % SEGMENT_SIZE === SEGMENT_SIZE - 1
            : (slot + episodeSeed) % SEGMENT_SIZE !== 0;
      } else {
        violation =
          scenario.kind === 'persistent' &&
          (slot + episodeSeed) % SEGMENT_SIZE === SEGMENT_SIZE - 1;
      }
    }

    return {
      carrier,
      action: probing ? 'probe' : carrier ? 'reuse' : 'send',
      result: probing ? 'probed' : violation ? 'failure' : 'success',
      violation,
      eligible: !probing,
    };
  }

  function renderTimeline() {
    const localized = strings();
    const rowLabels = timeline.querySelectorAll('.trace-label');
    rowLabels.forEach((label) => {
      label.textContent =
        localized[`row${label.dataset.row[0].toUpperCase()}${label.dataset.row.slice(1)}`];
    });

    for (let slot = 0; slot < TOTAL_SLOTS; slot += 1) {
      const event = events[slot];
      const current = slot === Math.max(0, slotIndex - 1) && phase !== 'ready';
      const observationCell = cells.observation[slot];
      const actionCell = cells.action[slot];
      const resultCell = cells.result[slot];

      [observationCell, actionCell, resultCell].forEach((cell) => {
        cell.className = `trace-cell${(slot + 1) % SEGMENT_SIZE === 0 ? ' is-checkpoint' : ''}${current ? ' is-current' : ''}`;
        cell.textContent = '';
        cell.removeAttribute('title');
      });

      if (!event) continue;

      observationCell.classList.add(event.carrier ? 'is-carrier' : 'is-clear');
      observationCell.textContent = event.carrier ? '●' : '○';
      observationCell.title = event.carrier ? localized.carrier : localized.clear;

      actionCell.classList.add(`is-${event.action}`);
      actionCell.textContent =
        event.action === 'probe' ? '…' : event.action === 'reuse' ? '↻' : '↑';
      actionCell.title = localized[event.action];

      resultCell.classList.add(`is-${event.result}`);
      resultCell.textContent =
        event.result === 'success' ? '✓' : event.result === 'failure' ? '×' : '·';
      resultCell.title = localized[event.result];
    }

    const violations = events.filter((event) => event?.violation).length;
    timeline.setAttribute(
      'aria-label',
      events.length === 0
        ? localized.timelineEmpty
        : localized.timelineSummary(
            events.length,
            violations,
            localized.responseNames[currentResponse],
          ),
    );
  }

  function feedbackText(localized) {
    if (feedbackKey === 'correctHold') return localized.correctHold;
    if (feedbackKey === 'correctRepair') return localized.correctRepair;
    if (feedbackKey === 'correctProbe') return localized.correctProbe;
    if (feedbackKey === 'tooEarly') return localized.tooEarly;
    if (feedbackKey === 'tooLate') return localized.tooLate;
    return '';
  }

  function promptText(localized) {
    if (suspended) return localized.paused;
    if (phase === 'ready') return localized.ready;
    if (phase === 'playing') return localized.running(Math.min(slotIndex + 1, TOTAL_SLOTS));
    if (phase === 'decision') {
      return localized.decision(
        checkpoint,
        formatRate(recentRate()),
        formatMargin(semanticMargin()),
      );
    }
    if (phase === 'feedback') return feedbackText(localized);
    return localized.complete(score(), delivered, responseCost);
  }

  function responseText(localized) {
    if (phase === 'ready') return localized.responseReady;
    if (phase === 'decision') return localized.responseDecision;
    if (phase === 'complete') return localized.responseComplete;
    return localized.responseRunning;
  }

  function render() {
    const localized = strings();
    const rate = recentRate();
    const margin = semanticMargin();
    const renderedPhase = suspended ? 'paused' : phase;

    document.title = localized.title;
    pageDescription.content = localized.description;
    prompt.textContent = promptText(localized);
    responseCopy.textContent = responseText(localized);
    responseGroup.setAttribute('aria-label', localized.responseLabel);
    deliveredOutput.textContent = `${delivered} / ${TOTAL_SLOTS}`;
    violationOutput.textContent = formatRate(rate);
    marginOutput.textContent = formatMargin(margin);
    costOutput.textContent = String(responseCost);
    checkpointOutput.textContent = `${checkpoint} / ${CHECKPOINTS}`;
    rateFill.style.width = `${Math.round(rate * 100)}%`;
    rateFill.classList.toggle(
      'is-warning',
      rate > MONITOR_THRESHOLD * 0.75 && rate <= MONITOR_THRESHOLD,
    );
    rateFill.classList.toggle('is-danger', rate > MONITOR_THRESHOLD);
    marginOutput.classList.toggle('is-positive', margin >= 0);
    marginOutput.classList.toggle('is-negative', margin < 0);
    prompt.classList.toggle('is-warning', phase === 'feedback' && feedbackKey === 'tooEarly');
    prompt.classList.toggle(
      'is-danger',
      (phase === 'feedback' && feedbackKey === 'tooLate') || (phase === 'decision' && margin < 0),
    );

    responseButtons.forEach((button) => {
      button.disabled = suspended || phase !== 'decision';
      button.dataset.selected = String(button.dataset.response === selectedResponse);
    });

    startButton.hidden = phase !== 'ready' && phase !== 'complete';
    startButton.disabled = suspended;
    startButton.textContent = phase === 'complete' ? localized.restart : localized.start;
    renderTimeline();

    game.dataset.phase = renderedPhase;
    game.dataset.slot = String(slotIndex);
    game.dataset.checkpoint = String(checkpoint);
    game.dataset.totalSlots = String(TOTAL_SLOTS);
    game.dataset.response = currentResponse;
    game.dataset.selectedResponse = selectedResponse;
    game.dataset.recommended = phase === 'decision' ? recommendedResponse() : '';
    game.dataset.violationRate = rate.toFixed(3);
    game.dataset.semanticMargin = margin.toFixed(3);
    game.dataset.delivered = String(delivered);
    game.dataset.cost = String(responseCost);
    game.dataset.score = String(score());
    game.dataset.suspended = String(suspended);
    game.dataset.motion = reducedMotion.matches ? 'reduced' : 'full';
  }

  function schedule(action, delay) {
    window.clearTimeout(timer);
    pendingAction = action;
    timer = window.setTimeout(
      () => {
        const next = pendingAction;
        pendingAction = null;
        timer = 0;
        if (next && !suspended) next();
      },
      reducedMotion.matches ? 55 : delay,
    );
  }

  function enterDecision() {
    phase = 'decision';
    checkpoint = slotIndex / SEGMENT_SIZE;
    selectedResponse = '';
    render();
    announcer.textContent = prompt.textContent;
    responseButtons[0].focus();
  }

  function runSlot() {
    if (suspended || phase !== 'playing') return;
    const event = eventForSlot(slotIndex);
    events[slotIndex] = event;
    if (event.eligible) {
      violationSamples.push(event.violation ? 1 : 0);
      if (!event.violation) delivered += 1;
    }
    slotIndex += 1;
    render();

    if (slotIndex === TOTAL_SLOTS) {
      schedule(finishEpisode, 760);
    } else if (slotIndex % SEGMENT_SIZE === 0) {
      schedule(enterDecision, 760);
    } else {
      schedule(runSlot, 920);
    }
  }

  function finishEpisode() {
    phase = 'complete';
    selectedResponse = '';
    feedbackKey = '';
    render();
    announcer.textContent = strings().complete(score(), delivered, responseCost);
    startButton.focus();
  }

  function beginNextSegment() {
    selectedResponse = '';
    feedbackKey = '';
    phase = 'playing';
    render();
    schedule(runSlot, 480);
  }

  function chooseResponse(response) {
    if (suspended || phase !== 'decision') return;
    const recommended = recommendedResponse();
    selectedResponse = response;

    if (response === 'repair') responseCost += 1;
    if (response === 'probe') responseCost += 3;
    if (response === recommended) {
      correctChoices += 1;
      feedbackKey = `correct${response[0].toUpperCase()}${response.slice(1)}`;
    } else if (responseRank[response] > responseRank[recommended]) {
      feedbackKey = 'tooEarly';
    } else {
      lateChoices += 1;
      feedbackKey = 'tooLate';
    }

    currentResponse = response;
    phase = 'feedback';
    render();

    const localized = strings();
    announcer.textContent = localized.choiceAnnouncement(
      localized.responseNames[response],
      feedbackText(localized),
    );
    schedule(beginNextSegment, 860);
  }

  function startEpisode() {
    window.clearTimeout(timer);
    pendingAction = null;
    episodeSeed = Math.floor(Math.random() * 97) + 1;
    scenario = scenarios[episodeSeed % scenarios.length];
    phase = 'playing';
    slotIndex = 0;
    checkpoint = 0;
    delivered = 0;
    responseCost = 0;
    correctChoices = 0;
    lateChoices = 0;
    currentResponse = 'hold';
    selectedResponse = '';
    events = [];
    violationSamples = [];
    feedbackKey = '';
    announcer.textContent = '';
    render();
    game.focus();
    schedule(runSlot, 420);
  }

  function reset() {
    window.clearTimeout(timer);
    pendingAction = null;
    phase = 'ready';
    slotIndex = 0;
    checkpoint = 0;
    delivered = 0;
    responseCost = 0;
    correctChoices = 0;
    lateChoices = 0;
    currentResponse = 'hold';
    selectedResponse = '';
    events = [];
    violationSamples = [];
    feedbackKey = '';
    render();
    startButton.focus();
  }

  responseButtons.forEach((button) => {
    button.addEventListener('click', () => chooseResponse(button.dataset.response));
  });
  resetButton.addEventListener('click', reset);
  startButton.addEventListener('click', startEpisode);

  game.addEventListener('keydown', (event) => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();

    if (key === 'r') {
      event.preventDefault();
      reset();
      return;
    }

    if (phase === 'decision' && ['1', '2', '3'].includes(key)) {
      event.preventDefault();
      chooseResponse(['hold', 'repair', 'probe'][Number(key) - 1]);
      return;
    }

    const targetIsButton = event.target instanceof HTMLButtonElement;
    if (
      !targetIsButton &&
      (phase === 'ready' || phase === 'complete') &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault();
      startEpisode();
    }
  });

  document.addEventListener('visibilitychange', () => {
    suspended = document.hidden;
    if (suspended) {
      window.clearTimeout(timer);
      timer = 0;
    } else if (pendingAction) {
      const next = pendingAction;
      schedule(next, 180);
    }
    render();
  });

  reducedMotion.addEventListener('change', render);
  runtime.onChange(render);
  buildTimeline();
  render();
})();
