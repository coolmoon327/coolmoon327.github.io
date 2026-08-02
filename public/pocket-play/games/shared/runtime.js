(() => {
  const params = new URLSearchParams(window.location.search);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const listeners = new Set();

  function normalizeLanguage(value) {
    return String(value || '')
      .toLowerCase()
      .startsWith('zh')
      ? 'zh'
      : 'en';
  }

  function storedTheme() {
    try {
      const value = window.localStorage.getItem('theme');
      return value === 'light' || value === 'dark' ? value : 'auto';
    } catch {
      return 'auto';
    }
  }

  function normalizeTheme(value) {
    return value === 'light' || value === 'dark' ? value : 'auto';
  }

  function resolveTheme(setting) {
    return setting === 'auto' ? (media.matches ? 'dark' : 'light') : setting;
  }

  let language = normalizeLanguage(
    params.get('lang') ||
      (window.location.pathname.split('/').includes('zh') ? 'zh' : document.documentElement.lang),
  );
  let themeSetting = normalizeTheme(params.get('theme') || storedTheme());
  let theme = resolveTheme(themeSetting);

  function localize(root = document) {
    root.querySelectorAll('[data-en][data-zh]').forEach((element) => {
      element.textContent = element.dataset[language];
    });

    const attributes = [
      ['aria-label', '[data-aria-en][data-aria-zh]', 'ariaEn', 'ariaZh'],
      ['title', '[data-title-en][data-title-zh]', 'titleEn', 'titleZh'],
      [
        'placeholder',
        '[data-placeholder-en][data-placeholder-zh]',
        'placeholderEn',
        'placeholderZh',
      ],
    ];

    attributes.forEach(([attribute, selector, englishKey, chineseKey]) => {
      root.querySelectorAll(selector).forEach((element) => {
        element.setAttribute(
          attribute,
          language === 'zh' ? element.dataset[chineseKey] : element.dataset[englishKey],
        );
      });
    });
  }

  function notify() {
    const settings = { lang: language, theme, themeSetting };
    listeners.forEach((listener) => listener(settings));
    document.dispatchEvent(new CustomEvent('pocket-settings-change', { detail: settings }));
  }

  function apply(next = {}) {
    if (next.lang) language = normalizeLanguage(next.lang);
    if (next.theme) themeSetting = normalizeTheme(next.theme);
    theme = resolveTheme(themeSetting);

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.lang = language;
    document.documentElement.dataset.theme = theme;
    localize();
    notify();
  }

  window.PocketRuntime = {
    get lang() {
      return language;
    },
    get theme() {
      return theme;
    },
    apply,
    localize,
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    text(english, chinese) {
      return language === 'zh' ? chinese : english;
    },
  };

  if (params.get('embed') === '1') document.documentElement.dataset.embed = 'true';

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.source !== 'pocket-game') return;
    if (event.data.type !== 'settings') return;
    apply({ lang: event.data.lang, theme: event.data.theme });
  });

  media.addEventListener('change', () => {
    if (themeSetting === 'auto') apply();
  });

  apply();
})();
