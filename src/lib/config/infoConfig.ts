export * from './projects'
export * from './education'
export * from './career'
export * from './notes'

// personal info
export const name = 'Peng Xiexin'
export const headline = 'Student at HUST.'
export const introduction = [
  "Hi! My name is Peng Xiexin, and I’m currently a graduate student at HUST, focusing on the field of robotics",
  "I am passionate about artificial intelligence and robotics, especially in utilizing advanced technologies to enhance robot autonomy and intelligence",
]
export const email = 'xiexinpi@gmail.com'
export const githubUsername = 'p-xiexin'

// about page
export const aboutMeHeadline = 'Who Are You and Why Should I Care?'
export const aboutParagraphs = [
  "Hi! My name is Peng Xiexin, and I’m currently a graduate student at HUST, focusing on the field of robotics",
  "I am passionate about artificial intelligence and robotics, especially in utilizing advanced technologies to enhance robot autonomy and intelligence.",
  "I started this blog to share the insights I learn every day. Most blogs focus on education in Artificial Intelligence and general computer science, while others share the life lessons I've learned.",
]

// blog
export const blogHeadLine = "What I've thinking about."
export const blogIntro =
  "I've written something about Robotics, AI, programming and life."

// social links
export type SocialLinkType = {
  name: string
  ariaLabel?: string
  icon: string
  href: string
}

export const socialLinks: Array<SocialLinkType> = [
  {
    name: 'Tiktok',
    icon: 'tiktok',
    href: 'https://example.com/python-workshop',
  },
  {
    name: 'Bilibili',
    icon: 'bilibili',
    href: 'https://space.bilibili.com/283704238',
  },
]

// https://simpleicons.org/
export const techIcons = [
  'typescript',
  'javascript',
  'cplusplus',
  'cmake',
  'python',
  'svelte',
  'mysql',
  'react',
  'nodedotjs',
  'nextdotjs',
  'nginx',
  'docker',
  'git',
  'github',
  'dji',
  'ollama',
  'ros',
  'linux',
  'nvidia',
  'stmicroelectronics',
  'raspberrypi',
]
