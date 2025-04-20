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
      description: "This is the first notes.",
      slug: "CMake",
      tags: ["cmake", "cpp"],
      published: true
    },
    {
      name: "Git",
      description: "This is the second notes.",
      slug: "Git",
      tags: ["git"],
      published: true
    }
  ]
  