<script lang="ts">
  import travelImage from '$lib/images/travel.jpg';
  import AboutLinks from '$lib/components/AboutLinks.svelte';
  import SimpleLayout from '$lib/components/SimpleLayout.svelte';
  import { uiContent } from '$lib/i18n';
  import { locale } from 'svelte-i18n';

  type Entry = {
    period: string;
    title: string;
    organization: string;
    details: string[];
  };

  type Honor = {
    year: string;
    name: string;
    result: string;
  };

  type Publication = {
    year: string;
    title: string;
    venue: string;
    summary: string;
  };

  const cvContent: Record<'zh' | 'en', {
    education: Entry[];
    experience: Entry[];
    honors: Honor[];
    publications: Publication[];
    labels: { publications: string; education: string; experience: string; honors: string; profile: string; affiliation: string; location: string };
  }> = {
    zh: {
      labels: {
        publications: '论文发表',
        education: '教育经历',
        experience: '科研与实习经历',
        honors: '主要荣誉',
        profile: '学术档案',
        affiliation: '所在院校',
        location: '所在地'
      },
      publications: [
        {
          year: '2026',
          title: 'MetaTune: Adjoint-based Meta-tuning via Robotic Differentiable Dynamics',
          venue: 'IROS 2026 · 已录用 · 第一作者',
          summary: '面向控制器与扰动观测器联合调参，构建基于可微动力学和伴随灵敏度分析的统一元调参框架。多扰动条件下轨迹跟踪误差降低 15%–20%，梯度计算加速超过 50%。'
        }
      ],
      education: [
        {
          period: '2024.09 — 2027.06',
          title: '硕士 · 控制科学与工程',
          organization: '华中科技大学 · 人工智能与自动化学院 · 保研',
          details: [
            'GPA 84.98',
            '专利 · 一种基于多层级语义超图的动态注意力检索增强生成方法及系统'
          ]
        },
        {
          period: '2020.09 — 2024.06',
          title: '本科 · 测控技术与仪器',
          organization: '武汉理工大学 · 机电工程学院',
          details: [
            'GPA 96.16 · 专业排名 19.3% · CET-6',
            '毕业论文 · 基于机器学习的旋翼无人机故障诊断方法研究'
          ]
        }
      ],
      experience: [
        {
          period: '2026.06 — 至今',
          title: '前馈式三维重建',
          organization: '华为 2012 黎曼实验室',
          details: [
            '设计几何一致性监督生成流程并构建多源 3D 训练数据集，基于 Pi3X 训练稠密匹配解码器，预测 dense warp、匹配置信度与多视图 tracks。',
            '将 MASt3R-Fusion 从双帧匹配扩展至多帧输入，重新设计跨帧关联与 SfM 后端，并融合 IMU 完成跨窗口 Sim(3) 对齐与联合 BA。'
          ]
        },
        {
          period: '2026.03 — 2026.06',
          title: '羽毛球运动机器人',
          organization: '浙江深辰凯动科技有限公司',
          details: [
            '设计并实现 Fix-Horizon MPC，缓解滚动时域中的参考轨迹缩短、接触相位漂移与动作被动追赶问题，实机击球成功率约 92%。',
            '构建羽毛球飞行与碰撞模型，基于实测数据辨识空气阻力和初始状态，轨迹预测 RMSE 约 6.6 cm，MAE 约 5.4 cm。',
            '基于轨迹优化生成多技能击球数据集，预训练物理一致的动作隐空间表示，并通过强化学习完成闭环策略后训练。'
          ]
        }
      ],
      honors: [
        { year: '2023', name: '全国大学生智能汽车竞赛', result: '完全模型组全国一等奖 · 队长' },
        { year: '2023', name: 'RoboMaster 高校联盟赛', result: '上海站二等奖 · 电控组组长' },
        { year: '2023', name: '全国大学生电子设计竞赛', result: '湖北省一等奖' }
      ]
    },
    en: {
      labels: {
        publications: 'Publications',
        education: 'Education',
        experience: 'Research and Industry Experience',
        honors: 'Selected Honors',
        profile: 'Academic Profile',
        affiliation: 'Affiliation',
        location: 'Location'
      },
      publications: [
        {
          year: '2026',
          title: 'MetaTune: Adjoint-based Meta-tuning via Robotic Differentiable Dynamics',
          venue: 'Accepted at IROS 2026 · First Author',
          summary: 'A unified meta-tuning framework for jointly optimizing controllers and disturbance observers through differentiable dynamics and adjoint sensitivity analysis. It reduces trajectory-tracking error by 15%–20% and accelerates gradient computation by more than 50% under multiple disturbances.'
        }
      ],
      education: [
        {
          period: 'Sep 2024 — Jun 2027',
          title: 'Master’s Student in Control Science and Engineering',
          organization: 'School of Artificial Intelligence and Automation · Huazhong University of Science and Technology',
          details: [
            'GPA 84.98',
            'Patent · Dynamic-attention retrieval-augmented generation based on multi-level semantic hypergraphs'
          ]
        },
        {
          period: 'Sep 2020 — Jun 2024',
          title: 'B.Eng. in Measurement and Control Technology',
          organization: 'School of Mechanical and Electronic Engineering · Wuhan University of Technology',
          details: [
            'GPA 96.16 · Top 19.3% · CET-6',
            'Thesis · Machine-learning-based fault diagnosis for rotary-wing UAVs'
          ]
        }
      ],
      experience: [
        {
          period: 'Jun 2026 — Present',
          title: 'Feed-forward 3D Reconstruction',
          organization: 'Huawei 2012 Laboratories · Riemann Lab',
          details: [
            'Designed a geometry-consistent supervision pipeline and multi-source 3D training data, then trained a Pi3X-based dense matching decoder for dense warps, confidence, and multi-view tracks.',
            'Extended MASt3R-Fusion from pairwise to multi-view input, redesigned cross-frame association and the SfM backend, and combined IMU-based Sim(3) window alignment with joint bundle adjustment.'
          ]
        },
        {
          period: 'Mar 2026 — Jun 2026',
          title: 'Badminton Robot',
          organization: '浙江深辰凯动科技有限公司',
          details: [
            'Designed Fix-Horizon MPC to address shrinking references, contact-phase drift, and reactive motion in receding-horizon optimization, reaching approximately 92% hitting success on hardware.',
            'Built shuttlecock flight and collision models and identified drag and initial states from measurements, achieving approximately 6.6 cm RMSE and 5.4 cm MAE.',
            'Generated a multi-skill striking dataset through trajectory optimization, pretrained a physics-consistent latent action representation, and post-trained a closed-loop policy with reinforcement learning.'
          ]
        }
      ],
      honors: [
        { year: '2023', name: 'National University Intelligent Vehicle Competition', result: 'National First Prize · Team Leader' },
        { year: '2023', name: 'RoboMaster University League', result: 'Shanghai Second Prize · Control Team Lead' },
        { year: '2023', name: 'National Undergraduate Electronics Design Contest', result: 'Hubei First Prize' }
      ]
    }
  };

  $: cv = cvContent[$locale?.toLowerCase().startsWith('en') ? 'en' : 'zh'];
