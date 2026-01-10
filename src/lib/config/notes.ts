import type { Note } from '$lib/utils/types';

type SupportedLocale = 'en' | 'zh';

const FALLBACK_LOCALE: SupportedLocale = 'zh';

const resolveLocale = (locale?: string): SupportedLocale =>
  locale?.toLowerCase() === 'en' ? 'en' : FALLBACK_LOCALE;

const EN_NOTES: Array<Note> = [
  // {
  //   name: 'CMake',
  //   description: 'Learn the basics of CMake and build a simple C++ project.',
  //   slug: 'CMake',
  //   tags: ['cmake', 'cpp'],
  //   published: true,
  // },
  {
    name: 'Git',
    description: 'How to use Git for version control.',
    slug: 'Git',
    tags: ['git'],
    published: true,
  },
  {
    name: 'SLAM',
    description: 'Notes on "14 Lectures on Visual SLAM", VIO principles, and fundamental optimization methods.',
    slug: 'SLAM',
    tags: ['SLAM'],
    published: true,
  },
];

const ZH_NOTES: Array<Note> = [
  // {
  //   name: 'CMake',
  //   description: '学习 CMake 的基本使用方法，并构建一个简单的 C++ 工程。',
  //   slug: 'CMake',
  //   tags: ['cmake', 'cpp'],
  //   published: true,
  // },
  {
    name: 'Git',
    description: 'Git 版本控制工具的使用。',
    slug: 'Git',
    tags: ['git'],
    published: true,
  },
  {
    name: 'SLAM',
    description: '包含《视觉 SLAM 十四讲》、VIO 原理和基本的数学优化方法。',
    slug: 'SLAM',
    tags: ['SLAM'],
    published: true,
  },
];

export const noteListByLocale: Record<SupportedLocale, Array<Note>> = {
  en: EN_NOTES,
  zh: ZH_NOTES,
};

export const getNotesByLocale = (locale?: string): Array<Note> =>
  noteListByLocale[resolveLocale(locale)];

// 保留向后兼容性
export const noteList: Array<Note> = noteListByLocale[FALLBACK_LOCALE];
