<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
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
    period: string;
    name: string;
    result: string;
    details: string[];
    links: { label: string; href: string }[];
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
        honors: '项目与竞赛',
        profile: '学术档案',
        affiliation: '所在院校',
        location: '所在地'
      },
      publications: [
        {
          year: '2026',
          title: 'MetaTune: Adjoint-based Meta-tuning via Robotic Differentiable Dynamics',
          venue: 'IROS 2026 · 已录用 · 第一作者',
          summary: '面向控制器与扰动观测器联合调参，构建基于可微动力学和伴随灵敏度分析的统一元调参框架。模型与数据混合驱动的协同优化将梯度计算与参数维度解耦，跟踪误差降低超过 20%。'
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
            '设计几何一致性监督生成流程并构建多源 3D 训练数据集；基于 Pi3X 训练稠密匹配解码器，预测 dense warp、匹配置信度与多视图 tracks。',
            '扩展 Pi3x 的 LiDAR 视觉多模态感知能力，场景点图重建误差由 0.057 m 降至 0.033 m；结合模型蒸馏与结构剪枝，将 32 帧 GPU 推理延迟由 6.334 s 降至 4.743 s，为后续端侧部署提供支持。',
            '基于 Pi3 几何表征训练轻量级 Matching Head，并拓展至流式增量匹配与置信度建模，提升复杂场景关联鲁棒性，使匹配质量与后续 BA 和 Fusion 优化效果对齐。',
            '将 MASt3R-Fusion 从双帧匹配扩展至多帧输入，重新设计跨帧关联与 SfM 后端，融合 IMU 完成跨窗口 Sim(3) 对齐与联合 BA。'
          ]
        },
        {
          period: '2026.03 — 2026.06',
          title: '羽毛球运动机器人',
          organization: '浙江深辰凯动科技有限公司',
          details: [
            '设计并实现 Fix-Horizon MPC，缓解滚动时域中的参考轨迹缩短、接触相位漂移与动作被动追赶问题，提升动作一致性与实机调参效率，实机击球成功率约 92%。',
            '构建羽毛球飞行与碰撞模型，基于实测数据辨识空气阻力和初始状态，轨迹预测 RMSE 约 6.6 cm，MAE 约 5.4 cm。',
            '设计两阶段轨迹预测方法，面向高速来球提前触发底盘与机械臂运动，为击球动作保留更完整的响应时间。',
            '基于轨迹优化生成多技能击球数据集，预训练物理一致的动作隐空间表示，并通过强化学习完成闭环策略后训练。'
          ]
        }
      ],
      honors: [
        {
          period: '2023.02 — 2023.08',
          name: '第十八届全国大学生智能汽车竞赛',
          result: '队长 · 完全模型组全国一等奖',
          details: [
            '构建轻量级车道线检测与轨迹跟踪链路，通过逐行搜索、边缘连通约束与逆透视变换生成参考轨迹。',
            '对比优化预瞄 PID、LQR 与 MPCC，并以多线程解耦感知、识别和控制。主控周期由 36 ms 以上降至 8 ms 内，平均圈速约 3.8 m/s，弯道舵机饱和占比降低约 25%。'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/p-xiexin/icar-pd' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV1ep421R7LV/' }
          ]
        },
        {
          period: '2022.10 — 2024.07',
          name: 'RoboMaster 2023 机甲大师高校联盟赛',
          result: '电控组组长 · 上海站二等奖',
          details: [
            '建立轮腿机器人二阶倒立摆与腿部运动学、动力学模型，结合 LQR、VMC 与地形姿态补偿实现鲁棒姿态控制，并通过 MATLAB 代码生成部署至 STM32 与 FreeRTOS。',
            '针对对抗场景中的感知延迟与目标运动不确定性，构建装甲板识别、EKF 状态预测与弹道补偿闭环。'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/leancamel/RM' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV1hx4y1r7qY/' }
          ]
        },
        {
          period: '2023.07 — 2023.08',
          name: '2023 年全国大学生电子设计竞赛',
          result: '队员 · 湖北省一等奖',
          details: [
            '设计双云台协同跟踪策略，完成视觉测量到步进电机角度指令的标定映射与时序同步，实现目标连续锁定。'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/p-xiexin/rm-vision-foxglove-simulator' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV12P33eFEit/' }
          ]
        }
      ]
    },
    en: {
      labels: {
        publications: 'Publications',
        education: 'Education',
        experience: 'Research and Industry Experience',
        honors: 'Selected Projects and Competitions',
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
          title: 'M.S. in Control Science and Engineering',
          organization: 'Huazhong University of Science and Technology',
          details: [
            'Recommended for admission through the postgraduate recommendation program',
            'Patent · Dynamic-attention retrieval-augmented generation based on multi-level semantic hypergraphs'
          ]
        },
        {
          period: 'Sep 2020 — Jun 2024',
          title: 'B.E. in Measurement Control and Instrumentation',
          organization: 'Wuhan University of Technology',
          details: [
            'GPA 3.616/5.0 · Top 20%',
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
            'Built a multi-source 3D annotation pipeline with dynamic-region filtering, multi-model matching, camera and depth reconstruction, reprojection validation, and geometric quality control.',
            'Trained a lightweight Matching Head on a frozen Pi3 backbone to extract explicit cross-frame correspondences from implicit geometry, improving robustness to complex scenes.',
            'Extended Pi3x with LiDAR for multimodal perception, reducing scene point-map reconstruction error from 0.057 m to 0.033 m; applied model compression and distillation to cut 32-frame GPU inference latency from 6.334 s to 4.743 s.',
            'Developed streaming incremental matching and optimization-aware confidence, reducing redundant chunk computation while aligning correspondences with downstream BA effectiveness.',
            'Extended a MASt3R-Fusion-based visual SLAM pipeline from pairwise to multi-view input and aligned point maps across windows through IMU-assisted Sim(3) estimation and joint bundle adjustment.'
          ]
        },
        {
          period: 'Mar 2026 — Jun 2026',
          title: 'Badminton Robot',
          organization: 'Zhejiang Shenchen Kaidong Technology Co., Ltd. · Shaoxing, China',
          details: [
            'Designed Fix-Horizon MPC to address shrinking references, contact-phase drift, and reactive motion lag in receding-horizon optimization, improving motion consistency and on-robot tuning efficiency.',
            'Accelerated MPC solving with a reduced-order bang-off-bang trajectory model, compressing dense control sequences into low-dimensional velocity-change and timing parameters.',
            'Built shuttlecock flight and collision models and identified drag and initial states from measurements, achieving approximately 6.6 cm RMSE and 5.4 cm MAE.',
            'Designed a two-stage trajectory prediction method for early response to high-speed incoming shots, triggering chassis and arm motion in advance and reaching approximately 92% hitting success on hardware.',
            'Generated a multi-skill striking dataset through trajectory optimization, pretrained a physics-consistent latent action representation, and post-trained a closed-loop policy with reinforcement learning.'
          ]
        }
      ],
      honors: [
        {
          period: 'Oct 2022 — Sep 2023',
          name: 'Vision-Based Autonomous Racing',
          result: 'Team Leader · National First Prize, Baidu End-to-End Modeling Track',
          details: [
            'Developed a modular vision and planning stack in OpenCV for lane search, inverse-perspective perception, and trajectory generation, achieving under 1 ms per-frame latency on an embedded ARM platform.',
            'Compared and tuned Preview PID, Fuzzy PID, and MPCC for high-speed path tracking, achieving an average lap speed of approximately 3.8 m/s.',
            'Built a multithreaded architecture that decoupled perception, landmark recognition, and control, reducing the control cycle from over 36 ms to under 8 ms and lowering corner steering saturation by approximately 25%.'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/p-xiexin/icar-pd' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV1ep421R7LV/' }
          ]
        },
        {
          period: 'Apr 2023 — Nov 2023',
          name: 'Dynamic Control of a Wheel-Legged Robot',
          result: 'Control Team Lead · Shanghai Second Prize',
          details: [
            'Established a second-order inverted pendulum model in MATLAB and built a system-level simulation in Simulink and Simscape with embedded C code generation.',
            'Designed a hierarchical LQR and VMC controller for end-effector force to joint-torque mapping, with phase-based jumping control implemented through a state machine.',
            'Constructed a parameterized LQR controller with leg length as the scheduling variable and deployed it on STM32F4 with FreeRTOS.'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/leancamel/RM' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV1hx4y1r7qY/' }
          ]
        },
        {
          period: 'Jul 2023 — Aug 2023',
          name: '2023 National Undergraduate Electronic Design Contest',
          result: 'Team Member · Hubei Provincial First Prize',
          details: [
            'Designed a coordinated dual-gimbal tracking strategy and calibrated the mapping and timing synchronization from visual measurements to stepper-motor angle commands for continuous target lock.'
          ],
          links: [
            { label: 'GitHub', href: 'https://github.com/p-xiexin/rm-vision-foxglove-simulator' },
            { label: 'Video', href: 'https://www.bilibili.com/video/BV12P33eFEit/' }
          ]
        }
      ]
    }
  };

  $: isEnglish = $locale?.toLowerCase().startsWith('en') ?? false;
  $: cv = cvContent[isEnglish ? 'en' : 'zh'];
  $: heroTitle = isEnglish ? 'Peng Xiexin' : '彭谢昕 · Peng Xiexin';
  $: heroIntro = isEnglish
    ? 'M.S. student in Control Science and Engineering · Huazhong University of Science and Technology'
    : '控制科学与工程硕士研究生 · 华中科技大学';

  const openProjectReport = (event: MouseEvent | KeyboardEvent, index: number) => {
    if (index !== 0 || (event.target as HTMLElement).closest('a')) return;
    if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    goto(`${base}/reports/icar-pd`);
  };
