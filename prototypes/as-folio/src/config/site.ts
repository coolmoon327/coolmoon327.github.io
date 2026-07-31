/**
 * as-folio site configuration
 *
 * This file replaces _config.yml from al-folio.
 * Update the values below to personalize your site.
 * All configuration is fully typed — your editor will catch mistakes.
 */

// ─── Navigation types (exported for use in Navbar.astro / SearchTrigger) ────

/** A simple navigation link. */
export type NavLeaf = { label: string; href: string };

/**
 * A dropdown group. `label` is the trigger text; `children` are the menu items.
 * Maximum supported depth is 2 levels (group → item). Do not nest further.
 */
export type NavDropdown = { label: string; children: NavLeaf[] };

/** A top-level nav entry — either a plain link or a dropdown group. */
export type NavItem = NavLeaf | NavDropdown;

export const site = {
  // ─── Derived deployment values ────────────────────────────────────────────

  /** Site origin from Astro's resolved `site` option. */
  url: import.meta.env.SITE.replace(/\/$/, ''),

  /** Base path from Astro's resolved `base` option. */
  base: import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, ''),

  // ─── Identity ──────────────────────────────────────────────────────────────

  /** Site title. Shown in the browser tab and navbar. */
  title: 'Yuhang Shen',

  /** Site description. Used in meta tags. */
  description:
    'Yuhang Shen is a PhD student in Electrical and Computer Engineering at Khalifa University.',

  /** Language code for the site. */
  lang: 'en',

  // ─── Author ────────────────────────────────────────────────────────────────

  author: {
    /** Full name shown in navbar, about page heading, and footer. */
    name: 'Yuhang Shen',

    /** Short email address (used in social links). */
    email: '',

    /** Path to profile photo. Place image in public/assets/img/. */
    avatar: '/assets/img/yuhang-shen.jpg',

    /**
     * Subtitle below your name on the about page.
     * HTML is supported.
     */
    subtitle: `PhD Student in Electrical and Computer Engineering
      &nbsp;·&nbsp;
      <a href="https://www.ku.ac.ae/">Khalifa University</a>`,

    /**
     * Address block below profile photo.
     * HTML is supported.
     */
    moreInfo: '<p>Abu Dhabi, United Arab Emirates</p>',
  },

  // ─── Social links ──────────────────────────────────────────────────────────
  //
  // Supported platforms (set to undefined to hide):
  //   email, x_username, linkedin_username, github_username, gitlab_username,
  //   scholar_userid, orcid_id, inspire_id, researchgate_username,
  //   arxiv_id, youtube_id, instagram_username, mastodon_url,
  //   bluesky_handle, medium_username, cv_pdf, rss_icon

  socials: {
    email: undefined as string | undefined,
    x_username: undefined as string | undefined,
    linkedin_username: undefined as string | undefined,
    github_username: 'coolmoon327',
    gitlab_username: undefined as string | undefined,
    /** Google Scholar user ID — the part after user= in your Scholar URL */
    scholar_userid: 'JNrwfFQAAAAJ',
    orcid_id: '0000-0002-3358-3463',
    /** Inspire HEP author ID */
    inspire_id: undefined as string | undefined,
    researchgate_username: undefined as string | undefined,
    arxiv_id: undefined as string | undefined,
    youtube_id: undefined as string | undefined,
    instagram_username: undefined as string | undefined,
    mastodon_url: undefined as string | undefined,
    bluesky_handle: undefined as string | undefined,
    medium_username: undefined as string | undefined,
    /** Path to CV PDF in public/assets/pdf/ */
    cv_pdf: undefined as string | undefined,
    /** Show RSS icon in social links */
    rss_icon: false,
  },

  // ─── Internationalization ────────────────────────────────────────────────

  i18n: {
    /** English is served at the root; Chinese mirrors each core route under /zh/. */
    defaultLocale: 'en' as 'en' | 'zh',
    locales: {
      en: {
        lang: 'en',
        homeHref: '/',
        switchLabel: '中文',
        skipLink: 'Skip to main content',
        backToTop: 'Back to top',
        toggleTheme: 'Toggle theme',
        toggleNavigation: 'Toggle navigation',
        selectedWork: 'Selected work',
        navbar: {
          items: [
            { label: 'about', href: '/' },
            { label: 'research', href: '/research/' },
            { label: 'publications', href: '/publications/' },
            { label: 'projects', href: '/projects/' },
            { label: 'blog', href: '/blog/' },
            { label: 'owner', href: '/owner/' },
          ] as NavItem[],
        },
      },
      zh: {
        lang: 'zh-CN',
        homeHref: '/zh/',
        switchLabel: 'English',
        skipLink: '跳到主要内容',
        backToTop: '返回顶部',
        toggleTheme: '切换主题',
        toggleNavigation: '切换导航',
        selectedWork: '代表性成果',
        navbar: {
          items: [
            { label: '关于', href: '/zh/' },
            { label: '研究', href: '/zh/research/' },
            { label: '论文', href: '/zh/publications/' },
            { label: '项目', href: '/zh/projects/' },
            { label: '博客', href: '/zh/blog/' },
            { label: '主人入口', href: '/zh/owner/' },
          ] as NavItem[],
        },
      },
    },
  },

  // ─── Navigation ────────────────────────────────────────────────────────────

  navbar: {
    /** Fix navbar to top of viewport. */
    fixed: true,
    /** Show social icons in navbar (about page only). */
    socialIcons: false,
    /**
     * Top-level navigation items.
     * Use `{ label, href }` for a plain link.
     * Use `{ label, children: [...] }` for a dropdown group (max 2 levels).
     *
     * `href` values are relative to the site root (base is prepended automatically).
     */
    items: [{ label: 'about', href: '/' }] as NavItem[],
  },

  // ─── Footer ────────────────────────────────────────────────────────────────

  footer: {
    /** Localized footer copy. HTML is supported in `text`. */
    localized: {
      en: {
        authorName: 'Yuhang Shen',
        text: `Powered by <a href="https://github.com/dadangnh/as-folio" target="_blank" rel="noopener noreferrer">as-folio</a>.
          Hosted by <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</a>.`,
        lastUpdatedLabel: 'Last updated',
        legalLabel: 'Legal notice',
      },
      zh: {
        authorName: '沈煜航',
        text: `基于 <a href="https://github.com/dadangnh/as-folio" target="_blank" rel="noopener noreferrer">as-folio</a> 构建，
          由 <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">GitHub Pages</a> 托管。`,
        lastUpdatedLabel: '最后更新',
        legalLabel: '法律声明',
      },
    },
    /** Show "Last updated" timestamp in footer. */
    lastUpdated: false,
    /** Path to impressum/legal page (EU GDPR). Leave undefined to hide. */
    impressum: undefined as string | undefined,
    /**
     * Footer display mode:
     * 'sticky'  — always visible at the bottom of the viewport (al-folio default)
     * 'normal'  — sits at the natural bottom of page content (only visible when scrolled down)
     * 'hidden'  — footer is not rendered at all
     */
    position: 'normal' as 'sticky' | 'normal' | 'hidden',
  },

  // ─── CV page ───────────────────────────────────────────────────────────────

  cv: {
    /**
     * Which CV data format to render.
     * 'rendercv' → reads src/data/cv.yml (RenderCV YAML format)
     * 'jsonresume' → reads src/data/resume.json (JSONResume format)
     */
    format: 'rendercv' as 'rendercv' | 'jsonresume',
    /** Path to CV PDF for the download button in public/assets/pdf/. */
    pdfPath: '',
  },

  // ─── Blog ──────────────────────────────────────────────────────────────────

  blog: {
    /** Name shown in the blog page heading. */
    name: 'Yuhang Shen · Notes',
    description: 'A future home for research notes and technical writing.',
    /** Number of posts per page. */
    postsPerPage: 5,
    /**
     * Tags shown as badges on the blog listing page header.
     * Users can click them to filter posts by tag.
     */
    displayTags: [] as string[],
    /** Categories shown as badges on the blog listing page header. */
    displayCategories: [] as string[],
    /**
     * External post sources (fetched at build time).
     * Each entry is either an RSS feed URL or a list of individual post objects.
     */
    externalSources: [] as Array<{
      name: string;
      rssUrl?: string;
      posts?: Array<{ url: string; publishedDate: string }>;
      categories?: string[];
      tags?: string[];
    }>,
    /** Average reading speed (words per minute) used for reading-time estimates. */
    wordsPerMinute: 200 as number,
    /** Message shown on the blog listing page when no posts exist. */
    emptyMessage: 'The blog is being prepared. New writing will appear here.',
  },

  // ─── Homepage ────────────────────────────────────────────────────────────

  home: {
    /** Enable the personalized academic homepage experience. */
    enabled: true,
    en: {
      eyebrow: 'Secure wireless systems · Learning · Optimization',
      name: 'Yuhang Shen',
      role: 'PhD Student in Electrical and Computer Engineering',
      institution: 'Khalifa University',
      location: 'Abu Dhabi, United Arab Emirates',
      intro:
        'I study physical-layer security for zero-energy 6G IoT and IoE systems, with an emphasis on wireless communications and reinforcement-learning-based optimization for secure transmission.',
      primaryAction: { label: 'Explore my research', href: '/research/' },
      secondaryAction: { label: 'View GitHub', href: 'https://github.com/coolmoon327' },
      profileLabel: 'Profile',
      researchLabel: 'Current research',
      researchIntro:
        'My current doctoral work is represented by its research questions, not by placeholder publication entries. Public titles are added only when a stable version is available.',
      researchAction: 'View research profile',
      research: [
        'Physical-layer security for zero-energy 6G',
        'Secure transmission for IoT and IoE systems',
        'Reinforcement learning for wireless optimization',
        'Wireless communications and resource allocation',
      ],
      publicationsLabel: 'Recent public work',
      publicationsAction: 'Open publication',
      publications: [
        {
          year: '2026',
          title:
            'Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks',
          type: 'Preprint',
          href: 'https://arxiv.org/abs/2603.07984',
        },
        {
          year: '2024',
          title:
            'Deep Reinforcement Learning-Based Social Welfare Maximization for Collaborative Edge Computing',
          type: 'IEEE iWRF&AT',
          href: 'https://doi.org/10.1109/iWRFAT61200.2024.10594571',
        },
        {
          year: '2024',
          title:
            'ES-ATF: Early Smoke Detection based on Attention-aggregated Temporal Feature Extraction',
          type: 'IEEE ICEET',
          href: 'https://doi.org/10.1109/ICEET65156.2024.10913544',
        },
        {
          year: '2022',
          title:
            'An online auction-based incentive mechanism for soft-deadline tasks in Collaborative Edge Computing',
          type: 'Future Generation Computer Systems',
          href: 'https://doi.org/10.1016/j.future.2022.07.001',
        },
        {
          year: '2022',
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          type: 'IEEE WCNC',
          href: 'https://doi.org/10.1109/WCNC51071.2022.9771592',
        },
      ],
      projectsLabel: 'Research systems',
      projectsAction: 'Open work',
      projects: [
        {
          title: 'Open Resource-as-a-Service — Master’s thesis',
          meta: 'M.Eng. research story',
          description:
            'A bilingual introduction to the thesis and its relationship with OpenRaaS and FogCom.',
          href: '/research/openraas-thesis/',
        },
        {
          title: 'FogCom',
          meta: 'Research prototype · Maintainer',
          description:
            'PPO-based candidate-set control for a collaborative fog-computing simulation.',
          href: 'https://github.com/coolmoon327/FogCom',
        },
        {
          title: 'OpenRaaS',
          meta: 'Collaborative systems project · Contributor',
          description:
            'A decentralized resource-service infrastructure that separates runtime, storage, and compute roles.',
          href: 'https://github.com/zobinHuang/OpenRaaS',
        },
        {
          title: 'RL-driven face-tracking conference system',
          meta: 'Collaborative embedded system',
          description:
            'A HiSilicon and OpenHarmony prototype combining face detection, edge offloading, and reinforcement-learning-based arm control.',
          href: 'https://zobinhuang.github.io/sec_about/project_socchina/report.pdf',
        },
        {
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          meta: 'Research code · WP-MEC',
          description:
            'Public code supporting online energy-minimization research in wireless-powered mobile edge computing.',
          href: 'https://github.com/coolmoon327/Online-Scheduling-for-Energy-Minimization-in-Wireless-Powered-Mobile-Edge-Computing',
        },
        {
          title: 'ieeexplore-ku-oa',
          meta: 'Open-source utility',
          description:
            'A practical utility for checking open-access availability from IEEE Xplore at Khalifa University.',
          href: 'https://github.com/coolmoon327/ieeexplore-ku-oa',
        },
      ],
      linksLabel: 'Public profiles',
      links: [
        { label: 'ORCID', href: 'https://orcid.org/0000-0002-3358-3463' },
        { label: 'GitHub', href: 'https://github.com/coolmoon327' },
        {
          label: 'Google Scholar',
          href: 'https://scholar.google.com/citations?user=JNrwfFQAAAAJ',
        },
      ],
    },
    zh: {
      eyebrow: '安全无线系统 · 学习 · 优化',
      name: '沈煜航',
      role: '电气与计算机工程博士研究生',
      institution: '哈利法大学',
      location: '阿联酋阿布扎比',
      intro:
        '我研究面向零能耗 6G 物联网与万物互联系统的物理层安全，重点关注无线通信与基于强化学习的安全传输优化。',
      primaryAction: { label: '查看研究概况', href: '/zh/research/' },
      secondaryAction: { label: '访问 GitHub', href: 'https://github.com/coolmoon327' },
      profileLabel: '个人资料',
      researchLabel: '当前研究',
      researchIntro:
        '博士阶段工作先按研究问题呈现，而不是用占位论文条目凑数量；只有存在稳定公开版本后才加入具体题目。',
      researchAction: '查看研究概况',
      research: [
        '面向零能耗 6G 的物理层安全',
        'IoT 与 IoE 系统的安全传输',
        '用于无线优化的强化学习',
        '无线通信与资源分配',
      ],
      publicationsLabel: '近期公开工作',
      publicationsAction: '打开论文',
      publications: [
        {
          year: '2026',
          title:
            'Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks',
          type: '预印本',
          href: 'https://arxiv.org/abs/2603.07984',
        },
        {
          year: '2024',
          title:
            'Deep Reinforcement Learning-Based Social Welfare Maximization for Collaborative Edge Computing',
          type: 'IEEE iWRF&AT',
          href: 'https://doi.org/10.1109/iWRFAT61200.2024.10594571',
        },
        {
          year: '2024',
          title:
            'ES-ATF: Early Smoke Detection based on Attention-aggregated Temporal Feature Extraction',
          type: 'IEEE ICEET',
          href: 'https://doi.org/10.1109/ICEET65156.2024.10913544',
        },
        {
          year: '2022',
          title:
            'An online auction-based incentive mechanism for soft-deadline tasks in Collaborative Edge Computing',
          type: 'Future Generation Computer Systems',
          href: 'https://doi.org/10.1016/j.future.2022.07.001',
        },
        {
          year: '2022',
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          type: 'IEEE WCNC',
          href: 'https://doi.org/10.1109/WCNC51071.2022.9771592',
        },
      ],
      projectsLabel: '研究系统',
      projectsAction: '打开项目',
      projects: [
        {
          title: '开放资源即服务 — 硕士论文',
          meta: '硕士研究脉络',
          description: '中英文介绍硕士论文，以及它与 OpenRaaS、FogCom 的关系。',
          href: '/zh/research/openraas-thesis/',
        },
        {
          title: 'FogCom',
          meta: '研究原型 · 维护者',
          description: '面向协同雾计算仿真环境、基于 PPO 的候选资源集合控制。',
          href: 'https://github.com/coolmoon327/FogCom',
        },
        {
          title: 'OpenRaaS',
          meta: '合作系统项目 · 贡献者',
          description: '将运行环境、存储与计算角色解耦的去中心化资源服务基础设施。',
          href: 'https://github.com/zobinHuang/OpenRaaS',
        },
        {
          title: '强化学习驱动的人脸追踪远程会议系统',
          meta: '合作嵌入式系统',
          description:
            '基于海思与 OpenHarmony 的原型，结合人脸检测、边缘卸载和强化学习机械臂控制。',
          href: 'https://zobinhuang.github.io/sec_about/project_socchina/report.pdf',
        },
        {
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          meta: '研究代码 · WP-MEC',
          description: '无线供能移动边缘计算中在线能耗最小化研究的公开代码。',
          href: 'https://github.com/coolmoon327/Online-Scheduling-for-Energy-Minimization-in-Wireless-Powered-Mobile-Edge-Computing',
        },
        {
          title: 'ieeexplore-ku-oa',
          meta: '开源工具',
          description: '用于检查哈利法大学 IEEE Xplore 论文开放获取状态的实用工具。',
          href: 'https://github.com/coolmoon327/ieeexplore-ku-oa',
        },
      ],
      linksLabel: '公开主页',
      links: [
        { label: 'ORCID', href: 'https://orcid.org/0000-0002-3358-3463' },
        { label: 'GitHub', href: 'https://github.com/coolmoon327' },
        {
          label: 'Google Scholar',
          href: 'https://scholar.google.com/citations?user=JNrwfFQAAAAJ',
        },
      ],
    },
  },

  // ─── Research overview ─────────────────────────────────────────────────

  research: {
    en: {
      eyebrow: 'Research profile',
      title: 'Research',
      intro:
        'My work connects secure wireless communications with learning-based optimization, while building on earlier research in collaborative edge and fog computing.',
      currentLabel: 'Current doctoral research',
      currentTitle: 'Physical-layer security for zero-energy 6G IoT and IoE systems',
      currentBody:
        'My doctoral research studies secure transmission for future wireless systems, with particular interest in reinforcement-learning-based optimization. The dissertation title below is the official working title recorded by the program.',
      programLabel: 'Program',
      program: 'PhD in Engineering — Electrical & Computer Engineering',
      dissertationLabel: 'Dissertation',
      dissertation: 'PHYSICAL LAYER SECURITY ON ZERO ENERGY 6G IOT AND IOE SYSTEMS',
      studyModeLabel: 'Study mode',
      studyMode: 'Full time',
      advisorsLabel: 'Advisory team',
      advisors: [
        { role: 'Main advisor', name: 'Paschalis Sofotasios' },
        { role: 'Co-advisor', name: 'Sami Muhaidat' },
        { role: 'External co-advisor', name: 'Zhiguo Ding' },
      ],
      publicStatusLabel: 'Public record',
      publicStatus:
        'Several doctoral projects are ongoing or not yet available in archival form. They are described here as research directions rather than padded publication entries; titles and links will be added when public versions are available.',
      trajectoryLabel: 'Research trajectory',
      trajectoryIntro:
        'The progression from systems and resource cooperation to secure wireless optimization is part of one continuous research story.',
      stages: [
        {
          marker: 'Now',
          title: 'Secure zero-energy 6G systems',
          body: 'Physical-layer security, wireless communications, and reinforcement-learning-based optimization for secure transmission in IoT and IoE systems.',
          links: [{ label: 'Publications', href: '/publications/' }],
        },
        {
          marker: 'M.Eng.',
          title: 'Open Resource-as-a-Service and collaborative fog computing',
          body: 'A system-and-algorithm track that connects OpenRaaS, a decentralized resource service infrastructure, with FogCom, a simulation prototype for candidate control under partial observability.',
          links: [
            { label: 'Master’s thesis', href: '/research/openraas-thesis/' },
            { label: 'OpenRaaS', href: 'https://github.com/zobinHuang/OpenRaaS' },
            { label: 'FogCom', href: 'https://github.com/coolmoon327/FogCom' },
          ],
        },
        {
          marker: 'B.Eng.',
          title: 'Adaptive antenna-feed control for 5G base stations',
          body: 'The undergraduate thesis investigated reinforcement-learning-based adaptive antenna-feed control for 5G base stations.',
          links: [],
        },
      ],
      educationLabel: 'Education',
      education:
        'M.Eng. in Network Engineering, B.Eng. in Internet of Things Engineering, and B.A. in Finance, University of Electronic Science and Technology of China (UESTC).',
    },
    zh: {
      eyebrow: '研究概况',
      title: '研究',
      intro:
        '我的研究以安全无线通信与学习驱动的优化为主线，并延续了此前在协同边缘计算与雾计算方面的系统研究。',
      currentLabel: '当前博士研究',
      currentTitle: '面向零能耗 6G 物联网与万物互联的物理层安全',
      currentBody:
        '博士阶段主要研究未来无线系统中的安全传输，并关注基于强化学习的优化方法。下方保留培养项目记录的正式论文题目。',
      programLabel: '培养项目',
      program: '工程学博士 — 电气与计算机工程',
      dissertationLabel: '博士论文',
      dissertation: 'PHYSICAL LAYER SECURITY ON ZERO ENERGY 6G IOT AND IOE SYSTEMS',
      studyModeLabel: '学习方式',
      studyMode: '全日制',
      advisorsLabel: '指导团队',
      advisors: [
        { role: '主导师', name: 'Paschalis Sofotasios' },
        { role: '联合导师', name: 'Sami Muhaidat' },
        { role: '校外联合导师', name: 'Zhiguo Ding' },
      ],
      publicStatusLabel: '公开状态',
      publicStatus:
        '部分博士阶段工作仍在进行中，或尚未形成可公开的正式版本。因此这里先展示研究方向，不用未经核实的论文条目填充数量；待公开版本可用后再补充题目与链接。',
      trajectoryLabel: '研究脉络',
      trajectoryIntro: '从系统与资源协作到安全无线优化，这些工作构成了一条连续的研究路径。',
      stages: [
        {
          marker: '当前',
          title: '安全的零能耗 6G 系统',
          body: '面向 IoT 与 IoE 系统，研究物理层安全、无线通信，以及基于强化学习的安全传输优化。',
          links: [{ label: '公开论文', href: '/zh/publications/' }],
        },
        {
          marker: '硕士',
          title: '开放资源即服务与协同雾计算',
          body: '这一阶段把系统与算法连接起来：OpenRaaS 提供去中心化的资源服务基础设施，FogCom 则研究局部可观测条件下的候选资源控制。',
          links: [
            { label: '硕士论文', href: '/zh/research/openraas-thesis/' },
            { label: 'OpenRaaS', href: 'https://github.com/zobinHuang/OpenRaaS' },
            { label: 'FogCom', href: 'https://github.com/coolmoon327/FogCom' },
          ],
        },
        {
          marker: '本科',
          title: '5G 基站自适应天馈控制',
          body: '本科毕业论文研究了基于强化学习的 5G 基站自适应天馈系统。',
          links: [],
        },
      ],
      educationLabel: '教育经历',
      education: '电子科技大学网络工程硕士、物联网工程学士，以及金融学文学学士。',
    },
  },

  // ─── Master's thesis ───────────────────────────────────────────────────

  thesis: {
    en: {
      eyebrow: 'M.Eng. thesis · Systems and learning',
      title: 'Open Resource-as-a-Service',
      subtitle: 'Cooperative orchestration across heterogeneous compute and storage resources',
      titleLabel: 'Final thesis title',
      originalTitle: '开放资源即服务',
      degreeLabel: 'Degree',
      degree: 'M.Eng. in Network Engineering · 2024',
      institutionLabel: 'Institution',
      institution: 'University of Electronic Science and Technology of China (UESTC)',
      overviewLabel: 'Research question',
      overview:
        'How can heterogeneous compute and storage resources—distributed across different devices, locations, and providers—be exposed as a cooperative service without binding an application to one machine or one cloud?',
      approachLabel: 'Approach',
      approach:
        'The work combines a resource-service architecture with a learning-based scheduling model. OpenRaaS provides the system view; FogCom isolates the leader–follower resource-selection problem so that it can be studied under partial network observability.',
      contributionsLabel: 'From architecture to decision making',
      contributions: [
        {
          index: '01',
          title: 'Separate the resource roles',
          body: 'The OpenRaaS architecture separates an application’s runtime environment, persistent files, and rendering or computation so that each role can be placed on a suitable node.',
        },
        {
          index: '02',
          title: 'Coordinate heterogeneous infrastructure',
          body: 'A global coordinator combines compute, file-storage, and image-layer repository nodes to serve a request while balancing user-facing quality and provider-side resource use.',
        },
        {
          index: '03',
          title: 'Learn under partial observation',
          body: 'FogCom abstracts the scheduling problem into leader and follower decisions. A PPO policy filters storage candidates, while the selected compute provider makes the final choice using information unavailable to the leader.',
        },
      ],
      artifactsLabel: 'Public implementation trail',
      artifactsIntro:
        'These repositories are public artifacts from the same research trajectory. They clarify the architecture and simulation model; they are not presented as a claim that every thesis experiment is reproduced by the current repository state.',
      artifacts: [
        {
          title: 'OpenRaaS',
          meta: 'Decentralized container-based resource-service platform',
          body: 'The collaborative system implementation, maintained in Zhuobin Huang’s GitHub account. Its public contributor list includes Yuhang Shen.',
          href: 'https://github.com/zobinHuang/OpenRaaS',
          action: 'Open repository',
        },
        {
          title: 'FogCom',
          meta: 'Leader–follower scheduling research prototype',
          body: 'A simulation and PPO implementation for candidate-set control in collaborative fog computing.',
          href: 'https://github.com/coolmoon327/FogCom',
          action: 'Open repository',
        },
      ],
      recordLabel: 'Thesis record',
      recordTitle: 'CNKI thesis record',
      recordBody:
        'Open the item-level CNKI page for the final thesis record. The linked record is presented through CNKI’s Chinese-language interface.',
      recordHref:
        'https://kns.cnki.net/kcms2/article/abstract?v=jit-Bskw5eSkYVMAzlqxgVxt0tsTeEpcwX_4QPsfLj16FTG1RkOq_L8HTHaDInAcSNMPNPcK6qmh8M4DL935NTFM9z8GffWmtIZrfPuh1TnP1mdK9tUYxqyK1cBDs08XcLSxlWNqRNsF_cKthDRh0PZm00FoSTpk1jU5lnvtThonTP_3jSCI98JdwNvJUhVL&uniplatform=NZKPT&language=CHS',
      recordAction: 'Open CNKI record',
      backLabel: 'Back to research',
      backHref: '/research/',
    },
    zh: {
      eyebrow: '硕士学位论文 · 系统与学习',
      title: '开放资源即服务',
      subtitle: '面向异构计算与存储资源的合作式编排',
      titleLabel: '最终论文题目',
      originalTitle: '开放资源即服务',
      degreeLabel: '学位',
      degree: '网络工程硕士 · 2024',
      institutionLabel: '培养单位',
      institution: '电子科技大学',
      overviewLabel: '研究问题',
      overview:
        '当计算与存储资源分布在不同设备、位置和提供者之间，并具有显著异构性时，如何把它们组织成可协作的服务，而不让应用被单一设备或单一云平台绑定？',
      approachLabel: '研究路径',
      approach:
        '这项工作把资源服务架构与学习驱动的调度模型结合起来：OpenRaaS 提供系统视角，FogCom 则把其中的主从式资源选择问题抽象出来，用于研究局部网络信息条件下的决策。',
      contributionsLabel: '从系统架构到资源决策',
      contributions: [
        {
          index: '01',
          title: '拆分资源角色',
          body: 'OpenRaaS 将应用的运行环境、持久化文件，以及渲染或计算拆分，使不同角色可以部署到更合适的节点。',
        },
        {
          index: '02',
          title: '协同异构基础设施',
          body: '全局协调节点组合计算、文件存储与镜像层仓库节点，在面向用户的服务质量与提供者侧的资源利用之间进行协调。',
        },
        {
          index: '03',
          title: '在局部观测下学习',
          body: 'FogCom 将调度抽象为 leader 与 follower 两层决策：PPO 策略筛选存储候选集，选中的计算节点再利用 leader 不具备的信息完成最终选择。',
        },
      ],
      artifactsLabel: '公开工程脉络',
      artifactsIntro:
        '下列仓库是同一研究脉络中的公开工程材料，用于说明架构与仿真模型；这里不会把仓库当前状态表述成对论文全部实验的完整复现。',
      artifacts: [
        {
          title: 'OpenRaaS',
          meta: '去中心化、基于容器的资源服务平台',
          body: '合作完成的系统实现，由黄卓彬的 GitHub 账号维护；公开贡献者列表包含沈煜航。',
          href: 'https://github.com/zobinHuang/OpenRaaS',
          action: '打开仓库',
        },
        {
          title: 'FogCom',
          meta: '主从式调度研究原型',
          body: '面向协同雾计算候选集合控制的仿真与 PPO 实现。',
          href: 'https://github.com/coolmoon327/FogCom',
          action: '打开仓库',
        },
      ],
      recordLabel: '论文记录',
      recordTitle: '知网论文详情',
      recordBody: '打开硕士学位论文《开放资源即服务》的知网单篇详情页。',
      recordHref:
        'https://kns.cnki.net/kcms2/article/abstract?v=jit-Bskw5eSkYVMAzlqxgVxt0tsTeEpcwX_4QPsfLj16FTG1RkOq_L8HTHaDInAcSNMPNPcK6qmh8M4DL935NTFM9z8GffWmtIZrfPuh1TnP1mdK9tUYxqyK1cBDs08XcLSxlWNqRNsF_cKthDRh0PZm00FoSTpk1jU5lnvtThonTP_3jSCI98JdwNvJUhVL&uniplatform=NZKPT&language=CHS',
      recordAction: '打开知网论文记录',
      backLabel: '返回研究概况',
      backHref: '/zh/research/',
    },
  },

  // ─── About page sections ──────────────────────────────────────────────────

  announcements: {
    /** Show news/announcements section on the about page. */
    enabled: false,
    /** Enable vertical scroll if more than 3 items. */
    scrollable: true,
    /** Max news items to show (undefined = show all). */
    limit: 5 as number | undefined,
  },

  latestPosts: {
    /** Show latest blog posts section on the about page. */
    enabled: false,
    scrollable: true,
    limit: 3 as number | undefined,
  },

  selectedPapers: {
    /** Show selected publications section on the about page. */
    enabled: false,
  },

  // ─── Features ─────────────────────────────────────────────────────────────

  features: {
    /** Enable dark/light mode toggle in navbar. */
    darkmode: true,
    /** Enable ⌘K search. */
    search: false,
    /** Enable reading progress bar on blog posts. */
    progressBar: true,
    /** Show back-to-top button. */
    backToTop: true,
    /** Enable automatic masonry layout for project cards. */
    masonry: true,
    /** Enable click-to-zoom on images (medium-zoom). */
    mediumZoom: true,
    /** Show styled CSS tooltips on hover for project card icons and publication annotations.
     *  When false, the browser's native title-attribute tooltip is used instead. */
    tooltips: false,
    /** Enable GDPR-compliant cookie consent dialog. */
    cookieConsent: false,
    /** Enable newsletter subscription form. */
    newsletter: false,
    /**
     * Enable video embedding for BibTeX entries.
     * If false, video links open in a new tab instead.
     */
    videoEmbedding: false,
    /**
     * Enable Astro View Transitions for smooth page-to-page animations.
     * Disable if you prefer full page reloads (e.g. for accessibility reasons).
     */
    viewTransitions: true,
    /** Show social sharing links (X, LinkedIn, Facebook, email) at the bottom of blog posts. */
    socialShare: true,
  },

  // ─── Giscus comments ──────────────────────────────────────────────────────
  // Follow setup at https://giscus.app/ then fill in the values below.

  giscus: {
    /** Set to true once you've configured the fields below. */
    enabled: false,
    /**
     * When true, Giscus is hidden behind a "Load comments" button — the
     * giscus.app script is only fetched after the user opts in.
     * Recommended for GDPR compliance (giscus sets third-party cookies).
     * Default: true.
     */
    lazyLoad: true,
    repo: '' as `${string}/${string}`,
    repoId: '',
    category: 'Comments',
    categoryId: '',
    /** How to map discussions to pages. */
    mapping: 'title' as 'pathname' | 'url' | 'title' | 'og:title',
    strict: true,
    reactionsEnabled: true,
    inputPosition: 'bottom' as 'top' | 'bottom',
    darkTheme: 'dark',
    lightTheme: 'light',
    lang: 'en',
  },

  // ─── Analytics ────────────────────────────────────────────────────────────

  analytics: {
    /** Google Analytics 4 measurement ID (format: G-XXXXXXXXXX). */
    ga4: '' as string,
    /** Cronitor RUM analytics site ID. */
    cronitor: '' as string,
    /** Pirsch analytics site ID. */
    pirsch: '' as string,
    /** OpenPanel analytics client ID. */
    openpanel: '' as string,
    /** Google Search Console verification ID. */
    googleVerification: '' as string,
    /** Bing Webmaster verification ID. */
    bingVerification: '' as string,
  },

  // ─── Open Graph ───────────────────────────────────────────────────────────

  og: {
    /** Include Open Graph meta tags. */
    enabled: true,
    /** Default OG image path (in public/). */
    image: '' as string,
  },

  // ─── Newsletter ───────────────────────────────────────────────────────────

  newsletter: {
    /** Loops.so form endpoint. */
    endpoint: '' as string,
  },

  // ─── Teaching page ────────────────────────────────────────────────────────

  teaching: {
    /**
     * Google Calendar ID for the "Upcoming Events" section.
     * Set to a calendar address like 'user@gmail.com' to show the embed.
     * Leave empty string to hide the calendar section entirely.
     */
    calendarId: '' as string,
    /** Timezone for the Google Calendar embed (e.g., 'America/New_York'). */
    timezone: 'America/New_York' as string,
  },

  // ─── Publications ─────────────────────────────────────────────────────────

  publications: {
    /**
     * Show badges for individual publication entries.
     * Can be disabled globally here; also toggleable per entry in BibTeX.
     */
    badges: {
      altmetric: false,
      dimensions: false,
      googleScholar: false,
      inspirehep: false,
    },
    /**
     * Max number of authors shown before "and N more..." link.
     * Set to undefined to always show all authors.
     */
    maxAuthorLimit: 3 as number | undefined,
    /** Enable thumbnail images for publications (if `preview` set in BibTeX). */
    thumbnails: true,
    /**
     * Last name used to italicise your name in publication author lists.
     * Defaults to the last word of `site.author.name` when not set.
     * Override explicitly if your publications use a different name form.
     */
    authorLastName: 'Shen' as string | undefined,
    /** Path prefix (relative to public/) for publication preview images. */
    previewDir: '/assets/img/publication_preview/',
    /** Path prefix (relative to public/) for publication PDFs and supplements. */
    pdfDir: '/assets/pdf/',
    /** UI labels — override for non-English sites. */
    labels: {
      abstract: 'Abs',
      bibtex: 'Bib',
      supp: 'Supp',
      searchPlaceholder: 'Search publications\u2026',
      noResults: 'No publications match your search.',
    },
  },

  // ─── Repositories ────────────────────────────────────────────────────────

  repositories: {
    /** Show GitHub user stats cards. */
    githubUsers: true,
    /** Show GitHub repository pin cards. */
    githubRepos: true,
    /** Show GitHub trophy stats (repo_trophies). Disabled by default — the service has known reliability issues. */
    trophies: false,
    /** Theme for light mode (from github-readme-stats themes). */
    themeLight: 'default' as string,
    /** Theme for dark mode. */
    themeDark: 'dark' as string,
    /** Trophy card theme for light mode (from github-profile-trophy themes). */
    trophyThemeLight: 'flat' as string,
    /** Trophy card theme for dark mode. */
    trophyThemeDark: 'gitdimmed' as string,
  },

  // ─── Comments ─────────────────────────────────────────────────────────────

  comments: {
    /**
     * Disqus shortname — the subdomain part of YOUR-SHORTNAME.disqus.com.
     * Required when a post sets `disqus: true` in frontmatter.
     * Leave empty string if not using Disqus.
     */
    disqusShortname: '' as string,
  },

  // ─── Page copy ────────────────────────────────────────────────────────────

  pages: {
    projects: {
      /** Description shown below the "projects" heading on the projects page. */
      description: 'Selected public research and software repositories.',
    },
    teaching: {
      /** Description shown below the "teaching" heading on the teaching page. */
      description: 'Course materials, schedules, and resources for classes taught.',
    },
    localized: {
      en: {
        publications: {
          eyebrow: 'Verified public record',
          title: 'Publications',
          intro:
            'Published papers and stable public manuscripts, ordered by year. Current doctoral work is added when an archival version becomes publicly available.',
          status: 'Transparent by design',
          statusTitle: 'Current work is not missing; it is not public yet.',
          statusBody:
            'Several doctoral projects are ongoing, accepted, or awaiting archival publication. I do not list provisional titles, venues, or counts here. This page will be updated as stable records become available.',
        },
        projects: {
          eyebrow: 'Systems & code',
          title: 'Projects',
          intro:
            'Public research systems, collaboration artifacts, and selected software—ordered to show the research story before utility projects.',
          status: 'Public subset',
          statusTitle: 'Not every active project has a public repository.',
          statusBody:
            'Ongoing doctoral code remains private until it is ready for release. The projects below are the verifiable public subset, not a measure of current research activity.',
        },
        blog: {
          eyebrow: 'Notes & writing',
          title: 'Blog',
          intro:
            'The blog now has a permanent place inside the personal site. Articles will be added after the site structure is approved.',
          status: 'In preparation',
          statusTitle: 'Writing will live here.',
          statusBody:
            'Future posts will be published as static pages on GitHub Pages, without redirecting to a home device.',
          topicsLabel: 'Planned sections',
          topics: ['Research notes', 'Engineering notebooks', 'Reading notes'],
        },
        owner: {
          eyebrow: 'Encrypted home directory',
          title: 'Owner access',
          intro:
            'Unlock the current home-service directory without publishing its addresses, ports, or hostnames in the website source.',
          status: 'Browser-side decryption',
          statusTitle: 'Unlock current home links',
          statusBody:
            'Your password remains in this browser tab only long enough to decrypt the latest directory. It is neither transmitted nor persisted.',
          passwordLabel: 'Personal access password',
          passwordPlaceholder: 'Enter your password',
          unlockAction: 'Unlock directory',
          unlockPending: 'Decrypting the latest directory…',
          lockAction: 'Lock and clear',
          lockedStatus: 'The directory is locked. No home address is present in this page.',
          unlockedStatus: 'The directory is unlocked for this browser tab.',
          errorStatus:
            'Unable to unlock the directory. Check the password and connection, then try again.',
          emptyStatus: 'The directory was valid, but it did not contain any supported services.',
          servicesLabel: 'Available home services',
          updatedLabel: 'Directory published',
          expiresLabel: 'Valid until',
          openAction: 'Open service',
          scriptRequired: 'JavaScript is required to unlock this encrypted directory.',
          resetHint:
            'Password changes are made on the home server and take effect after its next successful publication; the website does not need to be rebuilt.',
          rulesLabel: 'Security boundary',
          rules: [
            'Only an encrypted directory is public; addresses and ports remain inside its ciphertext.',
            'This privacy layer is not service authentication. Each destination must keep its own login and network controls.',
            'Direct-IP HTTPS may use a self-managed certificate. Verify the expected certificate or install the home CA instead of bypassing warnings blindly.',
            'A public ciphertext can be guessed offline, so use a long unique password and rotate the bootstrap password.',
          ],
        },
      },
      zh: {
        publications: {
          eyebrow: '已核实的公开记录',
          title: '论文',
          intro:
            '按年份列出已发表论文和具有稳定公开版本的稿件；博士阶段工作在正式公开版本可用后再加入。',
          status: '透明呈现',
          statusTitle: '当前工作并非缺失，而是尚未公开。',
          statusBody:
            '部分博士阶段项目仍在进行、已接收待出版，或尚未形成可归档版本。这里不会提前填写临时题目、期刊或数量；公开记录稳定后再更新。',
        },
        projects: {
          eyebrow: '系统与代码',
          title: '项目',
          intro: '公开研究系统、合作成果与精选软件，并优先呈现研究脉络。',
          status: '公开子集',
          statusTitle: '并非所有活跃项目都有公开代码库。',
          statusBody:
            '博士阶段仍在推进的代码会在适合公开时再发布。下方只是可核实的公开子集，不能用来衡量当前研究活跃度。',
        },
        blog: {
          eyebrow: '笔记与写作',
          title: '博客',
          intro: '博客已经在个人主页内拥有固定位置；待站点结构确认后再逐步加入文章。',
          status: '准备中',
          statusTitle: '以后文章会发布在这里。',
          statusBody: '未来文章将作为 GitHub Pages 静态页面发布，不再跳转到家里的设备。',
          topicsLabel: '计划栏目',
          topics: ['研究笔记', '工程记录', '阅读笔记'],
        },
        owner: {
          eyebrow: '加密家庭目录',
          title: '主人入口',
          intro: '在不把地址、端口或主机名写入网页源码的情况下，解锁最新的家庭服务目录。',
          status: '浏览器端解密',
          statusTitle: '解锁当前家庭入口',
          statusBody: '密码只在当前浏览器标签页中短暂用于解密最新目录，不会被传输或持久保存。',
          passwordLabel: '个人访问密码',
          passwordPlaceholder: '输入密码',
          unlockAction: '解锁目录',
          unlockPending: '正在解密最新目录…',
          lockAction: '锁定并清除',
          lockedStatus: '目录已锁定；这个页面本身不包含任何家庭地址。',
          unlockedStatus: '目录已在当前浏览器标签页中解锁。',
          errorStatus: '无法解锁目录。请检查密码和网络连接后重试。',
          emptyStatus: '目录有效，但其中没有当前页面支持的服务。',
          servicesLabel: '可用家庭服务',
          updatedLabel: '目录发布时间',
          expiresLabel: '有效期至',
          openAction: '打开服务',
          scriptRequired: '需要启用 JavaScript 才能解锁这个加密目录。',
          resetHint: '密码在家庭服务器上修改；下次成功发布后立即生效，无需重新构建个人主页。',
          rulesLabel: '安全边界',
          rules: [
            '公开内容只有加密目录；地址和端口始终位于密文内部。',
            '这只是隐私保护层，不等于服务认证；每个目标仍须保留自己的登录和网络防护。',
            '直接使用 IP 的 HTTPS 可能采用自管理证书；请核对预期证书或安装家庭 CA，不要直接忽略浏览器警告。',
            '公开密文可以被离线猜测，请使用独立长密码并尽快轮换初始密码。',
          ],
        },
      },
    },
  },

  // ─── Theme defaults ───────────────────────────────────────────────────────

  theme: {
    /**
     * Default color theme.
     * 'system' follows OS preference.
     */
    default: 'system' as 'light' | 'dark' | 'system',

    /**
     * Primary accent color used for links, active nav items, badges, and highlights.
     * Accepts any CSS color string (hex, hsl, rgb, etc.).
     * Set to 'auto' to use the built-in defaults (purple in light mode, cyan in dark mode).
     *
     * Example presets:
     *   Purple (default): { light: '#b509ac', dark: '#2698ba' }
     *   Blue:             { light: '#0076df', dark: '#68c0d9' }
     *   Red:              { light: '#ff3636', dark: '#f29105' }
     *   Green:            { light: '#009f06', dark: '#b7d12a' }
     *   Orange:           { light: '#f29105', dark: '#efcc00' }
     */
    color: {
      light: '#0f766e' as string,
      dark: '#5eead4' as string,
    },
  },
} as const;

export type SiteConfig = typeof site;
