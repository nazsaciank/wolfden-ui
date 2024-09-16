import { getSeparatorDecimal, getSeparatorGroup } from "@wolfden-ui/system"

export class Parsers {
	static toString(value: any): any {
		return String(value)
	}

	static trim(value: any): any {
		if (typeof value === "string") return value.trim()
		return value
	}

	static toLowerCase(value: any): any {
		if (typeof value === "string") return value.toLowerCase()
		return value
	}

	static toUpperCase(value: any): any {
		if (typeof value === "string") return value.toUpperCase()
		return value
	}

	static toBoolean(value: any): any {
		if (value === "true") return true
		if (value === "false") return false
		if (value === 1) return true
		if (value === 0) return false
		return value
	}

	static toInteger(value: any): any {
		if (value === null || value === "") return value
		if (typeof value === "number") return Number(value.toFixed(0))
		if (typeof value === "string") {
			if (value.match(/^-?\d+$/)) return Number(value)
		}
		if (!isNaN(Number(value))) return Number(value.toFixed(0))
	}

	static toTimestamp(value: any): any {
		return new Date(value).getTime()
	}

	static parseNumber(locale: string = "en-US") {
		return function toNumberFn(value: any) {
			if (value === null || value === "") return value
			if (typeof value === "number") return value

			const separete = getSeparatorGroup(locale)
			const decimal = getSeparatorDecimal(locale)

			const onlyNumbers = new RegExp(`[^\\d${separete}${decimal}]`, "g")
			value = value.replaceAll(onlyNumbers, "")

			if (typeof value === "string") {
				value = value.replace(new RegExp(separete, "g"), "")
				value = value.replace(decimal, ".")
			}

			if (!isNaN(Number(value))) return Number(value)

			return value
		}
	}

	static parseDate(locale: string = "en-US", type: "date" | "time" | "datetime" = "date", timeZone: "UTC", returned: "date" | "timestamp" | "iso" | "string" = "date") {
		return function toDateFn(value: any) {
			if (value === null || value === "") return value
			// Obtenemos las opciones de formateo segun el tipo de formato

			let options: Intl.DateTimeFormatOptions
			if (type === "time") {
				options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone }
			} else if (type === "datetime") {
				options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone }
			} else {
				options = { day: "2-digit", month: "2-digit", year: "numeric", timeZone }
			}

			// Obtenemos las partes del formato
			const date = new Date()
			date.setHours(0, 0, 0, 0)
			const formater = new Intl.DateTimeFormat(locale, options)
			const patterns = formater.formatToParts(date).filter((p) => p.type !== "literal")

			// Obtenemos los indices de los valores que necesitamos formatear
			let idxDay = patterns.findIndex((part) => part.type === "day") + 1
			let idxMonth = patterns.findIndex((part) => part.type === "month") + 1
			let idxYear = patterns.findIndex((part) => part.type === "year") + 1
			let idxHour = patterns.findIndex((part) => part.type === "hour") + 1
			let idxMinute = patterns.findIndex((part) => part.type === "minute") + 1
			let idxSecond = patterns.findIndex((part) => part.type === "second") + 1

			// Generamos una expresion regular para validar el valor y generamos una lista con todos los literales que hay en el formato
			let regExMatch = patterns.reduce((acc, part, idx) => {
				if (part.type === "day") return `${acc}(\\d{0,2})`
				if (part.type === "month") return `${acc}(\\d{0,2})`
				if (part.type === "year") return `${acc}(\\d{0,4})`
				if (part.type === "hour") return `${acc}(\\d{0,2})`
				if (part.type === "minute") return `${acc}(\\d{0,2})`
				if (part.type === "second") return `${acc}(\\d{0,2})`
				return acc
			}, "")

			// Limpiamos el valor de los caracteres no numericos
			const cleaned = value.replace(/\D/g, "")
			const match = cleaned.match(new RegExp(regExMatch))
			if (!match) return cleaned

			// realizamos el formateo del valor
			for (let i = 0; i < patterns.length; i++) {
				const part = patterns[i]

				if (part.type === "second") {
					let second = match[idxSecond]
					if (!second) date.setSeconds(Number(second))
					continue
				}

				if (part.type === "minute") {
					let minute = match[idxMinute]
					if (!minute) date.setMinutes(Number(minute))
					continue
				}

				if (part.type === "hour") {
					let hour = match[idxHour]
					if (!hour) date.setHours(Number(hour))
					continue
				}

				if (part.type === "day") {
					let day = match[idxDay]
					if (!day) date.setDate(Number(day))
					continue
				}

				if (part.type === "month") {
					let month = match[idxMonth]
					if (!month) date.setMonth(Number(month) - 1)
					continue
				}

				if (part.type === "year") {
					let year = match[idxYear]
					if (!year) date.setFullYear(Number(year))
					continue
				}
			}

			if (returned === "iso") return date.toISOString()
			if (returned === "string") return date.toDateString()
			if (returned === "timestamp") return date.getTime()
			return date
		}
	}
}
