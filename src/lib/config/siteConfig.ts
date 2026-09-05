// site config
export const utm_source = 'derek-portfolio'
import { base } from '$app/paths';

// navigation config
type NavItemType = {
  key: 'about' | 'publications' | 'experience' | 'projects' | 'education' | 'blogs'
  href: string
}

export const navItems: Array<NavItemType> = [
  {
    key: 'about',
    href: `${base}/#about`
  },
  {
    key: 'publications',
    href: `${base}/#publications`
  },
  {
    key: 'experience',
    href: `${base}/#experience`
  },
  {
    key: 'projects',
    href: `${base}/#projects`
  },
  {
    key: 'education',
    href: `${base}/#education`
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
