(() => {
  'use strict';

  const CHANNEL_COUNT = 3;
  const TOTAL_SLOTS = 12;
  const SUCCESS_TARGET = 9;
  const STATE_COUNT = 18;
  const ACTIONS = [0, 1, 2];
  const EPISODE_SEED_ORDER = [0, 2, 3, 4, 7, 8, 1, 5, 6];
  const runtime = window.PocketRuntime;
  const TabularAgent = window.PocketTabularAgent;
  const game = document.querySelector('#game');
  const trailGrid = document.querySelector('#trail-grid');
  const prompt = document.querySelector('#prompt');
  const liveStatus = document.querySelector('#live-status');
  const jammerStatus = document.querySelector('#jammer-status');
  const jammerModeOutput = document.querySelector('#jammer-mode');
  const throughputOutput = document.querySelector('#throughput');
  const demoOutput = document.querySelector('#demo-episodes');
  const experienceOutput = document.querySelector('#experience-count');
  const readinessOutput = document.querySelector('#readiness');
  const decisionPanel = document.querySelector('#decision-panel');
  const decisionCopy = document.querySelector('#decision-copy');
  const playerNextButton = document.querySelector('#player-next');
  const agentNextButton = document.querySelector('#agent-next');
  const agentUntilButton = document.querySelector('#agent-until-success');
  const resetLearningButton = document.querySelector('#reset-learning');
  const resetButton = document.querySelector('#reset-button');
  const channelGroup = document.querySelector('#channel-group');
  const channelButtons = [...document.querySelectorAll('[data-channel]')];
  const trailCells = new Map();

  const learner = new TabularAgent(STATE_COUNT, CHANNEL_COUNT, { alpha: 0.64, gamma: 0.88 });
  let phase = 'decision';
  let controller = 'player';
  let slotIndex = 0;
  let selectedChannel = 1;
  let previousJammer = 0;
  let previousChannel = 1;
  let jammerMode = 'sweep';
  let successes = 0;
  let collisions = 0;
  let demoEpisodes = 0;
  let agentEpisodes = 0;
  let episodeSeed = 0;
  let lastResult = 'none';
  let episodeExperience = [];
  let agentTimer = 0;
  let agentRunMode = 'idle';
  let autoAttempts = 0;
  let statusState = { key: 'ready', data: {} };

  const t = (english, chinese) => runtime.text(english, chinese);
  const channelName = (channel) => t(`Channel ${channel + 1}`, `信道 ${channel + 1}`);
  const modeForSlot = (slot) => ((slot + episodeSeed) % 4 === 3 ? 'reactive' : 'sweep');
  const hiddenJammer = () =>
    jammerMode === 'reactive' ? previousChannel : (previousJammer + 1) % CHANNEL_COUNT;
  const encodeState = (mode = jammerMode, jam = previousJammer, channel = previousChannel) =>
    (mode === 'reactive' ? 9 : 0) + jam * CHANNEL_COUNT + channel;

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

  function clearTrail() {
    trailCells.forEach((cell) => {
      cell.className = 'trail-cell';
    });
  }

  function rate() {
    const completed = successes + collisions;
    return completed === 0 ? 0 : Math.round((successes / completed) * 100);
  }

  function evaluateReadiness() {
    let safeLearnedStates = 0;
    for (let state = 0; state < STATE_COUNT; state += 1) {
      if (!learner.hasLearnedState(state)) continue;
      const reactive = state >= 9;
      const localState = reactive ? state - 9 : state;
      const jam = Math.floor(localState / CHANNEL_COUNT);
      const channel = localState % CHANNEL_COUNT;
      const expectedJammer = reactive ? channel : (jam + 1) % CHANNEL_COUNT;
      if (learner.greedyAction(state, ACTIONS) !== expectedJammer) safeLearnedStates += 1;
    }
    return Math.round((safeLearnedStates / STATE_COUNT) * 100);
  }

  function statusText() {
    const data = statusState.data;
    const messages = {
      ready: [
        'You see only the previous interference result. Human or Agent can open the first episode.',
        '你只能看到上一时隙的干扰结果；玩家或 Agent 都可以直接开始第一局。',
      ],
      player: [
        `Your episode · slot ${data.slot ?? 1}/${TOTAL_SLOTS}. Predict the hidden jammer and send.`,
        `你的回合 · 第 ${data.slot ?? 1}/${TOTAL_SLOTS} 个时隙。预测隐藏的干扰信道并发送。`,
      ],
      agent: [
        `Agent episode · slot ${data.slot ?? 1}/${TOTAL_SLOTS}. Watch it act from ${learner.experienceCount} transitions.`,
        `Agent 回合 · 第 ${data.slot ?? 1}/${TOTAL_SLOTS} 个时隙。观察它如何利用 ${learner.experienceCount} 条经验决策。`,
      ],
      playerDone: [
        `Human episode stored: ${data.successes}/${TOTAL_SLOTS} packets delivered${data.success ? ' — target reached' : ''}.`,
        `玩家回合已记入经验：${TOTAL_SLOTS} 个数据包中成功送达 ${data.successes} 个${data.success ? '，达到本局目标' : ''}。`,
      ],
      agentDone: [
        `Agent episode stored: ${data.successes}/${TOTAL_SLOTS} packets delivered. Its own choices updated the shared policy.`,
        `Agent 回合已记入经验：${TOTAL_SLOTS} 个数据包中成功送达 ${data.successes} 个；它自己的选择也更新了共享策略。`,
      ],
      agentSuccess: [
        `Agent reached the ${SUCCESS_TARGET}/${TOTAL_SLOTS} target${data.attempts ? ` after ${data.attempts} attempt${data.attempts === 1 ? '' : 's'}` : ''}.`,
        `Agent 已达到 ${SUCCESS_TARGET}/${TOTAL_SLOTS} 的成功目标${data.attempts ? `，连续探索共 ${data.attempts} 局` : ''}。`,
      ],
      agentRetry: [
        `Attempt ${data.attempts} delivered ${data.successes}/${TOTAL_SLOTS}. Agent is opening a new episode and will keep learning.`,
        `第 ${data.attempts} 局送达 ${data.successes}/${TOTAL_SLOTS}；Agent 将开启新一局并继续学习。`,
      ],
      autoStopped: [
        'Continuous Agent exploration stopped between episodes. Completed experience is retained.',
        '已在两局之间停止 Agent 连续探索；此前积累的经验全部保留。',
      ],
      reset: [
        'Learning reset. The same compact 18-state problem is ready for a new lesson.',
        '学习记录已清空；这个仅含 18 个状态的简化任务可以重新训练。',
      ],
    };
    const pair = messages[statusState.key] || messages.ready;
    return t(pair[0], pair[1]);
  }

  function updateAccessibility() {
    channelGroup.setAttribute(
      'aria-label',
      t('Choose a channel for this packet', '为本时隙的数据包选择信道'),
    );
    channelButtons.forEach((button) => {
      const channel = Number(button.dataset.channel);
      const selected = channel === selectedChannel;
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-last-jammed', channel === previousJammer);
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute(
        'aria-label',
        t(
          `${channelName(channel)}${channel === previousJammer ? ', jammed in the previous slot' : ''}`,
          `${channelName(channel)}${channel === previousJammer ? '，上一时隙受到干扰' : ''}`,
        ),
      );
    });
  }

  function render() {
    const readiness = evaluateReadiness();
    const throughput = rate();
    game.dataset.phase = phase;
    game.dataset.controller = controller;
    game.dataset.stateCount = String(STATE_COUNT);
    game.dataset.actionCount = String(CHANNEL_COUNT);
    game.dataset.channelCount = String(CHANNEL_COUNT);
    game.dataset.totalSlots = String(TOTAL_SLOTS);
    game.dataset.successTarget = String(SUCCESS_TARGET);
    game.dataset.slot = String(slotIndex);
    game.dataset.previousJammer = String(previousJammer);
    game.dataset.previousChannel = String(previousChannel);
    game.dataset.jammerMode = jammerMode;
    game.dataset.selectedChannel = String(selectedChannel);
    game.dataset.successes = String(successes);
    game.dataset.collisions = String(collisions);
    game.dataset.throughput = String(throughput);
    game.dataset.lastResult = lastResult;
    game.dataset.safeChannelCount = String(CHANNEL_COUNT - 1);
    game.dataset.demoEpisodes = String(demoEpisodes);
    game.dataset.agentEpisodes = String(agentEpisodes);
    game.dataset.agentRunMode = agentRunMode;
    game.dataset.agentRunAttempts = String(autoAttempts);
    game.dataset.episodeSeed = String(episodeSeed);
    game.dataset.experienceCount = String(learner.experienceCount);
    game.dataset.playerExperienceCount = String(learner.playerExperienceCount);
    game.dataset.agentExperienceCount = String(learner.agentExperienceCount);
    game.dataset.multiActionStateCount = String(learner.multiActionStateCount);
    game.dataset.stateCoverage = String(learner.stateCoverage);
    game.dataset.policyVersion = String(learner.policyVersion);
    game.dataset.readiness = String(readiness);

    throughputOutput.textContent = `${throughput}%`;
    demoOutput.textContent = String(demoEpisodes);
    experienceOutput.textContent = String(learner.experienceCount);
    readinessOutput.textContent = `${readiness}%`;
    jammerModeOutput.textContent =
      jammerMode === 'reactive'
        ? t('Reactive next', '下一时隙：反应式')
        : t('Sweep next', '下一时隙：扫频');
    jammerStatus.textContent = t(
      `${channelName(previousJammer)} was jammed. The next result stays hidden until you send.`,
      `上一时隙，${channelName(previousJammer)} 受到干扰；下一时隙的结果会在发送后揭晓。`,
    );
    prompt.textContent = statusText();
    prompt.classList.toggle('is-danger', lastResult === 'collision' && phase !== 'decision');
    const continuousAgent = agentRunMode === 'until-success';
    decisionPanel.hidden = phase !== 'decision' && !(phase === 'agent' && continuousAgent);
    decisionCopy.textContent = continuousAgent
      ? t(
          `Agent keeps opening fresh episodes until at least ${SUCCESS_TARGET}/${TOTAL_SLOTS} packets arrive · attempt ${autoAttempts}`,
          `Agent 将不断开启新一局，直到至少送达 ${SUCCESS_TARGET}/${TOTAL_SLOTS} 个数据包 · 当前第 ${autoAttempts} 局`,
        )
      : t(
          `Choose the next explorer · Success ≥ ${SUCCESS_TARGET}/${TOTAL_SLOTS} · Safe-policy coverage ${readiness}%`,
          `选择下一局由谁探索 · 成功目标 ≥ ${SUCCESS_TARGET}/${TOTAL_SLOTS} · 安全策略覆盖率 ${readiness}%`,
        );
    playerNextButton.textContent = t('Human explores', '玩家探索一局');
    agentNextButton.textContent = t('Agent explores once', 'Agent 探索一局');
    agentUntilButton.disabled = phase !== 'decision' && !(phase === 'agent' && continuousAgent);
    agentUntilButton.setAttribute('aria-pressed', String(continuousAgent));
    agentUntilButton.textContent = continuousAgent
      ? t(
          phase === 'agent' ? 'Stop after this episode' : 'Stop continuous run',
          phase === 'agent' ? '本局结束后停止' : '停止连续探索',
        )
      : t('Agent until success', 'Agent 探索至成功');
    resetLearningButton.textContent = t('Reset learning', '重置学习');
    agentNextButton.disabled = phase !== 'decision';
    playerNextButton.disabled = phase !== 'decision';
    channelButtons.forEach((button) => {
      button.disabled = phase !== 'player';
    });
    updateAccessibility();
  }

  function announce(english, chinese) {
    liveStatus.textContent = t(english, chinese);
  }

  function startEpisode(nextController) {
    if (phase !== 'decision') return;
    window.clearTimeout(agentTimer);
    if (nextController === 'player') {
      agentRunMode = 'idle';
      autoAttempts = 0;
    } else if (agentRunMode === 'idle') {
      agentRunMode = 'single';
    }
    controller = nextController;
    phase = nextController;
    slotIndex = 0;
    episodeSeed = EPISODE_SEED_ORDER[(demoEpisodes + agentEpisodes) % EPISODE_SEED_ORDER.length];
    if (nextController === 'agent' && agentRunMode === 'until-success') autoAttempts += 1;
    previousJammer = Math.floor(episodeSeed / CHANNEL_COUNT);
    previousChannel = episodeSeed % CHANNEL_COUNT;
    selectedChannel = previousChannel;
    jammerMode = modeForSlot(0);
    successes = 0;
    collisions = 0;
    lastResult = 'none';
    episodeExperience = [];
    clearTrail();
    statusState = { key: nextController, data: { slot: 1 } };
    render();
    announce(
      `${nextController === 'player' ? 'Player' : 'Agent'} episode started. Only the previous jammer is visible.`,
      `${nextController === 'player' ? '玩家' : 'Agent'}回合开始；界面只显示上一时隙的干扰信道。`,
    );
    if (nextController === 'agent') scheduleAgentStep();
  }

  function resolveChannel(channel) {
    if (phase !== 'player' && phase !== 'agent') return;
    const source = controller;
    const state = encodeState();
    const jammer = hiddenJammer();
    const collided = channel === jammer;
    const done = slotIndex === TOTAL_SLOTS - 1;
    selectedChannel = channel;
    trailCells.get(`${slotIndex}:${jammer}`).classList.add('is-jammed');
    trailCells
      .get(`${slotIndex}:${channel}`)
      .classList.add(collided ? 'is-collision' : 'is-success');
    if (collided) collisions += 1;
    else successes += 1;
    lastResult = collided ? 'collision' : 'success';

    const nextSlot = slotIndex + 1;
    const nextMode = modeForSlot(nextSlot);
    const nextState = encodeState(nextMode, jammer, channel);
    const experience = {
      state,
      action: channel,
      reward: collided ? -1 : 1,
      nextState,
      nextAllowed: ACTIONS,
      done,
      source,
    };
    episodeExperience.push(experience);
    learner.observe(experience);
    announce(
      collided
        ? `Slot ${slotIndex + 1}: ${channelName(channel)} was jammed.`
        : `Slot ${slotIndex + 1}: packet delivered on ${channelName(channel)}.`,
      collided
        ? `时隙 ${slotIndex + 1}：${channelName(channel)}受到干扰。`
        : `时隙 ${slotIndex + 1}：数据包已通过${channelName(channel)} 送达。`,
    );

    previousJammer = jammer;
    previousChannel = channel;
    slotIndex = nextSlot;
    jammerMode = nextMode;
    if (done) {
      finishEpisode();
      return;
    }
    statusState = { key: source, data: { slot: slotIndex + 1 } };
    render();
    if (source === 'agent') scheduleAgentStep();
  }

  function finishEpisode() {
    window.clearTimeout(agentTimer);
    const source = controller;
    learner.replay(episodeExperience, 8);
    if (source === 'player') demoEpisodes += 1;
    else agentEpisodes += 1;
    const success = successes >= SUCCESS_TARGET;
    const shouldRetry = source === 'agent' && agentRunMode === 'until-success' && !success;
    phase = 'decision';
    statusState = {
      key: shouldRetry
        ? 'agentRetry'
        : source === 'player'
          ? 'playerDone'
          : success
            ? 'agentSuccess'
            : 'agentDone',
      data: { successes, success, attempts: autoAttempts },
    };
    game.dataset.lastEpisodeResult = success ? 'success' : 'failure';
    game.dataset.lastEpisodeController = source;
    if (source === 'agent' && !shouldRetry) agentRunMode = 'idle';
    render();
    if (shouldRetry) scheduleAgentRetry();
  }

  function scheduleAgentRetry() {
    window.clearTimeout(agentTimer);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 360;
    agentTimer = window.setTimeout(() => {
      if (document.hidden || phase !== 'decision' || agentRunMode !== 'until-success') return;
      startEpisode('agent');
    }, delay);
  }

  function scheduleAgentStep() {
    window.clearTimeout(agentTimer);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 220;
    agentTimer = window.setTimeout(() => {
      if (phase !== 'agent' || document.hidden) return;
      const state = encodeState();
      const stateVisits = learner.visits[state].reduce((total, visits) => total + visits, 0);
      const epsilon = learner.hasLearnedState(state)
        ? Math.max(0.1, 0.42 / Math.sqrt(1 + stateVisits))
        : 1;
      resolveChannel(learner.selectAction(state, ACTIONS, epsilon));
    }, delay);
  }

  function resetLearning() {
    window.clearTimeout(agentTimer);
    learner.reset();
    phase = 'decision';
    controller = 'player';
    slotIndex = 0;
    selectedChannel = 0;
    previousJammer = 0;
    previousChannel = 0;
    episodeSeed = 0;
    agentRunMode = 'idle';
    autoAttempts = 0;
    jammerMode = modeForSlot(0);
    successes = 0;
    collisions = 0;
    demoEpisodes = 0;
    agentEpisodes = 0;
    lastResult = 'none';
    episodeExperience = [];
    game.dataset.lastEpisodeResult = '';
    game.dataset.lastEpisodeController = '';
    clearTrail();
    statusState = { key: 'reset', data: {} };
    render();
  }

  buildTrail();
  channelButtons.forEach((button) => {
    button.addEventListener('click', () => resolveChannel(Number(button.dataset.channel)));
  });
  playerNextButton.addEventListener('click', () => startEpisode('player'));
  agentNextButton.addEventListener('click', () => {
    agentRunMode = 'single';
    autoAttempts = 0;
    startEpisode('agent');
  });
  agentUntilButton.addEventListener('click', () => {
    if (agentRunMode === 'until-success') {
      if (phase === 'agent') {
        agentRunMode = 'single';
      } else {
        window.clearTimeout(agentTimer);
        agentRunMode = 'idle';
        statusState = { key: 'autoStopped', data: {} };
      }
      render();
      return;
    }
    if (phase !== 'decision') return;
    agentRunMode = 'until-success';
    autoAttempts = 0;
    startEpisode('agent');
  });
  resetLearningButton.addEventListener('click', resetLearning);
  resetButton.addEventListener('click', resetLearning);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && phase === 'agent') scheduleAgentStep();
    if (!document.hidden && phase === 'decision' && agentRunMode === 'until-success') {
      scheduleAgentRetry();
    }
  });
  runtime.onChange(render);
  render();
})();
