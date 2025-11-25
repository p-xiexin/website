export * from './projects'
export * from './education'
export * from './career'
export * from './notes'

// personal info
export const name = 'Peng Xiexin'

export const email = 'xiexinpi@gmail.com'
export const githubUsername = 'p-xiexin'

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
  'bambulab',
  'neo4j',
]
