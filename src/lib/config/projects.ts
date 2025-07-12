// Types
export type ProjectItemType = {
  name: string
  description: string
  link: { href: string; label: string }
  tags: string[]
}

export type ActivityItemType = {
  name: string
  description: string
  date: string
  location: string
  link?: string
}

// Awards
export const awardsHeadLine = "Awards & Honors"
export const awardsIntro = "Recognition for academic and professional achievements."

export const awards: Array<ActivityItemType> = [
  {
    name: '全国大学生智能汽车竞赛',
    description: '百度完全模型组-全国一等奖',
    date: '2023',
    location: 'TGU, Tianjin',
    link: 'https://www.bilibili.com/video/BV1ep421R7LV/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301'
  },
  {
    name: '机甲大师高校联盟赛',
    description: '上海站-三等奖',
    date: '2023',
    location: 'SUES, Shanghai',
    link: 'https://www.bilibili.com/video/BV1Zm4y1h7Pb/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301'
  },
  {
    name: '全国大学生电子设计竞赛',
    description: '湖北省一等奖',
    date: '2023',
    location: 'WUT, Wuhan',
    link: 'https://www.bilibili.com/video/BV12P33eFEit/?share_source=copy_web&vd_source=eac89beacf4b5ecfa9a66e7ebc9bd301'
  },
]

// Research & Projects
export const projectHeadLine = "Research & Projects"
export const projectIntro = "Academic research and technical projects I've worked on."

export const projects: Array<ProjectItemType> = [
  {
    name: 'Knowledge Base Question Answering System',
    description: 'An intelligent Q&A system based on a structured knowledge base.',
    link: { href: 'https://example.com/lab617-llm', label: 'LLM' },
    tags: ['Website', 'GRAG', 'TailwindCSS', 'Fastapi', 'LLM']
  },
]

// Hobbies & Volunteer
export const activitiesHeadLine = "Hobbies & Volunteer"
export const activitiesIntro = "Personal interests and community contributions."

export const activities: Array<ActivityItemType> = [
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
  }
]