</script>

<svelte:head>
  <title>{$uiContent.about.pageTitle}</title>
  <meta name="description" content={$uiContent.about.paragraphs.join(' ')} />
</svelte:head>

<SimpleLayout title={$uiContent.about.pageTitle} intro={$uiContent.about.headline}>
  <div class="about-intro">
    <div class="about-copy">
      {#each $uiContent.about.paragraphs as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>
    <aside>
      <img src={travelImage} alt="" />
      <div class="profile-facts">
        <h2>{cv.labels.profile}</h2>
        <dl>
          <div><dt>{cv.labels.affiliation}</dt><dd>HUST</dd></div>
          <div><dt>{cv.labels.location}</dt><dd>Wuhan, China</dd></div>
        </dl>
      </div>
      <AboutLinks />
    </aside>
  </div>

  <section class="cv-section" aria-labelledby="publications-title">
    <header><h2 id="publications-title">{cv.labels.publications}</h2><span>Publications</span></header>
    <div class="publication-list">
      {#each cv.publications as publication}
        <article class="publication-entry">
          <time>{publication.year}</time>
          <div>
            <h3>{publication.title}</h3>
            <p class="venue">{publication.venue}</p>
            <p>{publication.summary}</p>
            <nav aria-label="Publication links">
              <a href="https://arxiv.org/abs/2603.27313" target="_blank" rel="noreferrer">arXiv ↗</a>
              <a href="https://github.com/p-xiexin/px4_ctrl" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://www.bilibili.com/video/BV1gJd5BwEsa/" target="_blank" rel="noreferrer">Video ↗</a>
            </nav>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="cv-section" aria-labelledby="education-title">
    <header><h2 id="education-title">{cv.labels.education}</h2><span>Education</span></header>
    <div class="entry-list">
      {#each cv.education as entry}
        <article class="cv-entry">
          <time>{entry.period}</time>
          <div>
            <h3>{entry.title}</h3>
            <p class="organization">{entry.organization}</p>
            <ul>{#each entry.details as detail}<li>{detail}</li>{/each}</ul>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="cv-section" aria-labelledby="experience-title">
    <header><h2 id="experience-title">{cv.labels.experience}</h2><span>Experience</span></header>
    <div class="entry-list">
      {#each cv.experience as entry}
        <article class="cv-entry">
          <time>{entry.period}</time>
          <div>
            <h3>{entry.title}</h3>
            <p class="organization">{entry.organization}</p>
            <ul>{#each entry.details as detail}<li>{detail}</li>{/each}</ul>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="cv-section" aria-labelledby="honors-title">
    <header><h2 id="honors-title">{cv.labels.honors}</h2><span>Honors</span></header>
    <div class="honor-list">
      {#each cv.honors as honor}
        <div class="honor-entry">
          <time>{honor.year}</time>
          <strong>{honor.name}</strong>
          <span>{honor.result}</span>
        </div>
      {/each}
    </div>
  </section>
</SimpleLayout>

<style>
  .about-intro { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 42px; padding-bottom: 22px; }
  .about-copy { max-width: 650px; }
  .about-copy p { margin: 0; color: hsl(var(--muted-foreground)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; line-height: 1.8; }
  .about-copy p + p { margin-top: 10px; }
  aside { display: grid; grid-template-columns: 92px 1fr; gap: 0 14px; align-content: start; border-left: 1px solid hsl(var(--border)); padding-left: 20px; }
  img { grid-row: 1 / span 2; width: 92px; height: 116px; object-fit: cover; filter: saturate(.72); }
  .profile-facts { padding-top: 2px; }
  .profile-facts h2 { margin: 0 0 6px; color: hsl(var(--primary)); font-family: Georgia, serif; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
  dl { margin: 0; }
  dl > div { display: flex; justify-content: space-between; gap: 12px; padding: 3px 0; font-size: 10px; }
  dt { color: hsl(var(--muted-foreground)); }
  dd { margin: 0; color: hsl(var(--foreground)); font-weight: 600; text-align: right; }
  aside :global(.about-links) { grid-column: 2; margin-top: 8px; padding-top: 8px; }

  .cv-section { padding: 20px 0 22px; border-top: 1px solid hsl(var(--border)); }
  .cv-section > header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
  .cv-section h2 { margin: 0; color: hsl(var(--primary)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 17px; font-weight: 650; }
  .cv-section > header span { color: hsl(var(--muted-foreground)); font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
  .entry-list, .honor-list, .publication-list { border-top: 1px solid hsl(var(--border)); }
  .publication-entry { display: grid; grid-template-columns: 70px 1fr; gap: 18px; padding: 12px 0 14px; border-bottom: 1px solid hsl(var(--border)); }
  .publication-entry time { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 10px; }
  .publication-entry h3 { margin: 0; color: hsl(var(--foreground)); font-family: Georgia, "Times New Roman", serif; font-size: 14px; font-weight: 650; line-height: 1.35; }
  .publication-entry p { max-width: 760px; margin: 6px 0 0; color: hsl(var(--muted-foreground)); font-size: 11px; line-height: 1.6; }
  .publication-entry .venue { margin-top: 3px; color: hsl(var(--primary)); font-weight: 650; }
  .publication-entry nav { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 7px; }
  .publication-entry a { color: hsl(var(--primary)); font-size: 10px; font-weight: 650; text-decoration: none; }
  .publication-entry a:hover { text-decoration: underline; }
  .cv-entry { display: grid; grid-template-columns: 145px 1fr; gap: 18px; padding: 12px 0 13px; border-bottom: 1px solid hsl(var(--border)); }
  .cv-entry time, .honor-entry time { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 10px; }
  .cv-entry h3 { margin: 0; color: hsl(var(--foreground)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; font-weight: 650; }
  .organization { margin: 2px 0 0; color: hsl(var(--primary)); font-size: 11px; font-weight: 600; }
  ul { margin: 7px 0 0; padding-left: 16px; color: hsl(var(--muted-foreground)); }
  li { padding-left: 2px; font-size: 11px; line-height: 1.6; }
  li + li { margin-top: 3px; }
  .honor-entry { display: grid; grid-template-columns: 70px 1.15fr 1fr; gap: 16px; align-items: baseline; padding: 9px 0; border-bottom: 1px solid hsl(var(--border)); }
  .honor-entry strong { font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 11px; font-weight: 650; }
  .honor-entry span { color: hsl(var(--muted-foreground)); font-size: 10px; }

  @media (max-width: 700px) {
    .about-intro { grid-template-columns: 1fr; gap: 24px; }
    aside { width: min(280px, 100%); border-top: 1px solid hsl(var(--border)); border-left: 0; padding: 18px 0 0; }
    .publication-entry { grid-template-columns: 1fr; gap: 5px; }
    .cv-entry { grid-template-columns: 1fr; gap: 5px; }
    .honor-entry { grid-template-columns: 48px 1fr; gap: 5px 10px; }
    .honor-entry span { grid-column: 2; }
  }
</style>
