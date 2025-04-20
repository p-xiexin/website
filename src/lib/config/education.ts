
// education 
export type EducationItemType = {
    school: string
    major: string
    image?: string
    logo: string
    start: string
    end: string
  }
  
  
  
  export const educationList: Array<EducationItemType> = [
    {
      school: 'Huazhong University of Science and Technology',
      major: 'Control Science and Engineering',
      logo: 'college',
      start: '2024',
      end: 'Present'
    },
    {
      school: 'Wuhan University of Technology',
      major: 'Measurement and Control Technology',
      logo: 'college',
      start: '2020',
      end: '2024'
    },
  ]