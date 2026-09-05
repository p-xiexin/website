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
    },
    {
      year: '2024',
      title: 'RoboMaster 视觉实验平台',
      description: '使用 C++ 与 Eigen 实现相机建模和多坐标系转换，并通过 Foxglove Studio 组织算法实验与数据流。',
      methods: 'C++ · Camera model · Coordinate transforms',
      href: 'https://github.com/p-xiexin/foxglove_websocket_cpp',
      linkLabel: 'Code',
    },
    {
      year: '2023',
      title: '全国大学生智能汽车竞赛',
      description: '构建视觉自主赛车的车道线检测、参考轨迹生成与高速循迹控制链路，带队获得完全模型组全国一等奖。',
      methods: 'OpenCV · Preview PID · MPCC · Multithreading',
      href: 'https://www.bilibili.com/video/BV1ep421R7LV/',
      linkLabel: 'Video',
    },
    {
      year: '2023',
      title: '全国大学生电子设计竞赛',
      description: '设计双云台协同跟踪策略，完成视觉测量、步进电机角度指令标定与时序同步，获得湖北省一等奖。',
      methods: 'Vision tracking · Dual gimbal · Stepper motor',
      href: 'https://www.bilibili.com/video/BV12P33eFEit/',
      linkLabel: 'Video',
    },
    {
      year: '2025',
      title: '结构化知识库问答系统',
      description: '面向领域知识组织与检索的问答系统实践，探索结构化知识、检索流程与语言模型之间的连接。',
      methods: 'Graph RAG · LLM · Knowledge retrieval',
      href: 'https://mp.weixin.qq.com/s/1IoqA9wj-9pDBECPOFOOfQ',
      linkLabel: 'Article',
    },
  ];

  const writing = [
    {
      date: '2025.08',
      title: '从 PMP 到配点法',
      description: '协态消失之后，结构是否仍然存在',
      href: `${base}/blogs/2cff3f383aa0c258f3ba80a0b3ef8632`,
    },
    {
      date: '2025.08',
      title: '模型参考自适应控制方法',
      description: 'MRAC 的建模、控制律与稳定性记录',
      href: `${base}/blogs/0e800603378524ca15d7f7ce55d02b77`,
    },
    {
      date: '2025.07',
      title: '从拉格朗日力学到最优控制',
      description: '动力学结构与控制问题的连续视角',
      href: `${base}/blogs/f5f0c57f202b990a7f4e61e733ce930e`,
    },
    {
      date: '2025.07',
      title: '哈密顿函数与最优控制',
      description: '哈密顿函数在最优控制问题中的基本结构',
      href: `${base}/blogs/b2b6c0f506c6fd76ca9def6939fc269d`,
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
          <a href="mailto:xiexinpi@gmail.com">xiexinpi@gmail.com</a>
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
            <a href="https://arxiv.org/abs/2603.27313" target="_blank" rel="noreferrer">[Paper]</a>
            <a href="https://github.com/p-xiexin/px4_ctrl" target="_blank" rel="noreferrer">[Code]</a>
            <a href="https://www.bilibili.com/video/BV1gJd5BwEsa/" target="_blank" rel="noreferrer">[Video]</a>
          </div>
        </div>
      </article>
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
            <a href={project.href} target="_blank" rel="noreferrer" aria-label={`查看${project.title}`}>
              {project.linkLabel} <ArrowUpRight size={13} />
            </a>
          </article>
        {/each}
      </div>
    </section>

    <section class="cv-section" id="writing" aria-labelledby="writing-title">
      <header class="section-heading">
        <h2 id="writing-title">研究笔记</h2>
        <span>Technical writing</span>
      </header>
      <ol class="writing-list">
        {#each writing as article, index}
          <li>
            <span class="item-number">{index + 1}.</span>
            <div>
              <a href={article.href}>{article.title}</a>
              <span class="item-description">{article.description}</span>
            </div>
            <time>{article.date}</time>
          </li>
        {/each}
      </ol>
      <a class="more-link" href={`${base}/blogs`}>全部文章 <ArrowUpRight size={13} /></a>
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
  .cv-entry > a,
  .more-link {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: var(--accent);
    font-size: 10px;
    font-weight: 600;
    text-decoration: none;
  }
  .cv-entry > a:hover, .more-link:hover { text-decoration: underline; }

  .writing-list { margin: 0; padding: 0; border-top: 1px solid var(--light-rule); list-style: none; }
  .writing-list li {
    display: grid;
    grid-template-columns: 28px 1fr 58px;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid var(--light-rule);
    line-height: 1.4;
  }
  .item-number, .writing-list time { color: var(--faint); font-family: Georgia, serif; font-size: 10px; }
  .writing-list time { text-align: right; }
  .writing-list a { color: var(--accent); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 12px; font-weight: 650; text-decoration: none; }
  .writing-list a:hover { text-decoration: underline; }
  .item-description { margin-left: 8px; color: var(--muted); font-size: 10px; }
  .more-link { margin-top: 8px; }

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
    .cv-entry { grid-template-columns: 46px 1fr; gap: 8px; }
    .cv-entry > a { grid-column: 2; }
    .writing-list li { grid-template-columns: 22px 1fr auto; }
    .item-description { display: block; margin: 2px 0 0; }
    .publication-entry { grid-template-columns: 36px 1fr; gap: 6px; }
  }
</style>
