export function classnames(...args: Array<string | object | boolean | undefined>): string {
	return args
		.map((arg) => {
			if (typeof arg === "undefined") return null
			if (typeof arg === "boolean") return arg
			if (typeof arg === "string") return arg
			if (Array.isArray(arg)) return classnames(...arg)
			return Object.entries(arg)
				.map(([key, value]) => (value ? key : null))
				.filter(Boolean)
				.join(" ")
		})
		.filter(Boolean)
		.join(" ")
}
