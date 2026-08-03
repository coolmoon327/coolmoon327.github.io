(() => {
  'use strict';

  class PocketTabularAgent {
    constructor(stateCount, actionCount, options = {}) {
      this.stateCount = stateCount;
      this.actionCount = actionCount;
      this.alpha = options.alpha ?? 0.58;
      this.gamma = options.gamma ?? 0.9;
      this.maxExperiences = options.maxExperiences ?? 512;
      this.reset();
    }

    reset() {
      this.q = Array.from({ length: this.stateCount }, () =>
        Array.from({ length: this.actionCount }, () => 0),
      );
      this.visits = Array.from({ length: this.stateCount }, () =>
        Array.from({ length: this.actionCount }, () => 0),
      );
      this.experiences = [];
      this.totalExperience = 0;
      this.visitedStates = new Set();
      this.policyVersion = 0;
    }

    allowedValues(state, allowedActions) {
      return allowedActions.map((action) => this.q[state][action]);
    }

    greedyAction(state, allowedActions) {
      if (!allowedActions.length) return 0;
      let bestValue = -Infinity;
      let candidates = [];
      for (const action of allowedActions) {
        const value = this.q[state][action];
        if (value > bestValue + 1e-9) {
          bestValue = value;
          candidates = [action];
        } else if (Math.abs(value - bestValue) <= 1e-9) {
          candidates.push(action);
        }
      }
      candidates.sort(
        (first, second) => this.visits[state][first] - this.visits[state][second] || first - second,
      );
      return candidates[0];
    }

    selectAction(state, allowedActions, epsilon = 0) {
      if (!allowedActions.length) return 0;
      if (Math.random() < epsilon) {
        const leastVisited = Math.min(
          ...allowedActions.map((action) => this.visits[state][action]),
        );
        const candidates = allowedActions.filter(
          (action) => this.visits[state][action] === leastVisited,
        );
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
      return this.greedyAction(state, allowedActions);
    }

    update(experience, weight = 1) {
      const nextActions = experience.nextAllowed?.length
        ? experience.nextAllowed
        : Array.from({ length: this.actionCount }, (_, action) => action);
      const nextBest = experience.done
        ? 0
        : Math.max(...nextActions.map((action) => this.q[experience.nextState][action]));
      const target = experience.reward + this.gamma * nextBest;
      const rate = Math.min(0.95, this.alpha * weight);
      this.q[experience.state][experience.action] +=
        rate * (target - this.q[experience.state][experience.action]);
      this.policyVersion += 1;
    }

    observe(experience) {
      const normalized = {
        ...experience,
        source: experience.source === 'player' ? 'player' : 'agent',
      };
      this.experiences.push(normalized);
      if (this.experiences.length > this.maxExperiences) this.experiences.shift();
      this.totalExperience += 1;
      this.visitedStates.add(normalized.state);
      this.visits[normalized.state][normalized.action] += 1;
      this.update(normalized, normalized.source === 'player' ? 1.25 : 1);
    }

    replay(episode, passes = 8) {
      if (!episode.length) return;
      for (let pass = 0; pass < passes; pass += 1) {
        for (let index = episode.length - 1; index >= 0; index -= 1) {
          const experience = episode[index];
          this.update(experience, experience.source === 'player' ? 1.35 : 1);
        }
      }
    }

    hasLearnedState(state) {
      return this.visits[state].some((count) => count > 0);
    }

    get experienceCount() {
      return this.totalExperience;
    }

    get stateCoverage() {
      return this.visitedStates.size;
    }
  }

  window.PocketTabularAgent = PocketTabularAgent;
})();
