import type { Note } from "$lib/utils/types"

// export type Note = {
// 	name: string
// 	description: string
// 	slug: string
// 	tags: string[]
// 	published: boolean
// }


export const noteList: Array<Note> = [
    {
      name: "CMake",
      description: "学习CMake的基本使用方法，并构建一个简单的CPP工程.",
      slug: "CMake",
      tags: ["cmake", "cpp"],
      published: true
    },
    {
      name: "Git",
      description: "Git版本控制工具的使用",
      slug: "Git",
      tags: ["git"],
      published: true
    },
    {
      name: "SLAM",
      description: "包含视觉SLAM十四讲，VIO原理和基本的数学优化方法",
      slug: "SLAM",
      tags: ["SLAM"],
      published: true
    }
  ]
  
