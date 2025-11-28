// Types
export type ProjectItemType = {
  name: string;
  description: string;
  link: { href: string; label: string };
  tags: string[];
};

export type ActivityItemType = {
  name: string;
  description: string;
  date: string;
  location: string;
  link?: string;
};

type SupportedLocale = 'en' | 'zh';

const FALLBACK_LOCALE: SupportedLocale = 'zh';

const resolveLocale = (locale?: string): SupportedLocale =>
  locale?.toLowerCase() === 'en' ? 'en' : FALLBACK_LOCALE;

const selectByLocale = <T>(record: Record<SupportedLocale, T>, locale?: string): T =>
  record[resolveLocale(locale)];

// ============================================================================
// Awards & Honors
// ============================================================================
const AWARDS_EN: Array<ActivityItemType> = [
  {
    name: 'The National University Students Intelligent Car Race',
    description: 'First Prize (Baidu End-to-End Modeling Track)',
    date: '2023',
    location: 'TGU, Tianjin',
    link: 'https://www.bilibili.com/video/BV1ep421R7LV/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'RoboMaster University League (RMUL)',
    description: 'Third Prize, Shanghai Division',
    date: '2023',
    location: 'SUES, Shanghai',
    link: 'https://www.bilibili.com/video/BV1Zm4y1h7Pb/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'National Undergraduate Electronic Design Contest',
    description: 'First Prize, Hubei Province',
    date: '2023',
    location: 'WUT, Wuhan',
    link: 'https://www.bilibili.com/video/BV12P33eFEit/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
];

const AWARDS_ZH: Array<ActivityItemType> = [
  {
    name: '全国大学生智能汽车竞赛',
    description: '百度完全模型组-全国一等奖。',
    date: '2023',
    location: '天津工业大学，天津',
    link: 'https://www.bilibili.com/video/BV1ep421R7LV/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: '机甲大师高校联盟赛',
    description: '上海赛区三等奖。',
    date: '2023',
    location: '上海工程技术大学，上海',
    link: 'https://www.bilibili.com/video/BV1Zm4y1h7Pb/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: '全国大学生电子设计竞赛',
    description: '湖北省一等奖。',
    date: '2023',
    location: '武汉理工大学，武汉',
    link: 'https://www.bilibili.com/video/BV12P33eFEit/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
];

export const awardsByLocale: Record<SupportedLocale, Array<ActivityItemType>> = {
  en: AWARDS_EN,
  zh: AWARDS_ZH,
};

// ============================================================================
// Research & Projects
// ============================================================================

const PROJECTS_EN: Array<ProjectItemType> = [
  {
    name: 'Knowledge Base Question Answering System.',
    description: 'An intelligent QA system grounded in structured domain knowledge repositories.',
    link: { href: 'https://mp.weixin.qq.com/s/1IoqA9wj-9pDBECPOFOOfQ', label: 'LLM' },
    tags: ['Web', 'GRAG', 'LLM'],
  },
];

const PROJECTS_ZH: Array<ProjectItemType> = [
  {
    name: '知识库问答系统',
    description: '基于结构化领域知识库的智能问答系统。',
    link: { href: 'https://mp.weixin.qq.com/s/1IoqA9wj-9pDBECPOFOOfQ', label: 'LLM' },
    tags: ['Web', 'GRAG', 'LLM'],
  },
];

export const projectsByLocale: Record<SupportedLocale, Array<ProjectItemType>> = {
  en: PROJECTS_EN,
  zh: PROJECTS_ZH,
};

// ============================================================================
// Hobbies & Volunteer
// ============================================================================

const ACTIVITIES_EN: Array<ActivityItemType> = [
  {
    name: 'Wheel Legged Robot',
    description:
      'A wheel-legged robot project using Linear Quadratic Regulator (LQR) as the main control strategy. Focused on balancing and trajectory tracking for hybrid mobility.',
    date: '2024-01-18',
    location: 'Wuhan',
    link: 'https://www.bilibili.com/video/BV1hx4y1r7qY/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'CoreXY 3D Printer',
    description:
      'A high-speed 3D printer built with CoreXY mechanics and powered by Klipper firmware for enhanced precision, speed, and remote control capabilities.',
    date: '2024-07-14',
    location: 'Wuhan',
    link: 'https://www.bilibili.com/video/BV17XGGzUEUU/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'Foxglove Websocket C++ Platform',
    description:
      'An experimental platform for RoboMaster vision auto-aim algorithms. Supports Eigen-based camera modeling and seamless data flow with Foxglove Studio.',
    date: '2024-03-26',
    location: 'Wuhan',
    link: 'https://github.com/p-xiexin/foxglove_websocket_cpp',
  },
  {
    name: 'STM32F4 StdLib GCC Template',
    description:
      'STM32F4 template using the Standard Peripheral Library, GCC and CMake. Includes FreeRTOS with example tasks and basic init.',
    date: '2024-11-27',
    location: 'Wuhan',
    link: 'https://github.com/p-xiexin/STM32F4-StdLib-GCC-Template',
  },
];

const ACTIVITIES_ZH: Array<ActivityItemType> = [
  {
    name: '轮足机器人',
    description:
      '采用线性二次调节器（LQR）作为主要控制策略的轮足机器人项目，关注平衡与轨迹跟踪。',
    date: '2024-01-18',
    location: '武汉',
    link: 'https://www.bilibili.com/video/BV1hx4y1r7qY/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'CoreXY 3D 打印机',
    description:
      '采用 CoreXY 结构并搭载 Klipper 固件的高速 3D 打印机，兼须精度、速度与远程控制能力。',
    date: '2024-07-14',
    location: '武汉',
    link: 'https://www.bilibili.com/video/BV17XGGzUEUU/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301',
  },
  {
    name: 'Foxglove Websocket C++ 平台',
    description:
      'RoboMaster 视觉自瞄算法的实验仿真平台，基于 Eigen 实现相机建模与多坐标系转换，可便捷联动 Foxglove Studio。',
    date: '2024-03-26',
    location: '武汉',
    link: 'https://github.com/p-xiexin/foxglove_websocket_cpp',
  },
  {
    name: 'STM32F4 StdLib GCC 模板',
    description:
      '基于 STM32F4 标准外设库、GCC 与 CMake 的模板，集成 FreeRTOS 示例与基础任务和驱动初始化，便于快速搭建实时多任务工程。',
    date: '2024-11-27',
    location: '武汉',
    link: 'https://github.com/p-xiexin/STM32F4-StdLib-GCC-Template',
  },
];

export const activitiesByLocale: Record<SupportedLocale, Array<ActivityItemType>> = {
  en: ACTIVITIES_EN,
  zh: ACTIVITIES_ZH,
};

// ============================================================================
// Helper Functions
// ============================================================================

export const getAwardsByLocale = (locale?: string): Array<ActivityItemType> =>
  selectByLocale(awardsByLocale, locale);

export const getProjectsByLocale = (locale?: string): Array<ProjectItemType> =>
  selectByLocale(projectsByLocale, locale);

export const getActivitiesByLocale = (locale?: string): Array<ActivityItemType> =>
  selectByLocale(activitiesByLocale, locale);


// ============================================================================
// Backward Compatibility
// ============================================================================
export const awards = awardsByLocale[FALLBACK_LOCALE];
export const projects = projectsByLocale[FALLBACK_LOCALE];
export const activities = activitiesByLocale[FALLBACK_LOCALE];
