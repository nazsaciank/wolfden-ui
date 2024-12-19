type Sorted = {
	field: string
	order: "asc" | "desc" | null
}

export interface TableProps<T = any> {
	data?: T[]

	sorteable?: boolean

	sorted?: Sorted

	pagination?: boolean

	page?: number
}

export function useTable<T extends object>(props: TableProps<T>) {
	return null
}
