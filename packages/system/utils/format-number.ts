export function formatNumber(value: string | number, locale: string | string[] = "en-US", format: `${number}.${number}-${number}` = "1.0-2") {
	if (value == null || value == undefined) return ""
	if (typeof value === "string") value = Number(value)
	if (isNaN(value)) return ""

	const [minIntDig, fracDig] = format.split(".")

	if (!minIntDig || !fracDig) throw new Error("Invalid digit format")

	const [minFracDig, maxFracDig] = fracDig.split("-")

	if (!minFracDig || !maxFracDig) throw new Error("Invalid digit format")

	return new Intl.NumberFormat(locale, {
		style: "decimal",
		useGrouping: true,
		minimumIntegerDigits: Number(minIntDig),
		minimumFractionDigits: Number(minFracDig),
		maximumFractionDigits: Number(maxFracDig),
	}).format(value)
}

export function getSeparatorGroup(locale: string | string[] = "en-US") {
	const number = new Intl.NumberFormat(locale).formatToParts(1000)
	const group = number.find((f) => f.type == "group")
	if (!group) return ""
	return group.value
}

export function getSeparetorDecimal(locale: string | string[] = "en-US") {
	const number = new Intl.NumberFormat(locale).formatToParts(1.1)
	const decimal = number.find((f) => f.type == "decimal")
	if (!decimal) return ""
	return decimal.value
}
