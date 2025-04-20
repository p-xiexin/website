// career
export type CareerItemType = {
    company: string
    title: string
    image?: string
    logo: string
    start: string
    end: string
  }
  
export const careerList: Array<CareerItemType> = [
    {
      company: 'Pending',
      title: '',
      logo: 'college',
      start: 'Present',
      end: ''
    },
    // {
    //   company: 'Bigo Live',
    //   title: 'US Operations',
    //   logo: 'coffee',
    //   start: '2018',a
    //   end: '2020'
    // },
    // {
    //   company: 'Sinovation Ventures',
    //   title: 'Investment Analyst',
    //   logo: 'bank',
    //   start: '2017',
    //   end: '2018'
    // },
    // {
    //   company: 'Expedia',
    //   title: 'Software Engineer',
    //   logo: 'coffee',
    //   start: '2015',
    //   end: '2017'
    // }
  ]