type DisplayThousand = "s" | "l"

export function formatThosand(value: string | number, locale: string | string[] = "en-US", format: `${DisplayThousand} ${number}.${number}-${number}` = "s 1.0-2") {
	if (value == null || value == undefined) return ""
	if (typeof value === "string") value = Number(value)
	if (isNaN(value)) return ""

	const [display, digitInfo] = format.split(" ")

	let compactDisplay: "short" | "long" | undefined
	if (display === "s") compactDisplay = "short"
	if (display === "l") compactDisplay = "long"

	if (!compactDisplay) throw new Error("Invalid display format")

	const [minIntDig, fracDig] = digitInfo.split(".")

	if (!minIntDig || !fracDig) throw new Error("Invalid digit format")

	const [minFracDig, maxFracDig] = fracDig.split("-")

	if (!minFracDig || !maxFracDig) throw new Error("Invalid digit format")

	return new Intl.NumberFormat(locale, {
		notation: "compact",
		style: "decimal",
		compactDisplay,
		minimumIntegerDigits: Number(minIntDig),
		minimumFractionDigits: Number(minFracDig),
		maximumFractionDigits: Number(maxFracDig),
	}).format(value)
}
