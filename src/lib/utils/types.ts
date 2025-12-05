export type Categories = 'Web' | 'RAG' | 'Linux' | 'LLM' | 'Algorithms' | 'SQL'

export type ColumnInfo = {
	name: string
	order?: number
	description?: string
}

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	author: string
	categories: Categories[]
	published: boolean
	column?: ColumnInfo
}

export type Note = {
	name: string
	description: string
	slug: string
	tags: string[]
	published: boolean
}
