(() => {
  'use strict';

  const CHANNEL_COUNT = 3;
  const TOTAL_SLOTS = 20;
  const NORMAL_SLOT_MS = 1800;
  const REDUCED_SLOT_MS = 2400;

  const runtime = window.PocketRuntime;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const game = document.querySelector('#game');
  const trailGrid = document.querySelector('#trail-grid');
  const progress = document.querySelector('#slot-progress');
  const prompt = document.querySelector('#prompt');
  const actionButton = document.querySelector('#action-button');
  const resetButton = document.querySelector('#reset-button');
  const liveStatus = document.querySelector('#live-status');
  const jammerStatus = document.querySelector('#jammer-status');
  const jammerModeOutput = document.querySelector('#jammer-mode');
  const throughputOutput = document.querySelector('#throughput');
  const successesOutput = document.querySelector('#successes');
  const collisionsOutput = document.querySelector('#collisions');
  const slotOutput = document.querySelector('#slot-count');
  const channelButtons = [...document.querySelectorAll('[data-channel]')];
  const trailCells = new Map();

  let phase = 'idle';
  let slotIndex = 0;
  let selectedChannel = 1;
  let jammerChannel = 0;
  let jammerMode = 'sweep';
  let successes = 0;
  let collisions = 0;
  let lastPacketChannel = 1;
  let lastResult = 'none';
  let slotTimer = 0;

  const say = (english, chinese) => runtime.text(english, chinese);
  const channelName = (channel) => say(`Channel ${channel + 1}`, `信道 ${channel + 1}`);
  const currentSlotMs = () => (reducedMotion.matches ? REDUCED_SLOT_MS : NORMAL_SLOT_MS);
  const isAdaptiveSlot = (slot) => slot > 0 && slot % 4 === 3;
  const jammerForSlot = (slot, previousPacket) =>
    isAdaptiveSlot(slot) ? previousPacket : slot % CHANNEL_COUNT;

  function buildTrail() {
    game.style.setProperty('--channel-count', CHANNEL_COUNT);
    game.style.setProperty('--total-slots', TOTAL_SLOTS);

    for (let channel = 0; channel < CHANNEL_COUNT; channel += 1) {
      for (let slot = 0; slot < TOTAL_SLOTS; slot += 1) {
        const cell = document.createElement('span');
        cell.className = 'trail-cell';
        cell.dataset.slot = String(slot);
        cell.dataset.channel = String(channel);
        trailGrid.append(cell);
        trailCells.set(`${slot}:${channel}`, cell);
      }
    }
  }

  function clearTimer() {
    window.clearTimeout(slotTimer);
    slotTimer = 0;
    progress.classList.remove('is-running');
    game.dataset.timerActive = 'false';
  }

  function scheduleSlot() {
    clearTimer();
    const duration = currentSlotMs();
    game.style.setProperty('--slot-ms', `${duration}ms`);
    game.dataset.slotMs = String(duration);
    void progress.offsetWidth;
    progress.classList.add('is-running');
    game.dataset.timerActive = 'true';
    slotTimer = window.setTimeout(resolveSlot, duration);
  }

  function clearTrail() {
    trailCells.forEach((cell) => {
      cell.className = 'trail-cell';
    });
  }

  function markPreview() {
    trailCells.forEach((cell) => cell.classList.remove('is-current'));
    if (slotIndex >= TOTAL_SLOTS) return;
    const cell = trailCells.get(`${slotIndex}:${jammerChannel}`);
    cell.classList.add('is-jammed', 'is-current');
  }

  function throughput() {
    const completed = successes + collisions;
    return completed === 0 ? 0 : Math.round((successes / completed) * 100);
  }

  function promptCopy() {
    if (phase === 'idle') {
      return say(
        'Pick either safe channel, then start. One packet sends when each slot closes.',
        '先选择任一安全信道，再开始；每个时隙结束时会发送一个数据包。',
      );
    }
    if (phase === 'paused') {
      return say('Round paused. Resume when you are ready.', '本局已暂停，准备好后继续。');
    }
    if (phase === 'over') {
      return say(
        `Round complete: ${successes} of ${TOTAL_SLOTS} packets delivered.`,
        `本局结束：${TOTAL_SLOTS} 个数据包中成功送达 ${successes} 个。`,
      );
    }
    if (selectedChannel === jammerChannel) {
      return say(
        `${channelName(selectedChannel)} is jammed—hop before the slot closes.`,
        `${channelName(selectedChannel)}受到干扰，请在时隙结束前跳频。`,
      );
    }
    return say(
      `Packet queued on ${channelName(selectedChannel)}. It sends when the slot closes.`,
      `数据包已排入${channelName(selectedChannel)}，将在本时隙结束时发送。`,
    );
  }

  function actionCopy() {
    if (phase === 'running') return say('Pause round', '暂停本局');
    if (phase === 'paused') return say('Resume round', '继续本局');
    if (phase === 'over') return say('Play again', '再玩一次');
    return say('Start round', '开始本局');
  }

  function render() {
    const rate = throughput();
    const shownSlot = phase === 'over' ? TOTAL_SLOTS : slotIndex;

    game.dataset.phase = phase;
    game.dataset.channelCount = String(CHANNEL_COUNT);
    game.dataset.totalSlots = String(TOTAL_SLOTS);
    game.dataset.slot = String(slotIndex);
    game.dataset.slotMs = String(currentSlotMs());
    game.dataset.jammerChannel = String(jammerChannel);
    game.dataset.selectedChannel = String(selectedChannel);
    game.dataset.jammerMode = jammerMode;
    game.dataset.successes = String(successes);
    game.dataset.collisions = String(collisions);
    game.dataset.throughput = String(rate);
    game.dataset.lastResult = lastResult;
    game.dataset.safeChannelCount = String(CHANNEL_COUNT - 1);

    throughputOutput.textContent = `${rate}%`;
    successesOutput.textContent = String(successes);
    collisionsOutput.textContent = String(collisions);
    slotOutput.textContent = `${shownSlot}/${TOTAL_SLOTS}`;
    jammerModeOutput.textContent =
      jammerMode === 'adaptive' ? say('Adaptive', '自适应') : say('Sweep', '扫频');
    jammerStatus.textContent = say(
      `${channelName(jammerChannel)} is occupied. Two safe channels remain.`,
      `干扰机当前占用${channelName(jammerChannel)}；另有两个安全信道。`,
    );

    channelButtons.forEach((button) => {
      const channel = Number(button.dataset.channel);
      const selected = channel === selectedChannel;
      const jammed = channel === jammerChannel;
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-jammed', jammed);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute(
        'aria-label',
        say(
          `${channelName(channel)}, ${jammed ? 'jammed' : 'safe'}`,
          `${channelName(channel)}，${jammed ? '受到干扰' : '安全'}`,
        ),
      );
    });

    prompt.textContent = promptCopy();
    prompt.classList.toggle(
      'is-danger',
      phase === 'running' && selectedChannel === jammerChannel,
    );
    actionButton.textContent = actionCopy();
    actionButton.setAttribute('aria-label', actionCopy());
    markPreview();
  }

  function announce(english, chinese) {
    liveStatus.textContent = say(english, chinese);
  }

  function startRound() {
    clearTimer();
    clearTrail();
    phase = 'running';
    slotIndex = 0;
    jammerChannel = 0;
    jammerMode = 'sweep';
    successes = 0;
    collisions = 0;
    lastPacketChannel = selectedChannel;
    lastResult = 'none';
    render();
    announce(
      `Round started. Channel 1 is jammed; ${channelName(selectedChannel)} is selected.`,
      `本局开始。信道 1 受到干扰，当前选择${channelName(selectedChannel)}。`,
    );
    scheduleSlot();
  }

  function resolveSlot() {
    if (phase !== 'running') return;

    const packetChannel = selectedChannel;
    const collided = packetChannel === jammerChannel;
    const jammerCell = trailCells.get(`${slotIndex}:${jammerChannel}`);
    const packetCell = trailCells.get(`${slotIndex}:${packetChannel}`);

    jammerCell.classList.remove('is-current');
    jammerCell.classList.add('is-jammed');
    packetCell.classList.add(collided ? 'is-collision' : 'is-success');

    if (collided) collisions += 1;
    else successes += 1;
    lastResult = collided ? 'collision' : 'success';
    lastPacketChannel = packetChannel;

    announce(
      collided
        ? `Slot ${slotIndex + 1}: collision on ${channelName(packetChannel)}.`
        : `Slot ${slotIndex + 1}: packet delivered on ${channelName(packetChannel)}.`,
      collided
        ? `时隙 ${slotIndex + 1}：数据包在${channelName(packetChannel)} 上受到干扰。`
        : `时隙 ${slotIndex + 1}：数据包已通过${channelName(packetChannel)} 送达。`,
    );

    slotIndex += 1;
    if (slotIndex >= TOTAL_SLOTS) {
      finishRound();
      return;
    }

    jammerMode = isAdaptiveSlot(slotIndex) ? 'adaptive' : 'sweep';
    jammerChannel = jammerForSlot(slotIndex, lastPacketChannel);
    render();
    scheduleSlot();
  }

  function pauseRound(automatic = false) {
    if (phase !== 'running') return;
    clearTimer();
    phase = 'paused';
    render();
    announce(
      automatic ? 'Round paused because the game was hidden.' : 'Round paused.',
      automatic ? '页面进入后台，游戏已自动暂停。' : '本局已暂停。',
    );
  }

  function resumeRound() {
    if (phase !== 'paused') return;
    phase = 'running';
    render();
    announce('Round resumed.', '游戏继续。');
    scheduleSlot();
  }

  function finishRound() {
    clearTimer();
    phase = 'over';
    render();
    announce(
      `Round complete. ${successes} packets delivered, ${collisions} collisions, ${throughput()} percent throughput.`,
      `本局结束。成功送达 ${successes} 个数据包，有 ${collisions} 个数据包受到干扰，吞吐率 ${throughput()}%。`,
    );
  }

  function resetRound() {
    clearTimer();
    clearTrail();
    phase = 'idle';
    slotIndex = 0;
    selectedChannel = 1;
    jammerChannel = 0;
    jammerMode = 'sweep';
    successes = 0;
    collisions = 0;
    lastPacketChannel = selectedChannel;
    lastResult = 'none';
    render();
    announce('Round reset.', '本局已重置。');
  }

  function selectChannel(channel) {
    if (!Number.isInteger(channel) || channel < 0 || channel >= CHANNEL_COUNT) return;
    selectedChannel = channel;
    render();
  }

  channelButtons.forEach((button) => {
    button.addEventListener('click', () => selectChannel(Number(button.dataset.channel)));
  });

  actionButton.addEventListener('click', () => {
    if (phase === 'idle' || phase === 'over') startRound();
    else if (phase === 'running') pauseRound();
    else resumeRound();
  });

  resetButton.addEventListener('click', resetRound);

  document.addEventListener('keydown', (event) => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;

    const numberMatch = /^(?:Digit|Numpad)([1-3])$/.exec(event.code);
    if (numberMatch) {
      event.preventDefault();
      selectChannel(Number(numberMatch[1]) - 1);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      selectChannel((selectedChannel + direction + CHANNEL_COUNT) % CHANNEL_COUNT);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseRound(true);
  });

  const handleMotionChange = () => {
    render();
    if (phase === 'running') scheduleSlot();
  };

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', handleMotionChange);
  } else {
    reducedMotion.addListener(handleMotionChange);
  }

  runtime.onChange(render);
  buildTrail();
  render();
})();
