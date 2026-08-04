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
            { label: 'blog', href: '/blog/' },
            {
              label: 'more',
              children: [
                { label: 'playground', href: '/playground/' },
                { label: 'owner', href: '/owner/' },
              ],
            },
          ] as NavItem[],
        },
      },
      zh: {
        lang: 'zh-CN',
        homeHref: '/zh/',
        switchLabel: 'English',
        skipLink: '跳转到正文',
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
            {
              label: '更多',
              children: [
                { label: '小游戏', href: '/zh/playground/' },
                { label: '专属入口', href: '/zh/owner/' },
              ],
            },
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
        lastUpdatedLabel: '更新于',
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
      inlineGame: {
        game: 'orbit',
        eyebrow: 'Interactive aside · Link acquisition',
        title: 'Catch a signal between sections',
        body: 'Start an orbital pass and lock the satellite inside the acquisition window. Two clicks turn a short reading pause into a live sketch of timing in wireless link acquisition.',
        collectionLabel: 'Explore the full playground',
        fallbackLabel: 'This game needs a little more screen width to remain comfortably playable.',
      },
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
      eyebrow: '物理层安全 · 智能抗干扰通信',
      name: '沈煜航',
      role: '电气与计算机工程博士研究生',
      institution: '哈利法大学',
      location: '阿联酋阿布扎比',
      intro:
        '我现为哈利法大学电气与计算机工程博士生，主要研究面向能量受限物联网（IoT）与万物互联（IoE）的物理层安全、智能抗干扰和无线系统优化。此前的工作涉及边缘与雾计算、在线优化及非线性信号分析。',
      primaryAction: { label: '查看研究概况', href: '/zh/research/' },
      secondaryAction: { label: '访问 GitHub', href: 'https://github.com/coolmoon327' },
      profileLabel: '个人简介',
      researchLabel: '研究方向',
      researchIntro:
        '我关注能源、感知与决策资源均受限时，如何实现安全可靠的无线通信。以下列出部分已发表或已录用成果。',
      researchAction: '查看研究概况',
      research: [
        '能量受限无线系统的物理层安全',
        '面向对抗干扰的智能通信与稳健决策',
        '无线资源优化、分配与在线决策',
        '边缘与雾计算及非线性信号分析',
      ],
      inlineGame: {
        game: 'orbit',
        eyebrow: '交互旁注 · 链路捕获',
        title: '趁阅读间隙，捕获一次链路',
        body: '启动一次卫星过站，再在捕获窗口内完成锁定。只需两次点击，就能通过一个小小的动态实验感受无线链路建立中的时机判断。',
        collectionLabel: '前往小游戏实验室',
        fallbackLabel: '为了保证操作空间，这个游戏需要稍宽一些的屏幕。',
      },
      publicationsLabel: '近期发表与录用论文',
      publicationsAction: '查看论文',
      publicationsPending: '会议论文集链接尚未发布',
      publications: [
        {
          year: '2026',
          title:
            'Outsmarting the Smart: Intelligent Jamming Strategies Against AI-Empowered Anti-Jamming Frameworks',
          type: 'IEEE JSAC · Early Access',
          description:
            '分析智能干扰对人工智能赋能的抗干扰系统构成的威胁，并探讨如何提升学习驱动无线系统的韧性。',
          href: 'https://ieeexplore.ieee.org/document/11551582/',
          featured: true,
        },
        {
          year: '2026',
          title: 'Robust DRL-Based Anti-Jamming Under Adversarial State Manipulation Attacks',
          type: 'IEEE ICMLCN · 已录用',
          description: '研究无线状态观测遭到对手篡改时，如何提高深度强化学习抗干扰策略的鲁棒性。',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Semantic Prediction Driven Resilience in SAGSIN Scenario under Adversarial Jamming',
          type: 'IEEE ICMLCN · 已录用',
          description: '面向对抗性干扰，研究空天地海一体化网络中的语义预测与韧性通信。',
          href: '',
          featured: true,
        },
        {
          year: '2026',
          title:
            'Energy-Efficient Online Scheduling for Wireless Powered Mobile Edge Computing Networks',
          type: 'arXiv 预印本',
          description: '面向无线供能移动边缘计算，研究兼顾能效的在线调度与计算卸载。',
          href: 'https://arxiv.org/abs/2603.07984',
          featured: false,
        },
        {
          year: '2024',
          title:
            'Deep Reinforcement Learning-Based Social Welfare Maximization for Collaborative Edge Computing',
          type: 'IEEE iWRF&AT',
          description: '利用深度强化学习优化协同边缘计算中的社会福利与资源分配。',
          href: 'https://doi.org/10.1109/iWRFAT61200.2024.10594571',
          featured: false,
        },
        {
          year: '2024',
          title:
            'ES-ATF: Early Smoke Detection based on Attention-aggregated Temporal Feature Extraction',
          type: 'IEEE ICEET',
          description: '研究基于注意力聚合时序特征提取的早期烟雾检测方法。',
          href: 'https://doi.org/10.1109/ICEET65156.2024.10913544',
          featured: false,
        },
        {
          year: '2022',
          title:
            'An online auction-based incentive mechanism for soft-deadline tasks in Collaborative Edge Computing',
          type: 'Future Generation Computer Systems',
          description: '设计面向软截止期任务的在线拍卖机制，激励多家边缘服务商协同供给资源。',
          href: 'https://doi.org/10.1016/j.future.2022.07.001',
          featured: false,
        },
        {
          year: '2022',
          title:
            'Online Scheduling for Energy Minimization in Wireless Powered Mobile Edge Computing',
          type: 'IEEE WCNC',
          description: '面向无线供能移动边缘计算，研究以能耗最小化为目标的在线调度。',
          href: 'https://doi.org/10.1109/WCNC51071.2022.9771592',
          featured: false,
        },
        {
          year: '2022',
          title:
            'A nonlinear wave coupling algorithm and its programing and application in plasma turbulences',
          type: 'Chinese Physics B',
          description: '将非线性波耦合算法用于等离子体湍流分析。',
          href: 'https://doi.org/10.1088/1674-1056/ac4233',
          featured: false,
        },
        {
          year: '2020',
          title: 'An improved method for bispectral analysis of nonlinear wave interaction system',
          type: 'Physica Scripta',
          description: '提出用于识别非线性波相互作用的改进型迭代双谱分析方法。',
          href: 'https://doi.org/10.1088/1402-4896/ab725f',
          featured: false,
        },
        {
          year: '2020',
          title:
            'Performance of the Algorithms for Bispectral Analysis on Turbulence and Their Application in Edge Plasmas',
          type: 'Journal of the Physical Society of Japan',
          description: '比较多种双谱分析算法，并用于研究边缘等离子体湍流中的非线性相互作用。',
          href: 'https://doi.org/10.7566/JPSJ.89.044501',
          featured: false,
        },
      ],
      projectsLabel: '研究方向与代表性系统',
      projectsAction: '查看详情',
      projects: [
        {
          title: '安全与韧性无线系统',
          meta: '博士阶段研究',
          description:
            '围绕能量受限无线系统，研究物理层安全、智能抗干扰与韧性通信。已公开成果包括一篇 JSAC Early Access 论文和两篇 ICMLCN 录用论文。',
          href: '/zh/research/',
          featured: true,
        },
        {
          title: 'OpenRaaS 与 FogCom',
          meta: '硕士研究 · 系统与学习',
          description:
            '研究如何将分散的异构计算与存储资源组织成协同服务：OpenRaaS 负责系统架构，FogCom 用于验证部分可观测条件下的调度方法。',
          href: '/zh/research/openraas-thesis/',
          featured: true,
        },
        {
          title: '协同边缘计算与无线供能边缘计算',
          meta: '机制设计 · 在线优化',
          description:
            '研究协同边缘系统中的激励机制与社会福利优化，以及无线供能场景下的节能在线调度。',
          href: '/zh/publications/',
          featured: true,
        },
        {
          title: '非线性波相互作用的信号分析',
          meta: '第一作者研究 · 双谱分析',
          description:
            '围绕非线性波耦合与等离子体湍流开展双谱分析研究，形成两篇第一作者期刊论文及后续合作成果。',
          href: '/zh/publications/',
          featured: true,
        },
        {
          title: '5G 基站天线自适应控制',
          meta: '本科论文 · 运营商合作项目',
          description: '结合运营商网络优化实践，研究基于强化学习的 5G 基站天线自适应控制。',
          href: '/zh/research/',
          featured: false,
        },
        {
          title: '嵌入式视觉与机器人跟踪',
          meta: '合作工程项目 · 全国一等奖',
          description:
            '基于海思平台与 OpenHarmony 开发融合视觉跟踪、边缘卸载和机器人控制的原型系统，并获全国大学生嵌入式芯片与系统设计竞赛一等奖。',
          href: 'https://zobinhuang.github.io/sec_about/project_socchina/report.pdf',
          featured: false,
        },
      ],
      linksLabel: '学术主页与链接',
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
        'My doctoral research studies secure and resilient transmission for future wireless systems, with particular interest in learning-enabled decision making under practical constraints.',
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
          href: 'https://www.ku.ac.ae/college-people/paschalis-sofotasios',
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
        'The public record includes an IEEE JSAC Early Access article and two papers accepted at IEEE ICMLCN 2026.',
      inlineGame: {
        game: 'secrecy',
        eyebrow: 'Interactive model · Physical-layer security',
        title: 'Steer the channel, not just the signal',
        body: "Adjust Alice's antenna azimuth and compare Bob's and Eve's achievable rates. Add four-wall multipath, then watch the search maximize instantaneous secrecy rate in a compact two-dimensional model.",
        collectionLabel: 'Explore the full playground',
        fallbackLabel: 'This model needs a little more screen width to keep its controls usable.',
      },
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
      profileLabel: 'Academic background & selected recognition',
      profileIntro:
        'Education and selected recognition spanning doctoral, graduate, and undergraduate study.',
      profileGroups: [
        {
          kind: 'education',
          title: 'Education',
          items: [
            'PhD in Engineering — Electrical & Computer Engineering, Khalifa University (current)',
            'M.Eng. in Information and Communication Engineering, UESTC (2024)',
            'B.Eng. in Internet of Things Engineering and B.Econ. in Finance, UESTC (2021)',
            'Graduate exchange in Computer Science, Khalifa University (Spring 2024)',
          ],
        },
        {
          kind: 'recognition',
          title: 'Selected recognition',
          items: [
            {
              title: 'PhD Research-Path Scholarship',
              detail: 'Annual stipend: AED 240,000',
            },
            {
              title: 'National Scholarship',
              detail:
                'Awarded three times: twice during undergraduate study and once during master’s study.',
            },
            {
              title: 'First-Class University Scholarship',
              detail: 'Awarded in every academic year at UESTC.',
            },
            { title: 'Best Paper Award', detail: 'IEEE iWRF&AT 2024' },
            {
              title: 'National First Prize',
              detail: 'National Embedded Chip and System Design Competition · 2022',
            },
            {
              title: 'Sichuan Province Outstanding Graduate',
              detail: 'Awarded upon undergraduate graduation',
            },
          ],
        },
      ],
    },
    zh: {
      eyebrow: '研究概览',
      title: '研究',
      intro:
        '我的研究以安全无线通信和学习驱动的系统优化为主线：从早期的非线性信号分析和协同边缘计算，逐步延伸到能量受限无线网络中的物理层安全与智能抗干扰。',
      currentLabel: '当前博士研究',
      currentTitle: '面向零能耗 6G 物联网与万物互联的物理层安全',
      currentBody:
        '博士阶段聚焦未来无线系统中的安全传输与抗干扰能力，尤其关注实际约束下的智能决策。',
      programLabel: '学位项目',
      program: '工学博士（电气与计算机工程）',
      dissertationLabel: '博士论文',
      dissertation: 'PHYSICAL LAYER SECURITY ON ZERO ENERGY 6G IOT AND IOE SYSTEMS',
      studyModeLabel: '培养方式',
      studyMode: '全日制',
      advisorsLabel: '导师组',
      advisors: [
        {
          role: '导师',
          name: 'Paschalis Sofotasios',
          href: 'https://www.ku.ac.ae/college-people/paschalis-sofotasios',
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
      publicStatusLabel: '公开成果',
      publicStatus:
        '目前公开成果包括一篇 IEEE JSAC Early Access 论文和两篇 IEEE ICMLCN 2026 录用论文。',
      inlineGame: {
        game: 'secrecy',
        eyebrow: '交互模型 · 物理层安全',
        title: '亲手调整一束保密波束',
        body: '调整 Alice 的天线方位角，比较 Bob 与 Eve 的可达速率；还可以启用四墙多径，再观察自动搜索如何提高简化二维模型中的瞬时保密速率。',
        collectionLabel: '前往小游戏实验室',
        fallbackLabel: '为了保证控制区可用，这个模型需要稍宽一些的屏幕。',
      },
      trajectoryLabel: '研究主线',
      trajectoryIntro: '从异构资源协同到安全无线优化，这些工作沿着同一条研究主线逐步展开。',
      stages: [
        {
          marker: '当前',
          title: '安全可靠的智能无线通信',
          body: '面向能量受限的 IoT 与 IoE 系统，研究对抗干扰下的物理层安全、学习驱动的韧性通信与稳健决策。',
          links: [{ label: '公开论文', href: '/zh/publications/' }],
        },
        {
          marker: '硕士',
          title: '开放资源即服务与协同雾计算',
          body: '研究如何将异构计算与存储资源组织成协同服务：OpenRaaS 提供系统架构，FogCom 用于研究部分可观测条件下的资源调度。',
          links: [
            { label: '硕士论文', href: '/zh/research/openraas-thesis/' },
            { label: 'OpenRaaS', href: 'https://github.com/zobinHuang/OpenRaaS' },
            { label: 'FogCom', href: 'https://github.com/coolmoon327/FogCom' },
          ],
        },
        {
          marker: '2021–26',
          title: '协同边缘计算与无线供能边缘计算',
          body: '研究协同边缘系统中的激励机制与社会福利优化，以及无线供能场景下的在线调度与能耗管理。',
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
          title: '5G 天线控制与嵌入式智能系统',
          body: '本科论文研究 5G 基站天线自适应控制；同期参与融合嵌入式视觉、边缘卸载与机器人跟踪的工程项目。',
          links: [{ label: '项目页面', href: '/zh/projects/' }],
        },
      ],
      profileLabel: '学术背景与代表性荣誉',
      profileIntro: '以下简要列出主要教育背景及求学期间获得的代表性荣誉。',
      profileGroups: [
        {
          kind: 'education',
          title: '教育经历',
          items: [
            '哈利法大学电气与计算机工程博士研究生（在读）',
            '电子科技大学信息与通信工程专业工学硕士（2024）',
            '电子科技大学物联网工程专业工学学士、金融学专业经济学学士（2021）',
            '哈利法大学计算机科学专业研究生交换学习（2024 年春季）',
          ],
        },
        {
          kind: 'recognition',
          title: '代表性荣誉',
          items: [
            {
              title: '博士阶段科研奖学金',
              detail: 'PhD Research-Path Scholarship · 每年津贴 24 万迪拉姆（AED 240,000）',
            },
            {
              title: '国家奖学金',
              detail: '共获三次：本科阶段两次，硕士阶段一次',
            },
            {
              title: '校级一等奖学金',
              detail: '在电子科技大学就读期间，每学年均获一等奖学金',
            },
            { title: '最佳论文奖', detail: 'IEEE iWRF&AT 2024' },
            {
              title: '全国一等奖',
              detail: '全国大学生嵌入式芯片与系统设计竞赛 · 2022',
            },
            { title: '四川省优秀毕业生', detail: '本科毕业时获评' },
          ],
        },
      ],
    },
  },

  // ─── Interactive playground ─────────────────────────────────────────────

  playground: {
    games: [
      {
        id: 'runner',
        category: 'learning',
        height: 360,
        title: { en: 'Reward Runner', zh: '奖励跑酷' },
        meta: { en: 'One-key runner · 20 sec–2 min', zh: '单键跑酷 · 20 秒–2 分钟' },
        description: {
          en: 'Jump through positive rewards and clear penalty blocks as the episode accelerates. One click is the whole policy.',
          zh: '跳过障碍、收集奖励信标；跑道会在每回合逐渐加速，你唯一可执行的动作就是跳跃。',
        },
        tags: {
          en: ['Click / Space', 'Live return', 'Dino-like'],
          zh: ['点击 / 空格', '实时回报', '单键跑酷'],
        },
      },
      {
        id: 'bandit',
        category: 'learning',
        height: 430,
        title: { en: 'Explore–Exploit Lab', zh: '探索与利用' },
        meta: { en: 'Bandit lab · 15 actions', zh: '多臂老虎机 · 15 次选择' },
        description: {
          en: 'Probe three unknown actions, update their value estimates, and decide when exploration should give way to exploitation.',
          zh: '在三个收益未知的选项之间反复选择，边试探边更新 Q 值，并决定何时探索、何时利用当前最优选项。',
        },
        tags: {
          en: ['Three actions', 'Q estimates', 'Expected regret'],
          zh: ['三个选项', 'Q 值估计', '期望累积遗憾'],
        },
      },
      {
        id: 'qpath',
        category: 'learning',
        height: 620,
        title: { en: 'Routing Apprentice', zh: '路由学徒' },
        meta: { en: 'Human–Agent Q-learning · 20–60 sec', zh: '人机共同探索 Q 学习 · 20–60 秒' },
        description: {
          en: 'Human and Agent explore fresh routing episodes as equals, and every transition updates the same compact Q-table. Let the Agent run once or keep learning until its next delivery.',
          zh: '玩家与 Agent 以同等方式在新的路由回合中探索，每一步都会更新同一张小型 Q 表；你可以让 Agent 探索一局，也可以让它连续学习直到下一次成功送达。',
        },
        tags: {
          en: ['19 decision states', 'Shared exploration', 'Terminal obstacles'],
          zh: ['19 个决策状态', '人机共同探索', '障碍终止惩罚'],
        },
      },
      {
        id: 'return',
        category: 'learning',
        height: 430,
        title: { en: 'Return Route', zh: '折扣回报' },
        meta: { en: 'Discounted return · 6 rounds', zh: '折扣回报 · 6 轮选择' },
        description: {
          en: 'Compare two reward sequences under a changing discount factor, choose the better route, and see why delayed rewards sometimes win.',
          zh: '在不同折扣因子下比较两条奖励序列，选出累积折扣回报更高的路线，并立即查看计算过程。',
        },
        tags: {
          en: ['Discount factor', 'Return calculation', 'Six choices'],
          zh: ['折扣因子', '累积折扣回报', '即时反馈'],
        },
      },
      {
        id: 'world',
        category: 'learning',
        height: 600,
        title: { en: 'Latent Look-Ahead', zh: '潜空间预演' },
        meta: { en: 'Conceptual world model · 30–90 sec', zh: '概念世界模型 · 30–90 秒' },
        description: {
          en: 'Guide a mobile relay while a compact action-conditioned model predicts the next latent state. Compare its forecast with the revealed outcome and let each step refine the model online.',
          zh: '操控移动中继，并让一个紧凑的动作条件模型在潜空间中预测下一状态；将预测与随后揭示的真实结果对照，每一步都会继续修正模型。',
        },
        tags: {
          en: ['Latent rollout', 'Prediction error', 'Online update'],
          zh: ['潜状态滚动预测', '预测误差', '在线更新'],
        },
      },
      {
        id: 'stl',
        category: 'learning',
        height: 600,
        title: { en: 'Semantic Sentinel', zh: '时序语义哨兵' },
        meta: { en: 'Temporal-logic monitor · 30–90 sec', zh: '时序逻辑监测 · 30–90 秒' },
        description: {
          en: 'Read a short observation–action–outcome stream, interpret a sliding-window report, and choose whether to hold, repair locally, or probe longer before service degrades.',
          zh: '观察一段“观测—动作—结果”序列，解读滑动窗口报告，并在服务明显下降前选择保持、局部修复或延长探测。',
        },
        tags: {
          en: ['Sliding window', 'Semantic margin', 'False-alarm tradeoff'],
          zh: ['滑动窗口', '语义裕度', '误报权衡'],
        },
      },
      {
        id: 'movable',
        category: 'wireless',
        height: 720,
        title: { en: 'Movable Antenna Lab', zh: '可移动天线实验' },
        meta: { en: 'Antenna geometry · 1–4 min', zh: '天线几何 · 1–4 分钟' },
        description: {
          en: 'Steer twelve sector antennas across four well-spaced base stations, inspect coverage and interference, then watch a search algorithm improve the layout.',
          zh: '转动四座基站上的 12 副扇区天线，观察覆盖和干扰如何变化，或让搜索算法自动寻找更优配置。',
        },
        tags: {
          en: ['12 steerable beams', 'Coverage map', 'Animated search'],
          zh: ['12 副可调天线', '覆盖图', '动态搜索'],
        },
      },
      {
        id: 'pinching',
        category: 'wireless',
        height: 680,
        title: { en: 'Pinching Antenna Lab', zh: '夹持天线实验' },
        meta: { en: 'Waveguide placement · 1–4 min', zh: '波导布设 · 1–4 分钟' },
        description: {
          en: 'Slide four radiating pinch points along a waveguide, flip their emitting side, and balance served users against overlapping beams.',
          zh: '沿介质波导移动四个夹持点并切换辐射方向，在扩大用户覆盖与减少波束重叠干扰之间寻找更优配置。',
        },
        tags: {
          en: ['Drag positions', 'Flip direction', 'Animated search'],
          zh: ['拖动夹持点', '切换方向', '动态搜索'],
        },
      },
      {
        id: 'secrecy',
        category: 'wireless',
        height: 600,
        title: { en: 'Secrecy Beam Lab', zh: '保密波束实验' },
        meta: { en: 'Secure beam steering · 30 sec–3 min', zh: '安全波束指向 · 30 秒–3 分钟' },
        description: {
          en: "Steer Alice's beam in a compact coherent-multipath model with a direct path, reflector-assisted paths, and optional first-order reflections from all four walls. Compare Bob's and Eve's achievable rates, then maximize the instantaneous secrecy rate.",
          zh: '在这个简化的相干多径模型中调整 Alice 的波束方向，观察直达径、反射板辅助路径，以及可选的四墙一阶反射；比较 Bob 与 Eve 的可达速率，并最大化瞬时保密速率。',
        },
        tags: {
          en: ['Instantaneous secrecy rate', 'Coherent multipath', 'Four-wall option'],
          zh: ['瞬时保密速率', '相干多径', '四墙模式'],
        },
      },
      {
        id: 'hopper',
        category: 'wireless',
        height: 600,
        title: { en: 'Hopping Apprentice', zh: '跳频学徒' },
        meta: {
          en: 'Human–Agent anti-jamming · 30 sec–3 min',
          zh: '人机共同探索抗干扰 · 30 秒–3 分钟',
        },
        description: {
          en: 'Human and Agent alternate fresh interference episodes, with every channel choice updating the same 18-state policy. Ask the Agent to explore once or continue until it delivers at least 9 of 12 packets.',
          zh: '玩家与 Agent 轮流面对新的干扰回合，每次选频都会更新同一个 18 状态策略；你可以让 Agent 探索一局，也可以让它持续学习，直到一局内至少送达 9 个数据包。',
        },
        tags: {
          en: ['18-state table', 'Shared exploration', 'Run until success'],
          zh: ['18 状态表格学习', '人机共同探索', '连续探索至成功'],
        },
      },
      {
        id: 'backscatter',
        category: 'wireless',
        height: 620,
        title: { en: 'Signal Judo', zh: '借波突围' },
        meta: { en: 'Adversarial backscatter · 1–3 min', zh: '对抗式反向散射 · 1–3 分钟' },
        description: {
          en: 'Manage a finite queue and battery across ten slots. Probe an opponent whose rhythm can shift, then decide when its signal is a threat, an energy source, or a carrier worth backscattering.',
          zh: '在十个时隙中管理有限的数据队列与电量。先试探会改变节奏的对手，再判断它的信号此刻是威胁、能量来源，还是可借用的反向散射载波。',
        },
        tags: {
          en: ['Queue + battery', 'Two-stage decisions', 'Hidden rhythm'],
          zh: ['队列与电量', '两阶段决策', '隐藏节奏'],
        },
      },
      {
        id: 'resilience',
        category: 'wireless',
        height: 600,
        title: { en: 'Predict Through the Outage', zh: '断链续航' },
        meta: { en: 'Semantic-link recovery · 30–90 sec', zh: '语义链路恢复 · 30–90 秒' },
        description: {
          en: 'Choose how much semantic telemetry to send through a fragile link, fall back to predicted state when packets vanish, and recover service without overreacting to every brief outage.',
          zh: '选择遥测语义信息的发送粒度；链路丢包时依靠预测状态维持服务，并在短暂中断与持续失效之间作出不过度反应的恢复决策。',
        },
        tags: {
          en: ['Cached prediction', 'Recovery time', 'Service gap'],
          zh: ['预测缓存', '恢复时间', '服务缺口'],
        },
      },
      {
        id: 'orbit',
        category: 'micro',
        height: 360,
        title: { en: 'Link Acquisition', zh: '链路捕获' },
        meta: { en: 'Link acquisition · 10–20 sec', zh: '链路捕获 · 10–20 秒' },
        description: {
          en: 'Start an orbital pass, then lock the satellite inside the acquisition window. Two clicks complete one link attempt.',
          zh: '点一下启动轨道过站，再点一下把卫星锁定在捕获窗口内；两次操作就能完成一次链路尝试。',
        },
        tags: {
          en: ['Two clicks', 'Acquisition timing', 'Range cues'],
          zh: ['两次点击', '捕获时机', '距离提示'],
        },
      },
      {
        id: 'signature',
        category: 'micro',
        height: 260,
        title: { en: 'Idea Constellation', zh: '灵感星图' },
        meta: { en: 'Idea map · 5–30 sec', zh: '灵感记录 · 5–30 秒' },
        description: {
          en: 'Place seven idea nodes and connect a brief pause into a small research constellation.',
          zh: '点下七个灵感节点，把片刻停留连成一张属于自己的研究星图。',
        },
        tags: {
          en: ['Click / Enter', 'Seven nodes', 'No score'],
          zh: ['点击 / 回车', '7 个节点', '没有输赢'],
        },
      },
      {
        id: 'echo',
        category: 'casual',
        height: 430,
        title: { en: 'Signal Replay', zh: '信号回放' },
        meta: { en: 'Signal memory · 30 sec–3 min', zh: '信号记忆 · 30 秒–3 分钟' },
        description: {
          en: 'Watch four channels pulse, then replay a signal sequence that grows by one step each round.',
          zh: '观察四个信道依次点亮，再按原顺序回放；信号序列每轮增加一步。',
        },
        tags: {
          en: ['Keys 1–4', 'Ten rounds', 'Slow cues'],
          zh: ['按键 1–4', '10 轮', '慢速提示'],
        },
      },
      {
        id: 'match',
        category: 'casual',
        height: 590,
        title: { en: 'Pattern Recall', zh: '图样记忆' },
        meta: { en: 'Visual memory · 1–4 min', zh: '视觉记忆 · 1–4 分钟' },
        description: {
          en: 'Treat a 4×4 symbol grid as a tiny visual-memory trial: recover eight pairs and beat your best move count.',
          zh: '把 4×4 图样方阵当作一次小型视觉记忆测试：找齐 8 对图案，并尝试用更少步数完成。',
        },
        tags: {
          en: ['Eight pairs', 'Local best', 'Keyboard'],
          zh: ['8 对图案', '本机最佳记录', '支持键盘'],
        },
      },
      {
        id: 'merge',
        category: 'casual',
        height: 700,
        title: { en: 'Paper Garden', zh: '论文花园' },
        meta: { en: 'Research merge · 3–10 min', zh: '科研合成 · 3–10 分钟' },
        description: {
          en: 'Merge equal research samples on a 4×4 board and grow one small idea into a finished paper.',
          zh: '在 4×4 棋盘上合并相同阶段的研究样本，把一个小灵感逐步培育成一篇完整论文。',
        },
        tags: {
          en: ['Arrow keys', 'Local best', 'Idea → paper'],
          zh: ['方向键', '本机最佳记录', '灵感 → 论文'],
        },
      },
      {
        id: 'resource',
        category: 'casual',
        height: 540,
        title: { en: 'OpenRaaS Mesh', zh: 'OpenRaaS 组网' },
        meta: { en: 'Resource orchestration · 1–5 min', zh: '资源编排 · 1–5 分钟' },
        description: {
          en: 'Rotate a compact OpenRaaS network until compute, storage, and image nodes all reach the coordinator, then watch requests flow.',
          zh: '旋转 OpenRaaS 网络节点，让计算、存储与镜像资源全部接入协调器，再观察请求如何沿着已连通路径流动。',
        },
        tags: {
          en: ['Rotate tiles', 'Always solvable', 'OpenRaaS'],
          zh: ['旋转节点', '每局可解', 'OpenRaaS'],
        },
      },
    ],
    locales: {
      en: {
        eyebrow: 'Motion · Learning · Wireless systems · A small pause',
        title: 'Playground',
        intro:
          'Eighteen small, dependency-free games live inside the site rather than taking it over. Compact learners, conceptual research models, and quick puzzles turn wireless systems, AI, and research routines into hands-on interactions.',
        badges: ['Card sized', 'Bilingual', 'Theme aware', 'Static hosting'],
        openLabel: 'Open standalone',
        miniGameLabel: 'mini game',
        sections: [
          {
            id: 'learning',
            number: '01',
            title: 'Research ideas you can play',
            intro:
              'Demonstrate a route, inspect a latent forecast, or interpret a temporal monitor: each interaction makes a compact learning idea visible before introducing the terminology.',
          },
          {
            id: 'wireless',
            number: '02',
            title: 'Wireless systems you can steer',
            intro:
              'Simplified conceptual models make coverage, interference, backscatter, resilient telemetry, reflection, and secure beam steering visible and playable.',
          },
          {
            id: 'micro',
            number: '03',
            title: 'Research easter eggs',
            intro:
              'Two-click link-acquisition and idea-mapping interactions, designed to hide beside papers, project notes, or quiet corners of the homepage.',
          },
          {
            id: 'casual',
            number: '04',
            title: 'Take a longer research break',
            intro:
              'Signal-sequence, visual-memory, paper-growing, and resource-network puzzles for a longer break, all kept inside embeddable cards.',
          },
        ],
      },
      zh: {
        eyebrow: '动态交互 · 强化学习 · 无线通信 · 轻松一下',
        title: '小游戏实验室',
        intro:
          '这里有 18 款无需额外依赖的轻量小游戏，嵌在页面里随手就能玩，也不会喧宾夺主。它们既有会从操作中学习的小型 Agent，也有取材于无线通信、人工智能与科研日常的概念模型和轻量谜题。',
        badges: ['卡片内游玩', '中英双语', '自动适配主题', '支持静态托管'],
        openLabel: '单独打开',
        miniGameLabel: '小游戏',
        sections: [
          {
            id: 'learning',
            number: '01',
            title: '把强化学习玩明白',
            intro:
              '你可以亲自示范并把控制权交给 Agent，也可以查看潜空间预测、解读时序逻辑监测报告，让抽象的学习机制先变得可见、可操作。',
          },
          {
            id: 'wireless',
            number: '02',
            title: '动手调一套无线系统',
            intro:
              '通过简化的概念模型直观看到覆盖、干扰、反向散射、语义链路恢复、反射、跳频和安全波束指向，并亲手调整系统参数。',
          },
          {
            id: 'micro',
            number: '03',
            title: '网页里的科研彩蛋',
            intro:
              '把链路捕获和灵感记录藏进一两次点击里，适合放在论文、项目说明旁，或主页不经意的角落。',
          },
          {
            id: 'casual',
            number: '04',
            title: '研究间隙，多玩一会儿',
            intro:
              '把信号序列、视觉记忆、论文成长与资源组网做成耐玩的小谜题，适合研究间隙放空几分钟，也依然收在可嵌入的卡片里。',
          },
        ],
      },
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
      degree: 'M.Eng. in Information and Communication Engineering · 2024',
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
      inlineGame: {
        game: 'resource',
        eyebrow: 'Interactive architecture · OpenRaaS',
        title: 'Assemble the resource path',
        body: 'Rotate the network nodes until compute, storage, and image resources all reach the coordinator. The puzzle turns the architectural roles above into one small orchestration problem.',
        collectionLabel: 'Explore the full playground',
        fallbackLabel: 'This network puzzle needs a little more screen width to remain playable.',
      },
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
      subtitle: '异构计算与存储资源的协同编排',
      titleLabel: '最终论文题目',
      originalTitle: '开放资源即服务',
      degreeLabel: '学位',
      degree: '工学硕士（信息与通信工程） · 2024',
      institutionLabel: '培养单位',
      institution: '电子科技大学',
      overviewLabel: '研究问题',
      overview:
        '当计算与存储资源分散在不同设备、地域和服务提供方之间，且软硬件环境高度异构时，如何将它们组织为协同服务，同时避免应用被绑定在单一设备或云平台上？',
      approachLabel: '研究路径',
      approach:
        '这项工作将资源服务架构与学习驱动的调度模型结合起来：OpenRaaS 提供系统架构，FogCom 则将调度抽象为领导者—跟随者式的资源选择问题，用于研究部分可观测网络环境下的调度决策。',
      contributionsLabel: '从系统架构到调度决策',
      contributions: [
        {
          index: '01',
          title: '解耦资源职责',
          body: 'OpenRaaS 将应用的运行环境、持久化数据以及渲染或计算任务解耦，使各类资源可以部署到更合适的节点。',
        },
        {
          index: '02',
          title: '协同调度异构资源',
          body: '全局协调节点整合计算、文件存储和镜像层存储节点，在用户侧服务质量与资源提供方的资源利用效率之间进行权衡。',
        },
        {
          index: '03',
          title: '部分可观测环境下的学习决策',
          body: 'FogCom 将调度建模为领导者—跟随者两层决策：领导者端的 PPO 策略先筛选存储候选集，再由选定的计算节点利用仅本地可见的信息作出最终选择。',
        },
      ],
      inlineGame: {
        game: 'resource',
        eyebrow: '交互架构 · OpenRaaS',
        title: '把异构资源接入同一张服务网络',
        body: '旋转网络节点，让计算、文件存储和镜像资源全部接入协调器。这个小谜题把上文中的资源职责与协同关系变成了一次可以亲手完成的组网过程。',
        collectionLabel: '前往小游戏实验室',
        fallbackLabel: '为了保留完整棋盘，这个组网游戏需要稍宽一些的屏幕。',
      },
      artifactsLabel: '相关开源实现',
      artifactsIntro:
        '下列仓库展示同一研究脉络中的系统架构与仿真模型；仓库当前版本不等同于对论文全部实验的完整复现。',
      artifacts: [
        {
          title: 'OpenRaaS',
          meta: '基于容器的去中心化资源服务平台',
          body: '该系统由团队共同开发，现由黄卓彬维护并托管在其 GitHub 账号下；公开贡献者列表中包含沈煜航。',
          href: 'https://github.com/zobinHuang/OpenRaaS',
          action: '打开仓库',
        },
        {
          title: 'FogCom',
          meta: '领导者—跟随者调度研究原型',
          body: '用于研究协同雾计算候选集筛选的仿真环境与 PPO 实现。',
          href: 'https://github.com/coolmoon327/FogCom',
          action: '打开仓库',
        },
      ],
      recordLabel: '论文记录',
      recordTitle: '知网论文详情',
      recordBody: '查看硕士学位论文《开放资源即服务》的知网详情页。',
      recordHref:
        'https://kns.cnki.net/kcms2/article/abstract?v=jit-Bskw5eSkYVMAzlqxgVxt0tsTeEpcwX_4QPsfLj16FTG1RkOq_L8HTHaDInAcSNMPNPcK6qmh8M4DL935NTFM9z8GffWmtIZrfPuh1TnP1mdK9tUYxqyK1cBDs08XcLSxlWNqRNsF_cKthDRh0PZm00FoSTpk1jU5lnvtThonTP_3jSCI98JdwNvJUhVL&uniplatform=NZKPT&language=CHS',
      recordAction: '查看知网记录',
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
            'The entries below connect research questions, papers, systems, and public artifacts in a single research narrative.',
        },
        blog: {
          eyebrow: 'Notes & writing',
          title: 'Blog',
          intro: 'A home for research notes, engineering notebooks, and reading notes.',
          protectedLabel: 'Protected notes',
          rssLabel: 'RSS',
          status: 'In preparation',
          statusTitle: 'Writing will live here.',
          statusBody:
            'Future posts will be published as static pages on GitHub Pages, without redirecting to a home device.',
          topicsLabel: 'Planned sections',
          topics: ['Research notes', 'Engineering notebooks', 'Reading notes'],
          protected: {
            eyebrow: 'Local decryption',
            title: 'Protected notes',
            intro:
              'This area contains encrypted personal notes. The password and decrypted content are used only in this browser page.',
            passwordLabel: 'Password',
            unlockAction: 'Unlock',
            unlockPending: 'Unlocking…',
            lockAction: 'Lock and clear',
            unavailableStatus: 'Protected notes are not available at this time.',
            errorStatus: 'Unable to unlock. Check the password and try again.',
            backAction: 'Back to blog',
          },
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
          internetGroup: 'Internet access',
          homeGroup: 'Home / Tailscale access',
          internetBadge: 'Internet',
          homeBadge: 'Home / Tailscale',
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
          eyebrow: '代表性论文 · 含已发表与已录用成果',
          title: '论文',
          intro:
            '这里按年份收录已发表论文、Early Access 论文、已录用会议论文，以及已有长期稳定公开链接的稿件。尚未发布会议论文集链接的条目会单独标明。',
          status: '论文状态',
          statusTitle: '每篇论文均按目前的公开状态标注。',
          statusBody: '本站仅为已有长期有效公开页面（含会议论文集页面）的条目提供链接。',
        },
        projects: {
          eyebrow: '研究方向与系统',
          title: '项目',
          intro: '这里按照研究主线梳理研究方向、系统和代表性工程成果，而不是简单罗列代码仓库。',
          status: '按研究主线整理',
          statusTitle: '这里展示的不只是代码仓库。',
          statusBody: '下方条目把研究问题、论文、系统和公开材料串联为一条完整的研究脉络。',
        },
        blog: {
          eyebrow: '笔记与写作',
          title: '博客',
          intro: '博客用于整理研究笔记、工程记录与阅读笔记，文章会在这里陆续发布。',
          protectedLabel: '受保护笔记',
          rssLabel: 'RSS',
          status: '准备中',
          statusTitle: '文章将在这里陆续发布。',
          statusBody: '文章会以 GitHub Pages 静态页面的形式发布，不会跳转到家庭设备。',
          topicsLabel: '计划栏目',
          topics: ['研究笔记', '工程记录', '阅读笔记'],
          protected: {
            eyebrow: '本地解密',
            title: '受保护笔记',
            intro: '这里存放经过加密的个人笔记。密码和解密后的内容只会在当前浏览器页面内使用。',
            passwordLabel: '密码',
            unlockAction: '解锁',
            unlockPending: '正在解锁…',
            lockAction: '锁定并清除',
            unavailableStatus: '目前没有可用的受保护笔记。',
            errorStatus: '无法解锁。请检查密码后重试。',
            backAction: '返回博客',
          },
        },
        owner: {
          eyebrow: '加密的家庭服务目录',
          title: '专属入口',
          intro: '可在不向网站源码写入地址、端口或主机名的前提下，安全访问最新的家庭服务目录。',
          status: '浏览器端解密',
          statusTitle: '解锁家庭服务目录',
          statusBody: '密码只在当前浏览器标签页中短暂用于解密目录，不会上传，也不会保存。',
          passwordLabel: '个人访问密码',
          passwordPlaceholder: '输入密码',
          unlockAction: '解锁目录',
          unlockPending: '正在解密最新目录…',
          lockAction: '锁定并清除',
          lockedStatus: '目录已锁定；页面中不含任何家庭服务地址。',
          unlockedStatus: '目录已在当前浏览器标签页中解锁。',
          errorStatus: '无法解锁目录。请检查密码和网络连接后重试。',
          emptyStatus: '目录已成功解密，但未包含本站支持的服务条目。',
          servicesLabel: '可用家庭服务',
          updatedLabel: '目录发布时间',
          expiresLabel: '有效期至',
          openAction: '打开服务',
          internetGroup: '互联网入口',
          homeGroup: '家庭网络 / Tailscale 入口',
          internetBadge: '互联网',
          homeBadge: '家庭 / Tailscale',
          scriptRequired: '需要启用 JavaScript 才能解锁这个加密目录。',
          resetHint:
            '访问密码在家庭服务器端更新，并在下一次目录发布成功后生效，无需重新构建个人主页。',
          rulesLabel: '安全边界',
          rules: [
            '公开站点只包含加密后的服务目录；地址和端口始终保存在密文中。',
            '这只是隐私保护层，并不能替代服务认证；每项服务仍须保留自己的登录与网络防护。',
            '通过 IP 直接访问 HTTPS 服务时，可能遇到自签名证书或家庭私有 CA 签发的证书；请核对证书或安装家庭 CA，不要直接忽略浏览器警告。',
            '公开可下载的密文可能遭受离线口令猜测，请使用足够长且不与其他服务复用的密码，并尽快更换初始密码。',
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
