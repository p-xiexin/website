// education 
export type EducationItemType = {
    school: string;
    major: string;
    image?: string;
    logo: string;
    start: string;
    end: string;
  };

type SupportedLocale = 'en' | 'zh';

const FALLBACK_LOCALE: SupportedLocale = 'zh';

const resolveLocale = (locale?: string): SupportedLocale =>
  locale?.toLowerCase() === 'en' ? 'en' : FALLBACK_LOCALE;

const selectByLocale = <T>(record: Record<SupportedLocale, T>, locale?: string): T =>
  record[resolveLocale(locale)];

export const educationByLocale: Record<SupportedLocale, Array<EducationItemType>> = {
  en: [
    {
      school: 'Huazhong University of Science and Technology',
      major: 'Control Science and Engineering',
      logo: 'college',
      start: '2024',
      end: 'Present',
    },
    {
      school: 'Wuhan University of Technology',
      major: 'Measurement and Control Technology',
      logo: 'college',
      start: '2020',
      end: '2024',
    },
  ],
  zh: [
    {
      school: '华中科技大学',
      major: '控制科学与工程',
      logo: 'college',
      start: '2024',
      end: '至今',
    },
    {
      school: '武汉理工大学',
      major: '测控技术与仪器',
      logo: 'college',
      start: '2020',
      end: '2024',
    },
  ],
};

export const getEducationByLocale = (locale?: string): Array<EducationItemType> =>
  selectByLocale(educationByLocale, locale);

// Backward compatibility for existing imports
export const educationList: Array<EducationItemType> = educationByLocale[FALLBACK_LOCALE];

