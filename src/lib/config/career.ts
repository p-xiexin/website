// career
export type CareerItemType = {
    company: string;
    title: string;
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

export const careerByLocale: Record<SupportedLocale, Array<CareerItemType>> = {
  en: [
    {
      company: 'Pending',
      title: '',
      logo: 'college',
      start: 'Present',
      end: '',
    },
  ],
  zh: [
    {
      company: '待更新',
      title: '',
      logo: 'college',
      start: '至今',
      end: '',
    },
  ],
};

export const getCareerByLocale = (locale?: string): Array<CareerItemType> =>
  selectByLocale(careerByLocale, locale);

// Backward compatibility for existing imports
export const careerList: Array<CareerItemType> = careerByLocale[FALLBACK_LOCALE];

