export function formatPercent(value: string | number, locale: string | string[] = "en-US", format: `${number}.${number}-${number}` = "1.0-2") {
	if (value == null || value == undefined) return ""
	if (typeof value === "string") value = Number(value)
	if (isNaN(value)) return ""

	const [minIntDig, fracDig] = format.split(".")

	if (!minIntDig || !fracDig) throw new Error("Invalid digit format")

	const [minFracDig, maxFracDig] = fracDig.split("-")

	if (!minFracDig || !maxFracDig) throw new Error("Invalid digit format")

	const formattedParts = new Intl.NumberFormat(locale, {
		style: "percent",
		useGrouping: true,
		minimumIntegerDigits: Number(minIntDig),
		minimumFractionDigits: Number(minFracDig),
		maximumFractionDigits: Number(maxFracDig),
	}).formatToParts(value)

	return formattedParts
		.map((part) => {
			if (part.type === "literal" && part.value.trim() === "") return ""
			return part.value
		})
		.join()
}
