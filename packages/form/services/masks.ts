import { formatNumber, getSeparatorDecimal } from "@wolfden-ui/system"

export class Masks {
	static toCapitalize(value: string) {
		return value
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	static toLowerCase(value: string) {
		return value.toLowerCase()
	}

	static toUpperCase(value: string) {
		return value.toUpperCase()
	}

	static toTrim(value: string) {
		return value.trim()
	}

	static toInt(allowNegative: boolean = true) {
		return function toIntFn(value: string) {
			let str = ("" + value).replace(/[^0-9]/g, "")
			const clean = new RegExp(`(${allowNegative ? "-?" : ""}\\d+)`)
			const match = str.match(clean)
			if (match) return match[0]

			return str
		}
	}

	static toFloat(fractionDigits: number = 2, allowNegative: boolean = true) {
		return function toFloatFn(value: string) {
			let str = ("" + value).replace(/[^0-9.]/g, "")
			const clean = new RegExp(`(${allowNegative ? "-?" : ""}\\d+\\.?\\d{0,${fractionDigits}})`)
			const match = str.match(clean)
			if (match) return match[0]

			return str
		}
	}

	static pattern(pattern: RegExp) {
		return function patternFn(value: any) {
			if (value === null || value === "") return value
			const cleaned = ("" + value).replace(pattern, "")
			return cleaned
		}
	}

	static formatNumber(locale: string = "en-US", digitInfo: `${number}.${number}-${number}` = "1.0-2", allowNegative: boolean = true) {
		return function formatNumberFn(value: string | number) {
			if (typeof value === "number") return formatNumber(value, locale, digitInfo)
			if (value === null || value === "") return value

			const decimalSeparator = getSeparatorDecimal(locale)

			// Obtenemos los valores de digitInfo
			const [minIntDig, fracDig] = digitInfo.split(".")
			if (!minIntDig || !fracDig) throw new Error("Invalid digit format")
			const [minFracDig, maxFracDig] = fracDig.split("-")
			if (!minFracDig || !maxFracDig || Number(minFracDig) > Number(maxFracDig)) throw new Error("Invalid digit format")

			// Removemos todos los caracteres que no sean numeros, separadores, simbolos de negativos
			let clean = new RegExp(`[^\\d${Number(maxFracDig) > 0 ? decimalSeparator : ""}${allowNegative ? "-" : ""}]`, "g")
			value = String(value).replace(clean, "")

			// Eliminamos todos los negativos de mas
			if (value.includes("-")) value = `-${value.replace(/-/g, "")}`
			// Si solamente se ingreso un negativo, lo dejamos como esta
			if (value.startsWith("-") && value.charAt(1) === "") return value

			// Eliminamos todos los decimalSeparetor de mas
			if (value.includes(decimalSeparator)) {
				const [integer, decimal] = value.split(decimalSeparator)
				value = `${integer}${decimalSeparator}${decimal.replace(new RegExp(`${decimalSeparator}`, "g"), "")}`
			}

			// Eliminamos todos los separadores de decimales de mas
			if (decimalSeparator !== "." && value.includes(decimalSeparator)) value = value.replace(new RegExp(`${decimalSeparator}`, "g"), ".")

			// Si el ultimo caracter es un separador de decimales, lo dejamos como esta
			if (value.endsWith(".")) return `${formatNumber(value, locale, digitInfo)}${decimalSeparator}`

			// Si el valor contiene un separacion de decimal y ademas el ultimo numero es un cero, lo dejamos como esta
			if (value.includes(".") && value.endsWith("0")) {
				const [integer, decimal] = value.split(".")
				return `${formatNumber(integer, locale, digitInfo)}${decimalSeparator}${decimal.slice(0, Number(maxFracDig))}`
			}

			return formatNumber(value, locale, digitInfo)
		}
	}

	static formatDate(locale: string = "en-US", type: "date" | "time" | "datetime" = "date") {
		return function formatDateFn(next: string, prev?: string) {
			if (!next) return ""

			// Obtenemos las opciones de formateo segun el tipo de formato
			let options: Intl.DateTimeFormatOptions
			if (type === "time") {
				options = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }
			} else if (type === "datetime") {
				options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }
			} else {
				options = { day: "2-digit", month: "2-digit", year: "numeric" }
			}

			// Obtenemos las partes del formato
			const formater = new Intl.DateTimeFormat(locale, options)
			const patterns = formater.formatToParts()

			// Obtenemos los indices de los valores que necesitamos formatear
			let idxDay = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "day") + 1
			let idxMonth = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "month") + 1
			let idxYear = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "year") + 1
			let idxHour = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "hour") + 1
			let idxMinute = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "minute") + 1
			let idxSecond = patterns.filter((p) => p.type !== "literal").findIndex((part) => part.type === "second") + 1

			// Generamos una expresion regular para validar el valor y generamos una lista con todos los literales que hay en el formato
			let literals: Array<string> = []
			let regExMatch = patterns.reduce((acc, part, idx) => {
				if (part.type === "day") return `${acc}(\\d{0,2})`
				if (part.type === "month") return `${acc}(\\d{0,2})`
				if (part.type === "year") return `${acc}(\\d{0,4})`
				if (part.type === "hour") return `${acc}(\\d{0,2})`
				if (part.type === "minute") return `${acc}(\\d{0,2})`
				if (part.type === "second") return `${acc}(\\d{0,2})`
				if (part.type === "literal" && !literals.includes(part.value)) {
					literals.push(part.value)
					return acc
				}
				return acc
			}, "")

			// Contamos la cantidad de literales que existen en el valor previo y el valor actual
			let countNext = 0
			let countPrev = 0
			let literalsEndPrev: string = ""
			for (let i = 0; i < next.length; i++) {
				let literal = literals.find((literal) => literal.includes(next.charAt(i)))!
				if (literal) countNext++
			}

			if (prev) {
				for (let i = 0; i < prev.length; i++) {
					let literal = literals.find((literal) => literal.includes(prev.charAt(i)))!
					if (literal) {
						countPrev++
						literalsEndPrev = literal
					}
				}
			}
			// Si la cantidad de literales en el valor previo es mayor que en el valor actual, eliminamos la ultima literal + el valor previo al literal
			if (countNext < countPrev) next = next.slice(0, next.length - literalsEndPrev.length)

			// Limpiamos el valor de los caracteres no numericos
			const cleaned = next.replace(/\D/g, "")
			const match = cleaned.match(new RegExp(regExMatch))
			if (!match) return cleaned

			// realizamos el formateo del valor
			let formatted = ""
			for (let i = 0; i < patterns.length; i++) {
				const part = patterns[i]

				if (part.type === "second") {
					let second = match[idxSecond]
					if (!second) break

					if (second.length === 1) {
						if (Number(second) <= 5) {
							formatted += second
							break
						}
						if (Number(second) > 5 && Number(second) <= 9) {
							formatted += `0${second}`
							continue
						}
					}

					if (second.length === 2) {
						if (Number(second) > 59) second = "59"
						formatted += second
					}

					continue
				}

				if (part.type === "minute") {
					let minute = match[idxMinute]
					if (!minute) break

					if (minute.length === 1) {
						if (Number(minute) <= 5) {
							formatted += minute
							break
						}
						if (Number(minute) > 5 && Number(minute) <= 9) {
							formatted += `0${minute}`
							continue
						}
					}

					if (minute.length === 2) {
						if (Number(minute) > 59) minute = "59"
						formatted += minute
					}

					continue
				}

				if (part.type === "hour") {
					let hour = match[idxHour]
					if (!hour) break

					if (hour.length === 1) {
						if (Number(hour) <= 2) {
							formatted += hour
							break
						}
						if (Number(hour) > 2 && Number(hour) <= 9) {
							formatted += `0${hour}`
							continue
						}
					}

					if (hour.length === 2) {
						if (Number(hour) > 23) hour = "23"
						formatted += hour
					}

					continue
				}

				if (part.type === "day") {
					let day = match[idxDay]
					if (!day) break

					if (day.length === 1) {
						if (Number(day) <= 3) {
							formatted += day
							break
						}
						if (Number(day) > 3 && Number(day) <= 9) {
							formatted += `0${day}`
							continue
						}
					}

					if (day.length === 2) {
						if (Number(day) > 31) day = "31"
						formatted += day
					}

					continue
				}

				if (part.type === "month") {
					let month = match[idxMonth]
					if (!month) break

					if (month.length === 1) {
						if (Number(month) <= 1) {
							formatted += month
							break
						}
						if (Number(month) > 1 && Number(month) <= 9) {
							formatted += `0${month}`
							continue
						}
					}

					if (month.length === 2) {
						if (Number(month) > 12) month = "12"
						formatted += month
					}
					continue
				}

				if (part.type === "year") {
					let year = match[idxYear]
					if (!year) break

					if (year.length < 4) {
						formatted += year
						break
					}
					formatted += year
					continue
				}

				formatted += part.value
			}

			return formatted
		}
	}
}
