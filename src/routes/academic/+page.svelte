<script lang="ts">
  import { base } from '$app/paths';
  import { uiContent } from '$lib/i18n';
  import { ArrowUpRight } from 'lucide-svelte';

  const projects = [
    {
      year: '2024',
      title: '轮足机器人平衡与轨迹跟踪',
      description: '采用线性二次调节器作为主要控制策略，完成混合移动机构的平衡控制与轨迹跟踪实验。',
      methods: 'LQR · Dynamics · Trajectory tracking',
      href: 'https://www.bilibili.com/video/BV1hx4y1r7qY/',
      linkLabel: 'Video',
      detailHref: `${base}/about#competition-robomaster`,
    },
    {
      year: '2023',
      title: '全国大学生智能汽车竞赛',
      description: '构建视觉自主赛车的车道线检测、参考轨迹生成与高速循迹控制链路，带队获得完全模型组全国一等奖。',
      methods: 'OpenCV · Preview PID · MPCC · Multithreading',
      href: 'https://www.bilibili.com/video/BV1ep421R7LV/',
      linkLabel: 'Video',
      detailHref: `${base}/about#competition-smart-car`,
    },
  ];

  const experience = [
    {
      period: '2026.06 — 至今',
      role: '前馈式三维重建',
      organization: '华为 2012 黎曼实验室',
      description: '扩展 Pi3x 的 LiDAR 视觉多模态能力，并结合 Matching Head、模型蒸馏和结构剪枝推进流式匹配与端侧部署。',
      methods: 'Pi3x · LiDAR-Vision · Matching · Model Compression',
      detailHref: `${base}/about#experience-huawei`,
    },
    {
      period: '2026.03 — 2026.06',
      role: '羽毛球运动机器人',
      organization: '浙江深辰凯动科技有限公司',
      description: '负责固定时域 MPC、羽毛球飞行与碰撞建模、轨迹预测及实机击球实验，击球成功率约 92%。',
      methods: 'MPC · System Identification · Trajectory Optimization · RL',
      detailHref: `${base}/about#experience-badminton`,
    },
  ];

  const honors = [
    ['2023', '全国大学生智能汽车竞赛', '百度完全模型组全国一等奖'],
    ['2023', '全国大学生电子设计竞赛', '湖北省一等奖'],
    ['2023', 'RoboMaster 高校联盟赛', '上海站二等奖'],
  ];
</script>

<svelte:head>
  <title>Peng Xiexin · Academic CV</title>
  <meta name="description" content="Peng Xiexin 的个人学术主页。" />
</svelte:head>

