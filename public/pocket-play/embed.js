(() => {
  const scriptUrl = document.currentScript?.src;
  const defaultBase = new URL('./', scriptUrl || document.baseURI);
  const stylesheetUrl = new URL('./embed.css', defaultBase);
  const games = {
    runner: { title: { en: 'Reward Runner', zh: '奖励跑酷' }, height: 360 },
    bandit: { title: { en: 'Explore–Exploit Lab', zh: '探索与利用' }, height: 430 },
    qpath: { title: { en: 'Routing Apprentice', zh: '路由学徒' }, height: 620 },
    return: { title: { en: 'Return Route', zh: '折扣回报' }, height: 430 },
    world: { title: { en: 'Latent Look-Ahead', zh: '潜空间预演' }, height: 600 },
    stl: { title: { en: 'Semantic Sentinel', zh: '时序语义哨兵' }, height: 600 },
    movable: { title: { en: 'Movable Antenna Lab', zh: '可移动天线实验' }, height: 720 },
    pinching: { title: { en: 'Pinching Antenna Lab', zh: '夹持天线实验' }, height: 680 },
    secrecy: {
      title: { en: 'Secrecy Beam Lab', zh: '保密波束实验' },
      height: 600,
    },
    hopper: { title: { en: 'Hopping Apprentice', zh: '跳频学徒' }, height: 600 },
    backscatter: { title: { en: 'Signal Judo', zh: '借波突围' }, height: 620 },
    resilience: {
      title: { en: 'Predict Through the Outage', zh: '断链续航' },
      height: 600,
    },
    orbit: { title: { en: 'Link Acquisition', zh: '链路捕获' }, height: 360 },
    signature: { title: { en: 'Idea Constellation', zh: '灵感星图' }, height: 260 },
    echo: { title: { en: 'Signal Replay', zh: '信号回放' }, height: 430 },
    match: { title: { en: 'Pattern Recall', zh: '图样记忆' }, height: 590 },
    merge: { title: { en: 'Paper Garden', zh: '论文花园' }, height: 700 },
    resource: { title: { en: 'OpenRaaS Mesh', zh: 'OpenRaaS 组网' }, height: 540 },
  };

  function normalizeLanguage(value) {
    return String(value || '')
      .toLowerCase()
      .startsWith('zh')
      ? 'zh'
      : 'en';
  }

  class PocketGame extends HTMLElement {
    static observedAttributes = ['game', 'height', 'label', 'lang', 'theme', 'base', 'loading'];

    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = stylesheetUrl.href;

      this.frame = document.createElement('iframe');
      this.frame.setAttribute('part', 'frame');
      this.frame.referrerPolicy = 'no-referrer';
      this.frame.addEventListener('load', () => this.sendSettings());

      this.error = document.createElement('p');
      this.error.setAttribute('part', 'error');
      this.error.setAttribute('role', 'alert');
      this.error.hidden = true;
      this.hasRendered = false;
      this.themeObserver = null;

      shadow.append(stylesheet, this.frame, this.error);
    }

    connectedCallback() {
      this.themeObserver = new MutationObserver(() => {
        this.updateFrameLabel();
        this.sendSettings();
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'lang'],
      });
      this.render();
    }

    disconnectedCallback() {
      this.themeObserver?.disconnect();
      this.themeObserver = null;
    }

    attributeChangedCallback(name) {
      if (!this.isConnected || !this.hasRendered) return;
      if (name === 'lang' || name === 'theme') {
        this.updateFrameLabel();
        this.sendSettings();
        return;
      }
      this.render();
    }

    resolvedLanguage() {
      const explicit = this.getAttribute('lang');
      if (explicit) return normalizeLanguage(explicit);
      if (window.location.pathname.split('/').includes('zh')) return 'zh';
      return normalizeLanguage(document.documentElement.lang);
    }

    resolvedTheme() {
      const explicit = this.getAttribute('theme');
      if (explicit === 'light' || explicit === 'dark') return explicit;
      const hostTheme = document.documentElement.dataset.theme;
      return hostTheme === 'light' || hostTheme === 'dark' ? hostTheme : 'auto';
    }

    updateFrameLabel() {
      const metadata = games[this.getAttribute('game') || 'orbit'];
      if (!metadata) return;
      const language = this.resolvedLanguage();
      this.frame.title =
        this.getAttribute('label') ||
        (language === 'zh' ? `${metadata.title.zh}小游戏` : `${metadata.title.en} mini game`);
    }

    sendSettings() {
      const source = this.frame.getAttribute('src');
      if (!source || !this.frame.contentWindow || this.frame.hidden) return;

      const origin = new URL(source, document.baseURI).origin;
      this.frame.contentWindow.postMessage(
        {
          source: 'pocket-game',
          type: 'settings',
          lang: this.resolvedLanguage(),
          theme: this.resolvedTheme(),
        },
        origin === 'null' ? '*' : origin,
      );
    }

    render() {
      const gameId = this.getAttribute('game') || 'orbit';
      const metadata = games[gameId];

      if (!metadata) {
        const language = this.resolvedLanguage();
        this.hasRendered = true;
        this.frame.hidden = true;
        this.frame.removeAttribute('src');
        this.error.hidden = false;
        this.error.textContent =
          language === 'zh' ? `未知游戏：${gameId}` : `Unknown game: ${gameId}`;
        return;
      }

      let baseUrl = defaultBase;
      const baseOverride = this.getAttribute('base');
      if (baseOverride) baseUrl = new URL(baseOverride, document.baseURI);

      const gameUrl = new URL(`games/${gameId}/`, baseUrl);
      gameUrl.searchParams.set('embed', '1');
      gameUrl.searchParams.set('lang', this.resolvedLanguage());
      gameUrl.searchParams.set('theme', this.resolvedTheme());

      const requestedHeight = Number.parseInt(this.getAttribute('height'), 10);
      const height = Number.isFinite(requestedHeight)
        ? Math.min(720, Math.max(metadata.height, requestedHeight))
        : metadata.height;

      this.error.hidden = true;
      this.frame.hidden = false;
      this.updateFrameLabel();
      this.frame.loading = this.getAttribute('loading') === 'eager' ? 'eager' : 'lazy';
      this.frame.height = String(height);
      this.frame.src = gameUrl.href;
      this.hasRendered = true;
    }
  }

  if (!customElements.get('pocket-game')) {
    customElements.define('pocket-game', PocketGame);
  }
})();
