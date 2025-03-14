type FormatDateTime = "short" | "medium" | "long" | "full"
type FormatDate = "shortDate" | "mediumDate" | "longDate" | "fullDate"
type FormatTime = "shortTime" | "mediumTime" | "longTime" | "fullTime"

type FormatDateOptions<T extends string = any> = {
	[key in T]: Intl.DateTimeFormatOptions
}

type PatternDate = Record<
	string,
	{
		value: string
		config: Intl.DateTimeFormatOptions
	}[]
>

export const PATTERN_DATE: PatternDate = {
	era: [
		{ value: "GGG", config: { era: "long" } },
		{ value: "GG", config: { era: "narrow" } },
		{ value: "G", config: { era: "short" } },
	],
	years: [
		{ value: "yyyy", config: { year: "numeric" } },
		{ value: "yy", config: { year: "2-digit" } },
	],
	month: [
		{ value: "MMMMM", config: { month: "long" } },
		{ value: "MMMM", config: { month: "short" } },
		{ value: "MMM", config: { month: "narrow" } },
		{ value: "MM", config: { month: "2-digit" } },
		{ value: "M", config: { month: "numeric" } },
		// L
	],
	weekday: [
		{ value: "eee", config: { weekday: "long" } },
		{ value: "ee", config: { weekday: "short" } },
		{ value: "e", config: { weekday: "narrow" } },
	],
	day: [
		{ value: "dd", config: { day: "2-digit" } },
		{ value: "d", config: { day: "numeric" } },
	],
	dayPariod: [
		{ value: "bbb", config: { dayPeriod: "long" } },
		{ value: "bb", config: { dayPeriod: "narrow" } },
		{ value: "b", config: { dayPeriod: "short" } },
	],
	hour: [
		{ value: "HH", config: { hour: "2-digit", hour12: false } },
		{ value: "H", config: { hour: "numeric", hour12: false } },
		{ value: "hh", config: { hour: "2-digit", hour12: true } },
		{ value: "h", config: { hour: "numeric", hour12: true } },
	],
	minute: [
		{ value: "mm", config: { minute: "2-digit" } },
		{ value: "m", config: { minute: "numeric" } },
	],
	second: [
		{ value: "ss", config: { second: "2-digit" } },
		{ value: "s", config: { second: "numeric" } },
	],
	zone: [
		{ value: "zzz", config: { timeZoneName: "shortGeneric" } },
		{ value: "zz", config: { timeZoneName: "shortOffset" } },
		{ value: "z", config: { timeZoneName: "short" } },
		{ value: "ZZZ", config: { timeZoneName: "longGeneric" } },
		{ value: "ZZ", config: { timeZoneName: "longOffset" } },
		{ value: "Z", config: { timeZoneName: "long" } },
	],
}

const FORMAT_DATE_TIME: FormatDateOptions<FormatDateTime> = {
	short: {
		day: "numeric",
		month: "numeric",
		year: "2-digit",
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	},
	medium: {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	},
	long: {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "short",
		hour12: false,
	},
	full: {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "long",
		hour12: false,
	},
}

const FORMAT_DATE: FormatDateOptions<FormatDate> = {
	shortDate: {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
	},
	mediumDate: {
		day: "numeric",
		month: "short",
		year: "numeric",
	},
	longDate: {
		day: "numeric",
		month: "long",
		year: "numeric",
	},
	fullDate: {
		day: "numeric",
		month: "long",
		year: "numeric",
		weekday: "long",
	},
}

const FORMAT_TIME: FormatDateOptions<FormatTime> = {
	shortTime: {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	},
	mediumTime: {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	},
	longTime: {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "short",
		hour12: false,
	},
	fullTime: {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		timeZoneName: "long",
		hour12: false,
	},
}

const FORMAT: FormatDateOptions<FormatDateTime | FormatDate | FormatTime> = {
	...FORMAT_DATE_TIME,
	...FORMAT_DATE,
	...FORMAT_TIME,
}

export const formatDate = (value: number | string | Date, locale: string = "en-US", format: FormatDateTime | FormatDate | FormatTime | string = "shortDate", timeZone?: string) => {
	if (!value) return ""
	let opts: Intl.DateTimeFormatOptions = {}
	opts = FORMAT[format as FormatDateTime | FormatDate | FormatTime]

	if (!opts) opts = getFormatPattern(format)

	return new Intl.DateTimeFormat(locale, { ...opts, timeZone }).format(value instanceof Date ? value : new Date(value))
}

export const getMonthsList = (locale: string = "en-US", format: "short" | "narrow" | "long" | "numeric" | "2-digit" = "short") => {
	const months = []
	for (let i = 0; i < 12; i++) {
		const month = Intl.DateTimeFormat(locale, { month: format }).format(new Date(0, i))

		months.push(month)
	}
	return months
}

export const getWeekdaysList = (locale: string = "en-US", format: "short" | "narrow" | "long" = "short") => {
	const weekdays = []
	for (let i = 0; i < 7; i++) {
		const weekday = Intl.DateTimeFormat(locale, { weekday: format }).format(new Date(0, 0, i))

		weekdays.push(weekday)
	}
	return weekdays
}

export function getFormatPattern(pattern: string) {
	let options: Intl.DateTimeFormatOptions = {}
	Object.entries(PATTERN_DATE).forEach(([key, value]) => {
		for (const item of value) {
			if (!pattern.includes(item.value)) {
				options = { ...options, ...item.config }
				break
			}
		}
	})
	return options
}
