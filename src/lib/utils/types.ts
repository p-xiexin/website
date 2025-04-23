export type Categories = 'sveltekit' | 'RAG' | 'Linux' | 'LLM' | 'CUDA'

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	author: string
	categories: Categories[]
	published: boolean
}

export type Note = {
	name: string
	description: string
	slug: string
	tags: string[]
	published: boolean
}
