import { browser } from '$app/environment';
import { derived } from 'svelte/store';
import { dictionary, init, locale as $locale } from 'svelte-i18n';
import type Education from './components/Education.svelte';

const DEFAULT_LOCALE = 'zh';
const STORAGE_KEY = 'locale';

const messages = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      blogs: 'Blogs',
    },
    ui: {
      menu: 'Menu',
      readMoreBlogs: 'Read more blogs',
      rights: 'All rights reserved.',
      searchPlaceholder: 'Search posts...',
      clearSearch: 'Clear search',
      allCategories: 'All Categories',
      clearAllFilters: 'Clear all filters',
      noPostsFound: 'No posts found',
      noPostsFoundDesc: 'Try adjusting your search terms or filters, or browse all posts',
      browseAllPosts: 'browse all posts',
      readBlog: 'Read blog',
      previous: 'Previous',
      next: 'Next',
    },
  },
  zh: {
    nav: {
      home: '首页',
      about: '关于',
      projects: '项目',
      blogs: '博客',
    },
    ui: {
      menu: '菜单',
      readMoreBlogs: '查看更多博客',
      rights: '版权所有。',
      searchPlaceholder: '搜索文章…',
      clearSearch: '清除搜索',
      allCategories: '全部分类',
      clearAllFilters: '清除所有筛选',
      noPostsFound: '未找到文章',
      noPostsFoundDesc: '尝试调整搜索词或筛选条件，或浏览全部文章',
      browseAllPosts: '浏览全部文章',
      readBlog: '阅读全文',
      previous: '上一页',
      next: '下一页',
    },
  },
};

const contentByLocale = {
  en: {
    home: {
      headline: 'Student at HUST.',
      introduction: [
        "Hi! My name is Peng Xiexin, and I'm currently a graduate student at HUST, focusing on the field of robotics",
        'I am passionate about artificial intelligence and robotics, especially in utilizing advanced technologies to enhance robot autonomy and intelligence',
      ],
      awardsHeadline: 'Awards & Honors',
      awardsIntro: 'Recognition for academic and professional achievements.',
      projectHeadline: 'Research & Projects',
      projectIntro: "Academic research and technical projects I've worked on.",
      activitiesHeadline: 'Hobbies & Volunteer',
      activitiesIntro: 'Personal interests and community contributions.',
      notesHeadline: 'NoteBooks',
      notesIntro: 'Studying notes',
      blogHeadline: "What I've thinking about.",
      blogIntro: "I've written something about Robotics, AI, programming and life.",
      work: "Work",
      education: "Education",
    },
    about: {
      pageTitle: 'About',
      headline: 'Who Are You and Why Should I Care?',
      // description: "I'm Spencer Sharp. I live in New York City, where I design the future.",
      paragraphs: [
        "Hi! My name is Peng Xiexin, and I'm currently a graduate student at HUST, focusing on the field of robotics",
        'I am passionate about artificial intelligence and robotics, especially in utilizing advanced technologies to enhance robot autonomy and intelligence.',
        "I started this blog to share the insights I learn every day. Most blogs focus on education in Artificial Intelligence and general computer science, while others share the life lessons I've learned.",
      ],
    },
    projects: {
      title: 'Projects',
      intro: "Academic research and technical projects I've worked on.",
      hobbiesTitle: 'Hobbies & Volunteer',
    },
    blogs: {
      title: 'Blogs',
      intro: "I've written something about Robotics, AI, programming and life.",
      notesHeadline: 'NoteBooks',
      notesIntro: 'Studying notes',
    },
  },
  zh: {
    home: {
      headline: '华中科技大学学生。',
      introduction: [
        '你好！我是彭谢昕，目前在华中科技大学读研，研究方向聚焦机器人控制。',
        '我对人工智能与机器人充满热情，尤其关注用先进技术提升机器人的自治与智能。',
      ],
      awardsHeadline: '奖项与荣誉',
      awardsIntro: '学术及专业方面获得的认可。',
      projectHeadline: '研究与项目',
      projectIntro: '我曾参与的学术研究与技术项目。',
      activitiesHeadline: '兴趣与志愿',
      activitiesIntro: '业余兴趣项目',
      notesHeadline: '学习笔记',
      notesIntro: '学习过程中的笔记与整理',
      blogHeadline: '我在思考的事情',
      blogIntro: '记录关于机器人、AI、编程的学习思考。',
      work: "工作",
      education: "教育",
    },
    about: {
      pageTitle: '关于',
      headline: '我是谁，我关注什么？',
      // description: '我是 Spencer Sharp，现居纽约，致力于设计未来。',
      paragraphs: [
        '你好！我是彭谢昕，目前在华中科技大学读研，研究方向聚焦机器人控制。',
        '我对人工智能与机器人充满热情，尤其关注用先进技术提升机器人的自治与智能。',
        '我开设这个博客分享日常所学，多数是人工智能与计算机的知识。',
      ],
    },
    projects: {
      title: '项目',
      intro: '我曾参与的学术研究与技术项目。',
      hobbiesTitle: '业余兴趣项目',
    },
    blogs: {
      title: '博客',
      intro: '记录关于机器人、AI、编程的思考。',
      notesHeadline: '学习笔记',
      notesIntro: '学习过程中的笔记与整理',
    },
  },
};

dictionary.set(messages);

init({
  fallbackLocale: DEFAULT_LOCALE,
  initialLocale: DEFAULT_LOCALE,
});

const getInitialLocale = (): string => {
  if (!browser) return DEFAULT_LOCALE;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const navLocale = navigator.language.toLowerCase();
  if (navLocale.startsWith('zh')) return 'zh';

  return DEFAULT_LOCALE;
};

export const setupI18n = (): void => {
  const initialLocale = getInitialLocale();
  $locale.set(initialLocale);

  if (browser) {
    localStorage.setItem(STORAGE_KEY, initialLocale);
  }
};

export const uiContent = derived($locale, (current: string | null | undefined) => {
  if (current && current in contentByLocale) {
    return contentByLocale[current as keyof typeof contentByLocale];
  }
  return contentByLocale[DEFAULT_LOCALE];
});

export const availableLocales = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
];
