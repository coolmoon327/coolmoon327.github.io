(() => {
  'use strict';

  const TOTAL_SLOTS = 10;
  const MAX_QUEUE = 9;
  const MAX_BATTERY = 8;
  const OBSERVATIONS = ['quiet', 'weak', 'steady', 'broken'];
  const OBSERVATION_COPY = {
    idle: { en: 'Not sampled', zh: '尚未采样' },
    quiet: { en: 'Quiet channel', zh: '信道安静' },
    weak: { en: 'Faint response', zh: '响应微弱' },
    steady: { en: 'Steady carrier', zh: '连续载波' },
    broken: { en: 'Broken carrier', zh: '间歇载波' },
  };
  const ACTION_COPY = {
    direct: { en: 'DIR', zh: '直传' },
    probe: { en: 'PRB', zh: '探测' },
    wait: { en: 'WAIT', zh: '等待' },
    reflect: { en: 'REF', zh: '反射' },
    harvest: { en: 'RF', zh: '采能' },
    cautious: { en: 'LOW', zh: '低速' },
  };

  const game = document.querySelector('.game');
  const slotOutput = document.querySelector('#slot');
  const queueOutput = document.querySelector('#queue');
  const batteryOutput = document.querySelector('#battery');
  const deliveredOutput = document.querySelector('#delivered');
  const arena = document.querySelector('#arena');
  const observationOutput = document.querySelector('#observation');
  const historyList = document.querySelector('#history');
  const decisionTitle = document.querySelector('#decision-title');
  const primaryActions = document.querySelector('#primary-actions');
  const followActions = document.querySelector('#follow-actions');
  const status = document.querySelector('#status');
  const results = document.querySelector('#results');
  const resultDelivered = document.querySelector('#result-delivered');
  const resultLost = document.querySelector('#result-lost');
  const resultEnergy = document.querySelector('#result-energy');
  const resultRecovery = document.querySelector('#result-recovery');
  const resultNote = document.querySelector('#result-note');
  const gradeOutput = document.querySelector('#grade');
  const restartButton = document.querySelector('#restart');

  let state;

  function text(english, chinese) {
    return window.PocketRuntime?.text(english, chinese) ?? english;
  }

  function randomSeed() {
    if (window.crypto?.getRandomValues) {
      return window.crypto.getRandomValues(new Uint32Array(1))[0] || 1;
    }
    return Date.now() >>> 0 || 1;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value + 0x6d2b79f5) | 0;
      let result = Math.imul(value ^ (value >>> 15), 1 | value);
      result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
      return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeState() {
    const random = mulberry32(randomSeed());
    return {
      random,
      slot: 1,
      queue: 5,
      battery: 5,
      delivered: 0,
      lost: 0,
      phase: 'primary',
      observation: 'idle',
      pendingObservation: null,
      history: [],
      shiftSlot: 5 + Math.floor(random() * 2),
      reverseDrift: random() < 0.5,
      postShiftProbed: false,
      firstRecoverySlot: null,
      complete: false,
      effect: 'idle',
      driftNotice: false,
      message: () =>
        text(
          'Choose direct, probe, or wait. Recent evidence matters more than old assumptions.',
          '选择直接发送、探测或等待。近期观测往往比旧经验更可靠。',
        ),
    };
  }

  function weightedObservation(weights) {
    const roll = state.random();
    let cumulative = 0;
    for (let index = 0; index < weights.length; index += 1) {
      cumulative += weights[index];
      if (roll <= cumulative) return OBSERVATIONS[index];
    }
    return OBSERVATIONS.at(-1);
  }

  function sampleObservation() {
    // These are deliberately game-only distributions, not measured or research parameters.
    const firstRhythm = [0.34, 0.23, 0.34, 0.09];
    const secondRhythm = [0.16, 0.22, 0.16, 0.46];
    const changed = state.slot >= state.shiftSlot;
    const useSecond = state.reverseDrift ? !changed : changed;
    return weightedObservation(useSecond ? secondRhythm : firstRhythm);
  }

  function formatPackets(value) {
    return text(`${value} pkt`, `${value} 包`);
  }

  function formatEnergy(value) {
    return `${value} EU`;
  }

  function observationLabel(observation) {
    const copy = OBSERVATION_COPY[observation] ?? OBSERVATION_COPY.idle;
    return text(copy.en, copy.zh);
  }

  function actionLabel(action) {
    const copy = ACTION_COPY[action] ?? ACTION_COPY.wait;
    return text(copy.en, copy.zh);
  }

  function setButtonStates() {
    primaryActions.querySelector('[data-action="direct"]').disabled =
      state.complete || state.queue === 0 || state.battery === 0;
    primaryActions.querySelector('[data-action="probe"]').disabled =
      state.complete || state.battery === 0;
    primaryActions.querySelector('[data-action="wait"]').disabled = state.complete;

    followActions.querySelector('[data-action="reflect"]').disabled =
      state.complete || state.queue === 0;
    followActions.querySelector('[data-action="harvest"]').disabled =
      state.complete || state.battery >= MAX_BATTERY;
    followActions.querySelector('[data-action="cautious"]').disabled =
      state.complete || state.queue === 0 || state.battery === 0;
  }

  function renderHistory() {
    historyList.replaceChildren();
    const recent = state.history.slice(-4);
    if (!recent.length) {
      const empty = document.createElement('li');
      empty.textContent = text('No samples yet', '暂无观测');
      empty.dataset.result = 'neutral';
      historyList.append(empty);
      return;
    }

    recent.forEach((entry) => {
      const item = document.createElement('li');
      const delta = entry.delivered
        ? `+${entry.delivered}`
        : entry.energy
          ? `E+${entry.energy}`
          : entry.lost
            ? `−${entry.lost}`
            : '·';
      item.textContent = `S${entry.slot} · ${actionLabel(entry.action)} · ${delta}`;
      item.dataset.result =
        entry.delivered || entry.energy ? 'success' : entry.lost ? 'loss' : 'neutral';
      item.setAttribute(
        'aria-label',
        text(
          `Slot ${entry.slot}, ${actionLabel(entry.action)}, ${observationLabel(entry.observation)}, delivered ${entry.delivered}, lost ${entry.lost}, energy gained ${entry.energy}`,
          `第 ${entry.slot} 时隙，${actionLabel(entry.action)}，${observationLabel(entry.observation)}，交付 ${entry.delivered} 包，丢失 ${entry.lost} 包，获得 ${entry.energy} 能量单位`,
        ),
      );
      historyList.append(item);
    });
  }

  function recoveryScore() {
    if (state.firstRecoverySlot === null) return 0;
    return Math.max(20, 100 - (state.firstRecoverySlot - state.shiftSlot) * 20);
  }

  function renderResults() {
    const recovery = recoveryScore();
    const score = state.delivered * 7 + state.battery * 2 - state.lost * 2 + recovery / 10;
    const grade = score >= 82 ? 'S' : score >= 62 ? 'A' : score >= 42 ? 'B' : 'C';
    gradeOutput.textContent = grade;
    resultDelivered.textContent = text(`${state.delivered} packets`, `${state.delivered} 个数据包`);
    resultLost.textContent = text(`${state.lost} packets`, `${state.lost} 个数据包`);
    resultEnergy.textContent = formatEnergy(state.battery);
    resultRecovery.textContent = text(`${recovery} / 100 game pts`, `${recovery} / 100 游戏分`);

    if (recovery >= 80) {
      resultNote.textContent = text(
        "You adapted quickly after the opponent's transmit rhythm changed. The best move depended on both the carrier and your remaining resources.",
        '对方的发射节奏变化后，你很快根据新证据调整了策略。合适的操作既取决于载波，也取决于手中的剩余资源。',
      );
    } else if (state.delivered >= 8) {
      resultNote.textContent = text(
        'Good payload delivery, but the changed transmit rhythm slowed your recovery. Give recent observations more weight next time.',
        '数据交付表现不错，但发射节奏变化后恢复较慢。下一局可以更加重视近期观测。',
      );
    } else {
      resultNote.textContent = text(
        'A steady carrier can support reflection, while quiet or faint conditions may favor direct transmission. No action wins everywhere.',
        '连续载波适合借波反射，而安静或微弱干扰下直传可能更有效。不存在始终占优的操作。',
      );
    }
  }

  function render() {
    game.dataset.phase = state.complete ? 'complete' : state.phase;
    game.dataset.slot = String(state.slot);
    game.dataset.complete = String(state.complete);
    arena.dataset.slot = String(state.slot);
    arena.dataset.carrier = state.observation;
    arena.dataset.drift = String(state.driftNotice);

    arena.removeAttribute('data-effect');
    void arena.offsetWidth;
    arena.dataset.effect = state.effect;

    slotOutput.textContent = `${Math.min(state.slot, TOTAL_SLOTS)} / ${TOTAL_SLOTS}`;
    queueOutput.textContent = formatPackets(state.queue);
    batteryOutput.textContent = formatEnergy(state.battery);
    deliveredOutput.textContent = formatPackets(state.delivered);
    observationOutput.textContent = observationLabel(state.observation);
    status.textContent = state.message();

    const followup = state.phase === 'follow' && !state.complete;
    primaryActions.hidden = followup || state.complete;
    followActions.hidden = !followup || state.complete;
    decisionTitle.textContent = followup
      ? text('Use the coarse observation', '根据粗粒度观测决策')
      : text('Choose the first move', '选择第一步');

    results.hidden = !state.complete;
    setButtonStates();
    renderHistory();
    if (state.complete) renderResults();
  }

  function addArrivals() {
    const arrivals = (state.random() < 0.58 ? 1 : 0) + (state.random() < 0.14 ? 1 : 0);
    const overflow = Math.max(0, state.queue + arrivals - MAX_QUEUE);
    state.queue = Math.min(MAX_QUEUE, state.queue + arrivals);
    state.lost += overflow;
    return { arrivals, overflow };
  }

  function finishSlot({
    action,
    observation,
    delivered = 0,
    lost = 0,
    energy = 0,
    message,
    effect,
  }) {
    state.delivered += delivered;
    state.lost += lost;
    state.effect = effect;
    state.observation = observation;
    state.history.push({
      slot: state.slot,
      action,
      observation,
      delivered,
      lost,
      energy,
    });

    if (
      state.slot >= state.shiftSlot &&
      state.postShiftProbed &&
      delivered > 0 &&
      state.firstRecoverySlot === null
    ) {
      state.firstRecoverySlot = state.slot;
    }

    if (state.slot >= TOTAL_SLOTS) {
      state.complete = true;
      state.phase = 'complete';
      state.message = message;
      render();
      restartButton.focus();
      return;
    }

    const previousSlot = state.slot;
    state.slot += 1;
    const arrivals = addArrivals();
    state.phase = 'primary';
    state.pendingObservation = null;
    state.driftNotice = previousSlot < state.shiftSlot && state.slot >= state.shiftSlot;
    state.message = () => {
      const arrivalNote = arrivals.overflow
        ? text(
            ` Queue overflow lost ${arrivals.overflow} packet.`,
            ` 队列溢出，丢失 ${arrivals.overflow} 个包。`,
          )
        : '';
      const driftNote = state.driftNotice
        ? text(
            " The opponent's recent transmit rhythm may be drifting; trust new evidence.",
            ' 对方近期的发射节奏似乎正在变化，请重新探测。',
          )
        : '';
      return `${message()}${arrivalNote}${driftNote}`;
    };
    render();
  }

  function directTransmission() {
    if (state.phase !== 'primary' || state.queue === 0 || state.battery === 0) return;
    const observation = sampleObservation();
    const attempted = Math.min(2, state.queue);
    const delivered = observation === 'quiet' ? attempted : observation === 'weak' ? 1 : 0;
    const lost = attempted - delivered;
    state.queue -= attempted;
    state.battery -= 1;
    finishSlot({
      action: 'direct',
      observation,
      delivered,
      lost,
      effect: delivered ? 'direct' : 'blocked',
      message: () =>
        text(
          delivered
            ? `Direct link delivered ${delivered} packet${delivered === 1 ? '' : 's'}.`
            : `Interference blocked ${lost} direct packet${lost === 1 ? '' : 's'}.`,
          delivered ? `直传成功交付 ${delivered} 个包。` : `干扰使 ${lost} 个直传包发送失败。`,
        ),
    });
  }

  function probeChannel() {
    if (state.phase !== 'primary' || state.battery === 0) return;
    state.battery -= 1;
    state.pendingObservation = sampleObservation();
    state.observation = state.pendingObservation;
    state.phase = 'follow';
    state.effect = 'probe';
    state.driftNotice = false;
    if (state.slot >= state.shiftSlot) state.postShiftProbed = true;
    state.message = () =>
      text(
        `Probe complete: ${observationLabel(state.observation)}. Choose how to use this coarse observation.`,
        `探测完成：${observationLabel(state.observation)}。请根据这一粗粒度观测选择后续操作。`,
      );
    render();
  }

  function waitAndListen() {
    if (state.phase !== 'primary') return;
    const gained = state.battery < 2 ? 1 : 0;
    state.battery = Math.min(MAX_BATTERY, state.battery + gained);
    finishSlot({
      action: 'wait',
      observation: 'idle',
      energy: gained,
      effect: 'wait',
      message: () =>
        gained
          ? text(
              'You waited and recovered 1 ambient energy unit.',
              '等待期间恢复了 1 个环境能量单位。',
            )
          : text('You listened without spending energy.', '本时隙保持监听，没有消耗能量。'),
    });
  }

  function reflectSignal() {
    if (state.phase !== 'follow' || state.queue === 0) return;
    const observation = state.pendingObservation;
    const attempted = Math.min(2, state.queue);
    const delivered = observation === 'steady' ? attempted : 0;
    const lost = delivered ? 0 : Math.min(1, attempted);
    state.queue -= delivered + lost;
    finishSlot({
      action: 'reflect',
      observation,
      delivered,
      lost,
      effect: delivered ? 'reflect' : 'blocked',
      message: () =>
        text(
          delivered
            ? `The steady carrier reflected ${delivered} packet${delivered === 1 ? '' : 's'} without extra transmit energy.`
            : 'The carrier was not continuous enough; one reflected packet was lost.',
          delivered
            ? `连续载波帮助你反射交付了 ${delivered} 个包，且没有额外消耗发送能量。`
            : '载波不够连续，1 个反射包传输失败。',
        ),
    });
  }

  function harvestEnergy() {
    if (state.phase !== 'follow' || state.battery >= MAX_BATTERY) return;
    const observation = state.pendingObservation;
    const available =
      observation === 'steady' ? 2 : observation === 'weak' || observation === 'broken' ? 1 : 0;
    const gained = Math.min(available, MAX_BATTERY - state.battery);
    state.battery += gained;
    finishSlot({
      action: 'harvest',
      observation,
      energy: gained,
      effect: gained ? 'harvest' : 'wait',
      message: () =>
        gained
          ? text(
              `RF harvesting stored ${gained} energy unit${gained === 1 ? '' : 's'}; no payload was sent this slot.`,
              `射频采能补充了 ${gained} 个能量单位；本时隙没有发送数据。`,
            )
          : text(
              'No usable RF energy was present; the slot carried no payload.',
              '没有可用的射频能量，本时隙也未传输数据。',
            ),
    });
  }

  function cautiousTransmission() {
    if (state.phase !== 'follow' || state.queue === 0 || state.battery === 0) return;
    const observation = state.pendingObservation;
    const delivered = observation === 'quiet' || observation === 'weak' ? 1 : 0;
    const lost = delivered ? 0 : 1;
    state.queue -= 1;
    state.battery -= 1;
    finishSlot({
      action: 'cautious',
      observation,
      delivered,
      lost,
      effect: delivered ? 'direct' : 'blocked',
      message: () =>
        delivered
          ? text(
              'The guarded low-rate link delivered 1 packet.',
              '保守的低速链路成功交付了 1 个包。',
            )
          : text(
              'The changing carrier still blocked the low-rate packet.',
              '变化中的载波仍然阻断了低速传输。',
            ),
    });
  }

  function takeAction(action) {
    const actions = {
      direct: directTransmission,
      probe: probeChannel,
      wait: waitAndListen,
      reflect: reflectSignal,
      harvest: harvestEnergy,
      cautious: cautiousTransmission,
    };
    actions[action]?.();
  }

  function handleActionClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    takeAction(button.dataset.action);
  }

  primaryActions.addEventListener('click', handleActionClick);
  followActions.addEventListener('click', handleActionClick);
  restartButton.addEventListener('click', () => {
    state = makeState();
    render();
    primaryActions.querySelector('button:not(:disabled)')?.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (!['1', '2', '3'].includes(event.key) || state.complete) return;
    const group = state.phase === 'follow' ? followActions : primaryActions;
    const button = group.querySelectorAll('button')[Number(event.key) - 1];
    if (!button || button.disabled) return;
    event.preventDefault();
    button.click();
  });

  window.PocketRuntime?.onChange(() => render());
  state = makeState();
  render();
})();
