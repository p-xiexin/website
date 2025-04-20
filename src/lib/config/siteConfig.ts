// site config
export const utm_source = 'derek-portfolio'
import { base } from '$app/paths';

// navigation config
type NavItemType = {
  name: string
  href: string
}

export const navItems: Array<NavItemType> = [
  {
    name: 'Home',
    href: `${base}/`
  },
  {
    name: 'About',
    href: `${base}/about`
  },
  {
    name: 'Projects',
    href: `${base}/projects`
  },
  {
    name: 'Blogs',
    href: `${base}/blogs`
  },
  // {
  //   name: 'Test',
  //   href: `${base}/test`
  // },
]
