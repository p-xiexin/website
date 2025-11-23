// site config
export const utm_source = 'derek-portfolio'
import { base } from '$app/paths';

// navigation config
type NavItemType = {
  key: 'home' | 'about' | 'projects' | 'blogs'
  href: string
}

export const navItems: Array<NavItemType> = [
  {
    key: 'home',
    href: `${base}/`
  },
  {
    key: 'about',
    href: `${base}/about`
  },
  {
    key: 'projects',
    href: `${base}/projects`
  },
  {
    key: 'blogs',
    href: `${base}/blogs`
  },
  // {
  //   name: 'Test',
  //   href: `${base}/test`
  // },
]
