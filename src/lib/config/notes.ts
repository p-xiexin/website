import type { Note } from '$lib/utils/types';

type SupportedLocale = 'en' | 'zh';

const FALLBACK_LOCALE: SupportedLocale = 'zh';

const resolveLocale = (locale?: string): SupportedLocale =>
  locale?.toLowerCase() === 'en' ? 'en' : FALLBACK_LOCALE;

const EN_NOTES: Array<Note> = [
  {
    name: 'World Model',
    description: 'A compact reading note on learned dynamics, imagined control, interactive environments, and world action models.',
    slug: 'WorldModel',
    tags: ['World Model', 'Reinforcement Learning'],
    published: false,
  },
  {
    name: '2012Rieman',
    description: 'Notes on feed-forward 3D reconstruction, 3D Gaussian Splatting, streaming geometry, and world models.',
    slug: '2012RiemanNote',
    tags: ['3D Vision', 'Deep Learning'],
    published: true,
  },
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
    published: false,
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
  {
    name: 'World Model',
    description: '世界模型的动力学学习、想象控制、交互环境与世界动作模型阅读笔记。',
    slug: 'WorldModel',
    tags: ['World Model', 'Reinforcement Learning'],
    published: false,
  },
  {
    name: '2012Rieman',
    description: '前馈式三维重建、3D Gaussian Splatting、流式几何与世界模型学习笔记。',
    slug: '2012RiemanNote',
    tags: ['3D Vision', 'Deep Learning'],
    published: true,
  },
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
    published: false,
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
  noteListByLocale[resolveLocale(locale)].filter((note) => note.published);

export const allNoteList: Array<Note> = noteListByLocale[FALLBACK_LOCALE];

// 保留向后兼容性
export const noteList: Array<Note> = getNotesByLocale(FALLBACK_LOCALE);