<div class="cv-site">
  <main class="cv-page">
    <section class="cv-intro" id="about" aria-labelledby="cv-name">
      <div class="identity-block">
        <div>
          <h1 id="cv-name">彭谢昕 <span>Peng Xiexin</span></h1>
          <p>控制科学与工程硕士研究生 · 华中科技大学</p>
        </div>
        <address>
          <a href="mailto:p-xiexin@outlook.com">p-xiexin@outlook.com</a>
          <a href="https://github.com/p-xiexin" target="_blank" rel="noreferrer">github.com/p-xiexin</a>
          <span>Wuhan, China</span>
        </address>
      </div>

      <div class="about-block">
        <h2><span>About</span>{$uiContent.about.headline}</h2>
        <div class="about-copy">
          {#each $uiContent.about.paragraphs as paragraph}
            <p>{paragraph}</p>
          {/each}
        </div>
      </div>
    </section>

    <section class="cv-section publications-section" id="publications" aria-labelledby="publications-title">
      <header class="section-heading">
        <h2 id="publications-title">论文发表</h2>
        <span>Publications</span>
      </header>
      <article class="publication-entry">
        <span class="publication-index">[C1]</span>
        <div>
          <p class="publication-citation">
            <strong>P. Xiexin</strong> et al. <span class="publication-title">MetaTune: Adjoint-based Meta-tuning via Robotic Differentiable Dynamics.</span>
            <em>IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)</em>,
            <span class="publication-meta">2026 · Accepted</span>
          </p>
          <div class="publication-links" aria-label="MetaTune resources">
            <a href={`${base}/about#publication-metatune`}>[Details]</a>
            <a href="https://arxiv.org/abs/2603.27313" target="_blank" rel="noreferrer">[Paper]</a>
            <a href="https://github.com/p-xiexin/px4_ctrl" target="_blank" rel="noreferrer">[Code]</a>
            <a href="https://www.bilibili.com/video/BV1gJd5BwEsa/" target="_blank" rel="noreferrer">[Video]</a>
          </div>
        </div>
      </article>
    </section>

    <section class="cv-section" id="experience" aria-labelledby="experience-title">
      <header class="section-heading">
        <h2 id="experience-title">实习经历</h2>
        <span>Research and industry experience</span>
      </header>
      <div class="entry-list experience-list">
        {#each experience as item}
          <article class="experience-entry">
            <time>{item.period}</time>
            <div>
              <h3>{item.role}<span>{item.organization}</span></h3>
              <p>{item.description}</p>
              <small>{item.methods}</small>
            </div>
            <a class="entry-action-link" href={item.detailHref}>Details <ArrowUpRight size={13} /></a>
          </article>
        {/each}
      </div>
    </section>

    <section class="cv-section" id="projects" aria-labelledby="projects-title">
      <header class="section-heading">
        <h2 id="projects-title">代表项目</h2>
        <span>Selected projects</span>
      </header>
      <div class="entry-list project-list">
        {#each projects as project}
          <article class="cv-entry project-entry">
            <time>{project.year}</time>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.methods}</small>
            </div>
            <nav class="entry-actions" aria-label={`${project.title} links`}>
              <a class="entry-action-link" href={project.detailHref}>Details <ArrowUpRight size={13} /></a>
              <a class="entry-action-link" href={project.href} target="_blank" rel="noreferrer">
                {project.linkLabel} <ArrowUpRight size={13} />
              </a>
            </nav>
          </article>
        {/each}
      </div>
    </section>

    <section class="cv-section" id="background" aria-labelledby="background-title">
      <header class="section-heading">
        <h2 id="background-title">教育与荣誉</h2>
        <span>Education and honors</span>
      </header>
      <div class="background-columns">
        <div class="background-column">
          <h3>Education</h3>
          <div class="compact-entry">
            <time>2024 — Present</time>
            <div><strong>华中科技大学</strong><span>控制科学与工程 · 硕士研究生</span></div>
          </div>
          <div class="compact-entry">
            <time>2020 — 2024</time>
            <div><strong>武汉理工大学</strong><span>测控技术与仪器 · 本科</span></div>
          </div>
        </div>
        <div class="background-column">
          <h3>Selected honors</h3>
          {#each honors as honor}
            <div class="compact-entry">
              <time>{honor[0]}</time>
              <div><strong>{honor[1]}</strong><span>{honor[2]}</span></div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  </main>
</div>

<style>
  :global(html) { scroll-behavior: smooth; }

  .cv-site {
    --ink: #17212b;
    --muted: #56616c;
    --faint: #7f8992;
    --accent: #183f68;
    --rule: #cfd6dc;
    --light-rule: #e7ebee;
    --paper: #fff;
    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: Arial, "Noto Sans SC", "Microsoft YaHei", sans-serif;
    font-size: 13px;
  }

  :global(.dark) .cv-site {
    --ink: #e9eef2;
    --muted: #b1bbc3;
    --faint: #87939d;
    --accent: #8eb8dc;
    --rule: #3a4650;
    --light-rule: #27323a;
    --paper: #11181e;
  }

  h1, h2, h3, p { margin: 0; }
  a { color: inherit; }

  .cv-page {
    width: min(980px, calc(100% - 32px));
    margin: 0 auto;
  }

  .cv-page { padding: 30px 0 36px; }

  .cv-intro { padding-bottom: 22px; }
  .identity-block {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--accent);
  }
  .identity-block h1 {
    color: var(--accent);
    font-family: "Noto Serif SC", "Songti SC", Georgia, serif;
    font-size: 28px;
    font-weight: 650;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }
  .identity-block h1 span {
    margin-left: 10px;
    color: var(--ink);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0;
  }
  .identity-block > div > p { margin-top: 6px; color: var(--muted); font-size: 12px; }

  address {
    display: grid;
    grid-template-columns: auto auto;
    gap: 4px 18px;
    color: var(--muted);
    font-size: 11px;
    font-style: normal;
    text-align: right;
  }
  address a { color: var(--accent); text-decoration: none; }
  address a:hover { text-decoration: underline; }
  address span { grid-column: 2; }

  .about-block {
    display: grid;
    grid-template-columns: 165px 1fr;
    gap: 28px;
    padding-top: 18px;
  }
  .about-block h2,
  .section-heading h2 {
    color: var(--accent);
    font-family: "Noto Serif SC", "Songti SC", Georgia, serif;
    font-size: 17px;
    font-weight: 650;
  }
  .about-block h2 span {
    display: block;
    margin-bottom: 3px;
    color: var(--faint);
    font-family: Arial, sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .about-copy { columns: 2; column-gap: 26px; }
  .about-copy p {
    break-inside: avoid;
    color: var(--muted);
    font-family: "Noto Serif SC", "Songti SC", Georgia, serif;
    font-size: 12px;
    line-height: 1.65;
  }
  .about-copy p + p { margin-top: 5px; }

  .cv-section { padding: 18px 0 20px; border-top: 1px solid var(--rule); }
  .section-heading {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 9px;
  }
  .section-heading span {
    color: var(--faint);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .publications-section { padding-bottom: 18px; }
  .publication-entry {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 10px;
    padding: 8px 0 7px;
    border-top: 1px solid var(--light-rule);
    border-bottom: 1px solid var(--light-rule);
  }
  .publication-index {
    color: var(--faint);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11px;
    line-height: 1.55;
  }
  .publication-citation {
    color: var(--ink);
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
    font-size: 12px;
    line-height: 1.55;
  }
  .publication-citation strong { font-weight: 700; }
  .publication-title { margin-left: 2px; }
  .publication-citation em { font-style: italic; }
  .publication-meta { color: #b45309; white-space: nowrap; }
  :global(.dark) .publication-meta { color: #f0a45d; }
  .publication-links {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 2px;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11px;
    line-height: 1.4;
  }
  .publication-links a { color: var(--accent); text-decoration: none; }
  .publication-links a:hover { text-decoration: underline; }

  .entry-list { border-top: 1px solid var(--light-rule); }
  .experience-entry {
    display: grid;
    grid-template-columns: 112px 1fr auto;
    gap: 14px;
    padding: 9px 0;
    border-bottom: 1px solid var(--light-rule);
  }
  .experience-entry > time { color: var(--faint); font-family: Georgia, serif; font-size: 10px; }
  .experience-entry h3 { font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; font-weight: 650; }
  .experience-entry h3 span { margin-left: 9px; color: var(--accent); font-family: Arial, "Noto Sans SC", sans-serif; font-size: 10px; font-weight: 600; }
  .experience-entry p { margin-top: 2px; color: var(--muted); font-size: 11px; line-height: 1.5; }
  .experience-entry small { display: block; margin-top: 3px; color: var(--faint); font-size: 9px; }
  .cv-entry {
    display: grid;
    grid-template-columns: 58px 1fr auto;
    gap: 14px;
    padding: 9px 0;
    border-bottom: 1px solid var(--light-rule);
  }
  .cv-entry > time { color: var(--faint); font-family: Georgia, serif; font-size: 10px; }
  .cv-entry h3 { font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; font-weight: 650; }
  .cv-entry p { margin-top: 2px; color: var(--muted); font-size: 11px; line-height: 1.5; }
  .cv-entry small { display: block; margin-top: 3px; color: var(--faint); font-size: 9px; }
  .entry-action-link {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: var(--accent);
    font-size: 10px;
    font-weight: 600;
    text-decoration: none;
  }
  .entry-action-link:hover { text-decoration: underline; }
  .entry-actions { display: flex; align-items: flex-start; gap: 10px; }

  .background-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; }
  .background-column > h3 {
    padding-bottom: 5px;
    border-bottom: 1px solid var(--accent);
    color: var(--accent);
    font-family: Georgia, serif;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .compact-entry {
    display: grid;
    grid-template-columns: 78px 1fr;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid var(--light-rule);
  }
  .compact-entry time { color: var(--faint); font-family: Georgia, serif; font-size: 9px; }
  .compact-entry div { display: flex; flex-direction: column; gap: 2px; }
  .compact-entry strong { font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 11px; font-weight: 650; }
  .compact-entry span { color: var(--muted); font-size: 10px; }

  @media (max-width: 700px) {
    .cv-page { padding-top: 22px; }
    .identity-block { flex-direction: column; gap: 10px; }
    address { grid-template-columns: auto; text-align: left; }
    address span { grid-column: 1; }
    .about-block { grid-template-columns: 1fr; gap: 8px; }
    .about-copy { columns: 1; }
    .background-columns { grid-template-columns: 1fr; gap: 20px; }
  }

  @media (max-width: 480px) {
    .cv-page { width: calc(100% - 24px); }
    .identity-block h1 { font-size: 24px; }
    .identity-block h1 span { display: block; margin: 3px 0 0; font-size: 15px; }
    .experience-entry { grid-template-columns: 1fr; gap: 4px; }
    .experience-entry h3 span { display: block; margin: 2px 0 0; }
    .experience-entry > .entry-action-link { grid-column: 1; }
    .cv-entry { grid-template-columns: 46px 1fr; gap: 8px; }
    .entry-actions { grid-column: 2; }
    .publication-entry { grid-template-columns: 36px 1fr; gap: 6px; }
  }
</style>