</script>

<svelte:head>
  <title>Peng Xiexin · Academic CV</title>
  <meta name="description" content={$uiContent.about.paragraphs.join(' ')} />
</svelte:head>

<div id="about" class="cv-root">
<SimpleLayout title={heroTitle} intro={heroIntro}>
  <div class="about-intro">
    <div class="about-copy">
      <h2>About</h2>
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

  <section class="cv-section" id="education" aria-labelledby="education-title">
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

  <section class="cv-section" id="publications" aria-labelledby="publications-title">
    <header><h2 id="publications-title">{cv.labels.publications}</h2><span>Publications</span></header>
    <div class="publication-list">
      {#each cv.publications as publication}
        <article class="publication-entry" id="publication-metatune">
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

  <section class="cv-section" id="experience" aria-labelledby="experience-title">
    <header><h2 id="experience-title">{cv.labels.experience}</h2><span>Experience</span></header>
    <div class="entry-list">
      {#each cv.experience as entry, index}
        <article class="cv-entry" id={index === 0 ? 'experience-huawei' : 'experience-badminton'}>
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

  <section class="cv-section" id="projects" aria-labelledby="honors-title">
    <header><h2 id="honors-title">{cv.labels.honors}</h2><span>Projects &amp; Competitions</span></header>
    <div class="entry-list">
      {#each cv.honors as honor, index}
        {#if index === 0}
          <div
            class="cv-entry competition-entry report-entry"
            id="competition-smart-car"
            role="link"
            tabindex="0"
            aria-label={`${honor.name} report`}
            onclick={(event) => openProjectReport(event, index)}
            onkeydown={(event) => openProjectReport(event, index)}
          >
            {@render honorContent(honor, true)}
          </div>
        {:else}
          <article class="cv-entry competition-entry" id={['competition-smart-car', 'competition-robomaster', 'competition-electronic-design'][index]}>
            {@render honorContent(honor, false)}
          </article>
        {/if}
      {/each}
    </div>
  </section>

</SimpleLayout>
</div>

{#snippet honorContent(honor: Honor, hasReport: boolean)}
  <time>{honor.period}</time>
  <div>
    <h3>{honor.name}</h3>
    <p class="organization">{honor.result}</p>
    {#if honor.details.length}
      <ul>{#each honor.details as detail}<li>{detail}</li>{/each}</ul>
    {/if}
    {#if honor.links.length}
      <nav aria-label={`${honor.name} links`}>
        {#if hasReport}<a href={`${base}/reports/icar-pd`}>Report →</a>{/if}
        {#each honor.links as link}
          <a href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>
        {/each}
      </nav>
    {/if}
  </div>
{/snippet}

<style>
  :global(html) { scroll-behavior: smooth; }
  .cv-root { scroll-margin-top: 82px; }
  .about-intro { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 42px; padding-bottom: 22px; }
  .about-copy { max-width: 650px; }
  .about-copy h2 { margin: 0 0 8px; color: hsl(var(--primary)); font-family: Georgia, serif; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
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
  .entry-list, .publication-list { border-top: 1px solid hsl(var(--border)); }
  .publication-entry { display: grid; grid-template-columns: 70px 1fr; gap: 18px; padding: 12px 0 14px; border-bottom: 1px solid hsl(var(--border)); }
  .publication-entry time { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 10px; }
  .publication-entry h3 { margin: 0; color: hsl(var(--foreground)); font-family: Georgia, "Times New Roman", serif; font-size: 14px; font-weight: 650; line-height: 1.35; }
  .publication-entry p { max-width: 760px; margin: 6px 0 0; color: hsl(var(--muted-foreground)); font-size: 11px; line-height: 1.6; }
  .publication-entry .venue { margin-top: 3px; color: hsl(var(--primary)); font-weight: 650; }
  .publication-entry nav { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 7px; }
  .publication-entry a { color: hsl(var(--primary)); font-size: 10px; font-weight: 650; text-decoration: none; }
  .publication-entry a:hover { text-decoration: underline; }
  .cv-entry { display: grid; grid-template-columns: 145px 1fr; gap: 18px; padding: 12px 0 13px; border-bottom: 1px solid hsl(var(--border)); }
  .cv-entry time { color: hsl(var(--muted-foreground)); font-family: Georgia, serif; font-size: 10px; }
  .cv-entry h3 { margin: 0; color: hsl(var(--foreground)); font-family: "Noto Serif SC", "Songti SC", Georgia, serif; font-size: 13px; font-weight: 650; }
  .organization { margin: 2px 0 0; color: hsl(var(--primary)); font-size: 11px; font-weight: 600; }
  ul { margin: 7px 0 0; padding-left: 16px; color: hsl(var(--muted-foreground)); }
  li { padding-left: 2px; font-size: 11px; line-height: 1.6; }
  li + li { margin-top: 3px; }
  .competition-entry nav { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 7px; }
  .competition-entry a { color: hsl(var(--primary)); font-size: 10px; font-weight: 650; text-decoration: none; }
  .competition-entry a:hover { text-decoration: underline; }
  .report-entry { cursor: pointer; transition: background-color .15s ease, padding .15s ease; }
  .report-entry:hover, .report-entry:focus-visible { margin: 0 -10px; padding-right: 10px; padding-left: 10px; background: hsl(var(--muted) / .45); outline: none; }
  .cv-section, .publication-entry, .cv-entry { scroll-margin-top: 82px; }

  @media (max-width: 700px) {
    .about-intro { grid-template-columns: 1fr; gap: 24px; }
    aside { width: min(280px, 100%); border-top: 1px solid hsl(var(--border)); border-left: 0; padding: 18px 0 0; }
    .publication-entry { grid-template-columns: 1fr; gap: 5px; }
    .cv-entry { grid-template-columns: 1fr; gap: 5px; }
  }
</style>
