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
    researchgate_username: 'Yuhang-Shen-5',
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
            { label: 'play', href: '/games/' },
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
            { label: '试玩', href: '/zh/games/' },
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
      eyebrow: 'Physical-layer security · Resilient wireless intelligence',
      name: 'Yuhang Shen',
      role: 'PhD Student in Electrical and Computer Engineering',
      institution: 'Khalifa University',
      location: 'Abu Dhabi, United Arab Emirates',
      intro:
        'I am a PhD researcher in electrical and computer engineering at Khalifa University. My work focuses on physical-layer security and resilient learning-enabled wireless systems for energy-constrained IoT and IoE, building on earlier research in edge and fog computing, online optimization, and signal analysis.',
      primaryAction: { label: 'Explore my research', href: '/research/' },
      secondaryAction: { label: 'View GitHub', href: 'https://github.com/coolmoon327' },
      profileLabel: 'Profile',
      researchLabel: 'Current research',
      researchIntro:
        'I study how future wireless systems can remain secure and dependable under tight energy, sensing, and decision constraints. Selected accepted and published results are listed below.',
      researchAction: 'View research profile',
      research: [
        'Physical-layer security for energy-constrained wireless systems',
        'Resilient learning-enabled communications under adversarial interference',
        'Wireless optimization, resource allocation, and online decision-making',
        'Edge and fog systems, with foundations in nonlinear signal analysis',
      ],
      publicationsLabel: 'Recent accepted & published work',
      publicationsAction: 'Open publication',
      publicationsPending: 'Proceedings link pending',
      publications: [
        {
          year: '2026',
          title:
            'Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks',
          type: 'IEEE JSAC · Early Access',
          description:
            'Examines adversarial pressure on AI-enabled anti-jamming systems and the need for more resilient learning-based wireless designs.',
          href: 'https://ieeexplore.ieee.org/document/11551582/',
          featured: true,
        },
        {
          year: '2026',
          title: 'Robust DRL-Based Anti-Jamming Under Adversarial State Manipulation Attacks',
          type: 'IEEE ICMLCN · Accepted',
          description:
            'Studies robust learning-based anti-jamming when wireless observations can be manipulated by an adversary.',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Semantic Prediction Driven Resilience in SAGSIN Scenario under Adversarial Jamming',
          type: 'IEEE ICMLCN · Accepted',
          description:
            'Studies resilient semantic communications for integrated aerial and non-terrestrial networks under adversarial interference.',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks',
          type: 'arXiv preprint',
          description:
            'Revisits online scheduling for joint wireless-power transfer and computation offloading with an energy-efficiency focus.',
          href: 'https://arxiv.org/abs/2603.07984',
          featured: false,
        },
        {
          year: '2024',
          title:
            'Deep Reinforcement Learning-Based Social Welfare Maximization for Collaborative Edge Computing',
          type: 'IEEE iWRF&AT',
          description:
            'Uses deep reinforcement learning to study social-welfare-oriented resource allocation across collaborating edge servers.',
          href: 'https://doi.org/10.1109/iWRFAT61200.2024.10594571',
          featured: false,
        },
        {
          year: '2024',
          title:
            'ES-ATF: Early Smoke Detection based on Attention-aggregated Temporal Feature Extraction',
          type: 'IEEE ICEET',
          description:
            'Contributes to an attention-based temporal model for detecting smoke at an earlier stage.',
          href: 'https://doi.org/10.1109/ICEET65156.2024.10913544',
          featured: false,
        },
        {
          year: '2022',
          title:
            'An online auction-based incentive mechanism for soft-deadline tasks in Collaborative Edge Computing',
          type: 'Future Generation Computer Systems',
          description:
            'Designs an online auction mechanism that supports incentive-aware cooperation among edge-service providers.',
          href: 'https://doi.org/10.1016/j.future.2022.07.001',
          featured: false,
        },
        {
          year: '2022',
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          type: 'IEEE WCNC',
          description:
            'Develops an online scheduling formulation for energy-aware computation offloading in wireless-powered edge networks.',
          href: 'https://doi.org/10.1109/WCNC51071.2022.9771592',
          featured: false,
        },
        {
          year: '2022',
          title:
            'A nonlinear wave coupling algorithm and its programing and application in plasma turbulences',
          type: 'Chinese Physics B',
          description:
            'Extends nonlinear wave-coupling analysis toward applications in plasma turbulence.',
          href: 'https://doi.org/10.1088/1674-1056/ac4233',
          featured: false,
        },
        {
          year: '2020',
          title: 'An improved method for bispectral analysis of nonlinear wave interaction system',
          type: 'Physica Scripta',
          description:
            'Introduces and evaluates an iterative bispectral method for identifying nonlinear wave interactions.',
          href: 'https://doi.org/10.1088/1402-4896/ab725f',
          featured: false,
        },
        {
          year: '2020',
          title:
            'Performance of the Algorithms for Bispectral Analysis on Turbulence and Their Application in Edge Plasmas',
          type: 'Journal of the Physical Society of Japan',
          description:
            'Compares bispectral-analysis algorithms and applies them to nonlinear interactions in edge-plasma turbulence.',
          href: 'https://doi.org/10.7566/JPSJ.89.044501',
          featured: false,
        },
      ],
      projectsLabel: 'Research programs & systems',
      projectsAction: 'Open work',
      projects: [
        {
          title: 'Secure and resilient wireless systems',
          meta: 'Current doctoral research portfolio',
          description:
            'Physical-layer security and resilient learning-enabled communications for energy-constrained wireless systems. Public output includes a JSAC Early Access article and two ICMLCN acceptances.',
          href: '/research/',
          featured: true,
        },
        {
          title: 'OpenRaaS and FogCom',
          meta: 'M.Eng. research · systems and learning',
          description:
            'A connected research line on exposing heterogeneous compute and storage resources as cooperative services, with OpenRaaS as the system foundation and FogCom as the experimental scheduling environment.',
          href: '/research/openraas-thesis/',
          featured: true,
        },
        {
          title: 'Collaborative and wireless-powered edge computing',
          meta: 'Mechanism design · online optimization',
          description:
            'A continuing line spanning incentives, social-welfare-aware resource allocation, and energy-aware online scheduling in collaborative edge systems.',
          href: '/publications/',
          featured: true,
        },
        {
          title: 'Nonlinear signal analysis for wave interactions',
          meta: 'First-author research · spectral methods',
          description:
            'Algorithmic bispectral analysis for nonlinear wave coupling and plasma turbulence, reflected in two first-author journal papers and subsequent collaborative work.',
          href: '/publications/',
          featured: true,
        },
        {
          title: 'Adaptive antenna control for 5G',
          meta: 'B.Eng. thesis · operator collaboration',
          description:
            'An undergraduate research project on reinforcement-learning-based control of 5G base-station antenna feeds, grounded in an operator-side network-optimization placement.',
          href: '/research/',
          featured: false,
        },
        {
          title: 'Embedded vision and robotic tracking',
          meta: 'Award-winning collaborative engineering system',
          description:
            'A HiSilicon and OpenHarmony prototype combining visual tracking, edge offloading, and robotic control; recognized with a national first prize in an embedded systems competition.',
          href: 'https://zobinhuang.github.io/sec_about/project_socchina/report.pdf',
          featured: false,
        },
      ],
      linksLabel: 'Profiles & links',
      links: [
        { label: 'ORCID', href: 'https://orcid.org/0000-0002-3358-3463' },
        { label: 'GitHub', href: 'https://github.com/coolmoon327' },
        {
          label: 'Google Scholar',
          href: 'https://scholar.google.com/citations?user=JNrwfFQAAAAJ',
        },
        {
          label: 'ResearchGate',
          href: 'https://www.researchgate.net/profile/Yuhang-Shen-5',
        },
        { label: 'Zobin · friend link', href: 'https://zobinhuang.github.io/' },
      ],
    },
    zh: {
      eyebrow: '物理层安全 · 韧性无线智能',
      name: '沈煜航',
      role: '电气与计算机工程博士研究生',
      institution: '哈利法大学',
      location: '阿联酋阿布扎比',
      intro:
        '我目前在哈利法大学攻读电气与计算机工程博士，研究面向能量受限 IoT 与 IoE 的物理层安全和具有韧性的学习型无线系统，并延续此前在边缘与雾计算、在线优化和信号分析方面的工作。',
      primaryAction: { label: '查看研究概况', href: '/zh/research/' },
      secondaryAction: { label: '访问 GitHub', href: 'https://github.com/coolmoon327' },
      profileLabel: '个人资料',
      researchLabel: '当前研究',
      researchIntro:
        '我关注未来无线系统如何在能源、感知与决策能力受限时仍保持安全和可靠。下方列出部分已接收与已发表成果。',
      researchAction: '查看研究概况',
      research: [
        '面向能量受限无线系统的物理层安全',
        '对抗性干扰下具有韧性的学习型通信',
        '无线优化、资源分配与在线决策',
        '边缘与雾计算，以及非线性信号分析基础',
      ],
      publicationsLabel: '近期已接收与已发表工作',
      publicationsAction: '打开论文',
      publicationsPending: '会议录链接待发布',
      publications: [
        {
          year: '2026',
          title:
            'Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks',
          type: 'IEEE JSAC · Early Access',
          description:
            '研究 AI 抗干扰系统在对抗性环境中的韧性，并强调学习型无线设计需要更稳健的安全保障。',
          href: 'https://ieeexplore.ieee.org/document/11551582/',
          featured: true,
        },
        {
          year: '2026',
          title: 'Robust DRL-Based Anti-Jamming Under Adversarial State Manipulation Attacks',
          type: 'IEEE ICMLCN · 已接收',
          description: '研究无线观测可能被对手操控时，学习型抗干扰方法的稳健性。',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Semantic Prediction Driven Resilience in SAGSIN Scenario under Adversarial Jamming',
          type: 'IEEE ICMLCN · 已接收',
          description: '研究对抗性干扰下空中与非地面融合网络中的韧性语义通信。',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks',
          type: 'arXiv 预印本',
          description: '从能效角度重新研究无线供能与计算卸载联合决策中的在线调度。',
          href: 'https://arxiv.org/abs/2603.07984',
          featured: false,
        },
        {
          year: '2024',
          title:
            'Deep Reinforcement Learning-Based Social Welfare Maximization for Collaborative Edge Computing',
          type: 'IEEE iWRF&AT',
          description: '利用深度强化学习研究协同边缘服务器之间面向社会福利的资源分配。',
          href: 'https://doi.org/10.1109/iWRFAT61200.2024.10594571',
          featured: false,
        },
        {
          year: '2024',
          title:
            'ES-ATF: Early Smoke Detection based on Attention-aggregated Temporal Feature Extraction',
          type: 'IEEE ICEET',
          description: '参与基于注意力聚合时序特征的早期烟雾检测研究。',
          href: 'https://doi.org/10.1109/ICEET65156.2024.10913544',
          featured: false,
        },
        {
          year: '2022',
          title:
            'An online auction-based incentive mechanism for soft-deadline tasks in Collaborative Edge Computing',
          type: 'Future Generation Computer Systems',
          description: '设计支持多边缘服务提供方协作的在线拍卖激励机制。',
          href: 'https://doi.org/10.1016/j.future.2022.07.001',
          featured: false,
        },
        {
          year: '2022',
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          type: 'IEEE WCNC',
          description: '面向无线供能边缘网络中的计算卸载，研究能耗感知的在线调度。',
          href: 'https://doi.org/10.1109/WCNC51071.2022.9771592',
          featured: false,
        },
        {
          year: '2022',
          title:
            'A nonlinear wave coupling algorithm and its programing and application in plasma turbulences',
          type: 'Chinese Physics B',
          description: '将非线性波耦合分析进一步用于等离子体湍流研究。',
          href: 'https://doi.org/10.1088/1674-1056/ac4233',
          featured: false,
        },
        {
          year: '2020',
          title: 'An improved method for bispectral analysis of nonlinear wave interaction system',
          type: 'Physica Scripta',
          description: '提出并验证用于识别非线性波相互作用的迭代双谱分析方法。',
          href: 'https://doi.org/10.1088/1402-4896/ab725f',
          featured: false,
        },
        {
          year: '2020',
          title:
            'Performance of the Algorithms for Bispectral Analysis on Turbulence and Their Application in Edge Plasmas',
          type: 'Journal of the Physical Society of Japan',
          description: '比较双谱分析算法，并将其用于边缘等离子体湍流中的非线性相互作用。',
          href: 'https://doi.org/10.7566/JPSJ.89.044501',
          featured: false,
        },
      ],
      projectsLabel: '研究方向与系统',
      projectsAction: '打开项目',
      projects: [
        {
          title: '安全且具有韧性的无线系统',
          meta: '当前博士研究组合',
          description:
            '面向能量受限无线系统的物理层安全与学习型韧性通信。公开成果包括一篇 JSAC Early Access 论文和两篇 ICMLCN 已接收论文。',
          href: '/zh/research/',
          featured: true,
        },
        {
          title: 'OpenRaaS 与 FogCom',
          meta: '硕士研究 · 系统与学习',
          description:
            '围绕异构计算与存储资源如何形成协作服务的一条完整研究线：OpenRaaS 提供系统基础，FogCom 提供调度问题的实验环境。',
          href: '/zh/research/openraas-thesis/',
          featured: true,
        },
        {
          title: '协同与无线供能边缘计算',
          meta: '机制设计 · 在线优化',
          description:
            '持续研究协同边缘系统中的激励机制、面向社会福利的资源分配，以及能耗感知的在线调度。',
          href: '/zh/publications/',
          featured: true,
        },
        {
          title: '波相互作用的非线性信号分析',
          meta: '第一作者研究 · 频谱方法',
          description:
            '面向非线性波耦合与等离子体湍流的算法化双谱分析，形成两篇第一作者期刊论文及后续合作成果。',
          href: '/zh/publications/',
          featured: true,
        },
        {
          title: '5G 自适应天馈控制',
          meta: '本科论文 · 运营商合作',
          description: '基于运营商网络优化实践，研究利用强化学习控制 5G 基站天馈系统。',
          href: '/zh/research/',
          featured: false,
        },
        {
          title: '嵌入式视觉与机器人追踪',
          meta: '获奖合作工程系统',
          description:
            '基于海思与 OpenHarmony 的原型，融合视觉追踪、边缘卸载与机器人控制，并获嵌入式系统赛事全国一等奖。',
          href: 'https://zobinhuang.github.io/sec_about/project_socchina/report.pdf',
          featured: false,
        },
      ],
      linksLabel: '主页与友链',
      links: [
        { label: 'ORCID', href: 'https://orcid.org/0000-0002-3358-3463' },
        { label: 'GitHub', href: 'https://github.com/coolmoon327' },
        {
          label: 'Google Scholar',
          href: 'https://scholar.google.com/citations?user=JNrwfFQAAAAJ',
        },
        {
          label: 'ResearchGate',
          href: 'https://www.researchgate.net/profile/Yuhang-Shen-5',
        },
        { label: 'Zobin · 友链', href: 'https://zobinhuang.github.io/' },
      ],
    },
  },

  // ─── Research overview ─────────────────────────────────────────────────

  research: {
    en: {
      eyebrow: 'Research profile',
      title: 'Research',
      intro:
        'My work connects secure wireless communications with learning-based optimization. The broader trajectory runs from nonlinear signal analysis and cooperative edge systems to physical-layer security for energy-constrained wireless networks.',
      currentLabel: 'Current doctoral research',
      currentTitle: 'Physical-layer security for zero-energy 6G IoT and IoE systems',
      currentBody:
        'My doctoral research studies secure and resilient transmission for future wireless systems, with particular interest in learning-enabled decision making under practical constraints. The dissertation title below is the official working title recorded by the program; public descriptions intentionally remain at the research-problem level.',
      programLabel: 'Program',
      program: 'PhD in Engineering — Electrical & Computer Engineering',
      dissertationLabel: 'Dissertation',
      dissertation: 'PHYSICAL LAYER SECURITY ON ZERO ENERGY 6G IOT AND IOE SYSTEMS',
      studyModeLabel: 'Study mode',
      studyMode: 'Full time',
      advisorsLabel: 'Advisory team',
      advisors: [
        {
          role: 'Main advisor',
          name: 'Paschalis Sofotasios',
          href: 'https://khazna.ku.ac.ae/en/persons/paschalis-sofotasios-7/',
        },
        {
          role: 'Co-advisor',
          name: 'Sami Muhaidat',
          href: 'https://scholar.google.com/citations?user=UDXNqUgAAAAJ&hl=en',
        },
        {
          role: 'External co-advisor',
          name: 'Zhiguo Ding',
          href: 'https://scholar.google.com/citations?user=V-nB8scAAAAJ&hl=en',
        },
      ],
      publicStatusLabel: 'Public record',
      publicStatus:
        'The public record includes an IEEE JSAC Early Access article and two papers accepted at IEEE ICMLCN 2026. Several additional physical-layer-security collaborations are under review and are summarized only at the theme level.',
      trajectoryLabel: 'Research trajectory',
      trajectoryIntro:
        'The progression from systems and resource cooperation to secure wireless optimization is part of one continuous research story.',
      stages: [
        {
          marker: 'Now',
          title: 'Secure and resilient wireless intelligence',
          body: 'Physical-layer security and dependable learning-enabled communications for energy-constrained IoT and IoE systems under adversarial interference.',
          links: [{ label: 'Publications', href: '/publications/' }],
        },
        {
          marker: 'M.Eng.',
          title: 'Open Resource-as-a-Service and collaborative fog computing',
          body: 'A systems-and-decision track on exposing heterogeneous compute and storage resources as cooperative services. OpenRaaS provides the system foundation, while FogCom provides an experimental scheduling environment.',
          links: [
            { label: 'Master’s thesis', href: '/research/openraas-thesis/' },
            { label: 'OpenRaaS', href: 'https://github.com/zobinHuang/OpenRaaS' },
            { label: 'FogCom', href: 'https://github.com/coolmoon327/FogCom' },
          ],
        },
        {
          marker: '2021–26',
          title: 'Collaborative and wireless-powered edge computing',
          body: 'Research on incentive mechanisms, social-welfare-aware allocation, and online energy management for cooperative and wireless-powered edge systems.',
          links: [{ label: 'Related publications', href: '/publications/' }],
        },
        {
          marker: '2020–22',
          title: 'Nonlinear signal analysis and plasma turbulence',
          body: 'First-author work on bispectral methods for nonlinear wave coupling, followed by collaborative applications to plasma-turbulence analysis.',
          links: [{ label: 'Related publications', href: '/publications/' }],
        },
        {
          marker: 'B.Eng.',
          title: '5G control and embedded intelligent systems',
          body: 'The undergraduate thesis studied adaptive antenna-feed control for 5G base stations, alongside collaborative work on embedded vision, edge offloading, and robotic tracking.',
          links: [{ label: 'Projects', href: '/projects/' }],
        },
      ],
      profileLabel: 'Background & recognition',
      profileIntro:
        'Education, research experience, and selected recognition supporting the trajectory above.',
      profileGroups: [
        {
          title: 'Education',
          items: [
            'PhD in Engineering — Electrical & Computer Engineering, Khalifa University (current)',
            'M.Eng. in Network Engineering, UESTC (2024)',
            'B.Eng. in Internet of Things Engineering and B.A. in Finance, UESTC (2021)',
            'Graduate exchange in Computer Science, Khalifa University (Spring 2024)',
          ],
        },
        {
          title: 'Experience',
          items: [
            'Teaching assistant for Reinforcement Learning at UESTC (2022)',
            'Network-optimization placement with China Telecom, contributing to adaptive 5G antenna-control research',
            'Research and engineering collaborations spanning wireless systems, edge computing, signal analysis, and embedded AI',
          ],
        },
        {
          title: 'Selected recognition',
          items: [
            'First-Class University Scholarship in every academic year at UESTC',
            'National Scholarship, awarded three times: twice during undergraduate study and once during master’s study',
            'IEEE iWRF&AT 2024 Best Paper Award',
            'National First Prize, National Embedded Chip and System Design Competition (2022)',
            'Sichuan Province Outstanding Graduate',
          ],
        },
      ],
    },
    zh: {
      eyebrow: '研究概况',
      title: '研究',
      intro:
        '我的研究以安全无线通信与学习驱动的优化为主线，整体脉络从非线性信号分析与协同边缘系统，延伸到面向能量受限无线网络的物理层安全。',
      currentLabel: '当前博士研究',
      currentTitle: '面向零能耗 6G 物联网与万物互联的物理层安全',
      currentBody:
        '博士阶段主要研究未来无线系统中的安全与韧性传输，并关注现实约束下的学习型决策。下方保留培养项目记录的正式论文题目；面向公众的介绍有意停留在研究问题层面。',
      programLabel: '培养项目',
      program: '工程学博士 — 电气与计算机工程',
      dissertationLabel: '博士论文',
      dissertation: 'PHYSICAL LAYER SECURITY ON ZERO ENERGY 6G IOT AND IOE SYSTEMS',
      studyModeLabel: '学习方式',
      studyMode: '全日制',
      advisorsLabel: '指导团队',
      advisors: [
        {
          role: '主导师',
          name: 'Paschalis Sofotasios',
          href: 'https://khazna.ku.ac.ae/en/persons/paschalis-sofotasios-7/',
        },
        {
          role: '联合导师',
          name: 'Sami Muhaidat',
          href: 'https://scholar.google.com/citations?user=UDXNqUgAAAAJ&hl=en',
        },
        {
          role: '校外联合导师',
          name: 'Zhiguo Ding',
          href: 'https://scholar.google.com/citations?user=V-nB8scAAAAJ&hl=en',
        },
      ],
      publicStatusLabel: '公开状态',
      publicStatus:
        '当前公开记录包括一篇 IEEE JSAC Early Access 论文和两篇 IEEE ICMLCN 2026 已接收论文；另有多项物理层安全合作正在审稿，仅在研究主题层面作概括。',
      trajectoryLabel: '研究脉络',
      trajectoryIntro: '从系统与资源协作到安全无线优化，这些工作构成了一条连续的研究路径。',
      stages: [
        {
          marker: '当前',
          title: '安全且具有韧性的无线智能',
          body: '面向能量受限 IoT 与 IoE 系统，研究对抗性干扰下的物理层安全与可靠的学习型通信。',
          links: [{ label: '公开论文', href: '/zh/publications/' }],
        },
        {
          marker: '硕士',
          title: '开放资源即服务与协同雾计算',
          body: '围绕异构计算与存储资源如何形成协作服务开展系统与决策研究：OpenRaaS 提供系统基础，FogCom 提供调度问题的实验环境。',
          links: [
            { label: '硕士论文', href: '/zh/research/openraas-thesis/' },
            { label: 'OpenRaaS', href: 'https://github.com/zobinHuang/OpenRaaS' },
            { label: 'FogCom', href: 'https://github.com/coolmoon327/FogCom' },
          ],
        },
        {
          marker: '2021–26',
          title: '协同与无线供能边缘计算',
          body: '研究协作边缘系统中的激励机制、面向社会福利的资源分配，以及无线供能条件下的在线能量管理。',
          links: [{ label: '相关论文', href: '/zh/publications/' }],
        },
        {
          marker: '2020–22',
          title: '非线性信号分析与等离子体湍流',
          body: '以第一作者身份研究非线性波耦合的双谱分析方法，并参与其在等离子体湍流分析中的后续应用。',
          links: [{ label: '相关论文', href: '/zh/publications/' }],
        },
        {
          marker: '本科',
          title: '5G 控制与嵌入式智能系统',
          body: '本科论文研究 5G 基站自适应天馈控制，并参与融合嵌入式视觉、边缘卸载与机器人追踪的合作工程系统。',
          links: [{ label: '项目页面', href: '/zh/projects/' }],
        },
      ],
      profileLabel: '学术背景与代表性荣誉',
      profileIntro: '以下简要列出支持上述研究脉络的教育背景、研究经历与代表性荣誉。',
      profileGroups: [
        {
          title: '教育经历',
          items: [
            '哈利法大学工程学博士（电气与计算机工程，在读）',
            '电子科技大学网络工程硕士（2024）',
            '电子科技大学物联网工程学士、金融学文学学士（2021）',
            '哈利法大学计算机科学研究生交换（2024 年春季）',
          ],
        },
        {
          title: '经历',
          items: [
            '电子科技大学强化学习课程助教（2022）',
            '中国电信网络优化实践，并参与 5G 自适应天馈控制研究',
            '持续参与无线系统、边缘计算、信号分析与嵌入式智能方面的研究合作',
          ],
        },
        {
          title: '代表性荣誉',
          items: [
            '在电子科技大学就读期间，每个学年均获一等奖学金',
            '三次国家奖学金：本科阶段两次，硕士阶段一次',
            'IEEE iWRF&AT 2024 最佳论文奖',
            '全国大学生嵌入式芯片与系统设计竞赛全国一等奖（2022）',
            '四川省优秀毕业生',
          ],
        },
      ],
    },
  },

  // ─── Pocket game lab ────────────────────────────────────────────────────

  playground: {
    en: {
      eyebrow: 'Interactive prototypes',
      title: 'Pocket game lab',
      intro:
        'Five dependency-free games are shown here at their intended embedded sizes. Try them before we decide whether any belongs inside the academic homepage.',
      boundaryLabel: 'Demo boundary',
      boundary:
        'This gallery is separate from the academic record, and every placement note is a hypothesis rather than a final design decision.',
      interfaceNote:
        'The games currently retain their original Chinese prototype controls. Any selected game will receive full English localization and a final visual pass before permanent placement.',
      scoreNote:
        'Scores are session-only inside the isolated previews. Open a game directly if you want its browser-local best score to persist.',
      sessionLabel: 'Typical session',
      placementLabel: 'Placement hypothesis',
      openAction: 'Open full game',
      iframeTitleSuffix: 'interactive game demo',
      galleryLabel: 'Five pocket game prototypes',
      games: [
        {
          id: 'orbit',
          title: 'Orbit Alignment',
          nativeTitle: '月轨校准',
          kind: 'Micro interaction',
          session: '10–20 seconds',
          height: 360,
          description:
            'Start the orbit, then stop the moon inside a moving target window. A second click or the Space key completes one attempt.',
          placement:
            'A possible compact break between Research and Selected Work, provided it remains visually quiet.',
        },
        {
          id: 'signature',
          title: 'Stardust Signature',
          nativeTitle: '星屑签名',
          kind: 'Micro canvas',
          session: '5–30 seconds',
          height: 260,
          description:
            'Place seven stars to create a small constellation and a short closing line. It works with pointer, touch, Enter, or Space.',
          placement:
            'The strongest homepage candidate: a low-pressure interaction near the end of About or just before the footer.',
        },
        {
          id: 'echo',
          title: 'Memory Echo',
          nativeTitle: '记忆回声',
          kind: 'Short memory game',
          session: '30 seconds–3 minutes',
          height: 430,
          description:
            'Watch a four-pad sequence and reproduce it as the pattern grows, using pointer, touch, or number keys 1–4.',
          placement:
            'Better suited to this Playground or the end of a blog post than to the main academic landing page.',
        },
        {
          id: 'match',
          title: 'Memory Garden',
          nativeTitle: '翻牌花园',
          kind: 'Session game',
          session: '1–4 minutes',
          height: 590,
          description:
            'A keyboard-friendly 4×4 matching board with eight hidden pairs, move tracking, and a local best score when opened directly.',
          placement:
            'A dedicated play or reading-break page; the board is too tall for the homepage flow.',
        },
        {
          id: 'merge',
          title: 'Merge Garden',
          nativeTitle: '方块花园',
          kind: 'Session game',
          session: '3–10 minutes',
          height: 680,
          description:
            'A compact 4×4 merge game that grows seeds into research artifacts through buttons or arrow-key controls.',
          placement:
            'Keep on the Playground or a dedicated route; it is the longest and tallest experience in the set.',
        },
      ],
    },
    zh: {
      eyebrow: '互动原型',
      title: '小游戏实验室',
      intro:
        '这里按照预期嵌入尺寸集中展示五个零依赖小游戏。先实际试玩，再决定是否有作品适合进入学术主页及其具体位置。',
      boundaryLabel: 'Demo 边界',
      boundary: '本页与学术内容分开；每条放置建议都只是测试假设，不代表最终设计。',
      interfaceNote:
        '游戏本体暂时保留原型中文文案。最终选中的作品会在固定嵌入前再统一中英文界面与视觉细节。',
      scoreNote: '隔离预览中的成绩只在本次会话有效；直接打开游戏后可保留浏览器本地最佳成绩。',
      sessionLabel: '典型时长',
      placementLabel: '放置假设',
      openAction: '单独打开',
      iframeTitleSuffix: '互动游戏 Demo',
      galleryLabel: '五个口袋小游戏原型',
      games: [
        {
          id: 'orbit',
          title: '月轨校准',
          nativeTitle: 'Orbit Alignment',
          kind: '微交互',
          session: '10–20 秒',
          height: 360,
          description:
            '启动月球轨道，再用第二次点击或空格键让它停进移动的发光窗口，完成一次短促的校准挑战。',
          placement: '可尝试放在首页 Research 与 Selected Work 之间，但前提是视觉上足够安静。',
        },
        {
          id: 'signature',
          title: '星屑签名',
          nativeTitle: 'Stardust Signature',
          kind: '微型画布',
          session: '5–30 秒',
          height: 260,
          description:
            '放置七颗星，生成一幅小型星座和一句收尾签语；支持鼠标、触屏、Enter 与空格键。',
          placement: '最适合首页的候选：可放在 About 尾部或 footer 之前，干扰最小。',
        },
        {
          id: 'echo',
          title: '记忆回声',
          nativeTitle: 'Memory Echo',
          kind: '短时记忆游戏',
          session: '30 秒–3 分钟',
          height: 430,
          description: '观察四色按钮的亮起顺序，再用点击、触屏或数字键 1–4 复现逐渐增长的序列。',
          placement: '更适合保留在 Playground，或作为博客文章末尾的休息区，不建议进入主页正文。',
        },
        {
          id: 'match',
          title: '翻牌花园',
          nativeTitle: 'Memory Garden',
          kind: '完整小游戏',
          session: '1–4 分钟',
          height: 590,
          description:
            '一个支持键盘的 4×4 翻牌棋盘，共八对图案；记录步数，单独打开时还会保存本地最佳成绩。',
          placement: '适合独立试玩或阅读休息页；棋盘高度不适合打断主页浏览节奏。',
        },
        {
          id: 'merge',
          title: '方块花园',
          nativeTitle: 'Merge Garden',
          kind: '完整小游戏',
          session: '3–10 分钟',
          height: 680,
          description: '通过按钮或方向键，在紧凑的 4×4 棋盘中把种子逐步合成为科研成果。',
          placement: '保留在 Playground 或独立路由；它是本组耗时最长、页面最高的游戏。',
        },
      ],
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
          eyebrow: 'Selected published & accepted record',
          title: 'Publications',
          intro:
            'A broad selection of published papers, Early Access articles, accepted conference papers, and stable public manuscripts, ordered by year. Accepted entries without proceedings links are marked accordingly.',
          status: 'Publication status',
          statusTitle: 'Every entry reflects its current public status.',
          statusBody:
            'Links appear only when a stable public record or proceedings page is available.',
        },
        projects: {
          eyebrow: 'Research programs & systems',
          title: 'Projects',
          intro:
            'Research programs, systems, and selected engineering work—organized by intellectual trajectory rather than by repository count.',
          status: 'Curated by research value',
          statusTitle: 'A project is more than a repository card.',
          statusBody:
            'The entries below connect research questions, papers, systems, and public artifacts. Ongoing doctoral code is included only when it is ready for public release.',
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
          eyebrow: '精选已发表与已接收记录',
          title: '论文',
          intro:
            '按年份列出较全面的已发表论文、Early Access 论文、已接收会议论文与具有稳定公开版本的稿件；尚无会议录链接的条目会明确标注。',
          status: '发表状态',
          statusTitle: '每个条目均按当前公开状态标注。',
          statusBody: '仅在稳定公开记录或会议录页面可用时提供链接。',
        },
        projects: {
          eyebrow: '研究方向与系统',
          title: '项目',
          intro: '按照研究脉络组织研究方向、系统与精选工程成果，而不是按代码库数量罗列。',
          status: '按研究价值策展',
          statusTitle: '项目不等于一张代码库卡片。',
          statusBody:
            '下方条目把研究问题、论文、系统与公开材料串联起来；博士阶段代码仅在适合公开时纳入。',
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
