type DisplayByte = "n" | "s" | "l"

export function formatByte(value: string | number, locale: string | string[] = "en-US", format: `${DisplayByte} ${number}.${number}-${number}` = "n 1.0-2") {
	if (value == null || value == undefined) return ""
	if (typeof value === "string") value = Number(value)
	if (isNaN(value)) return ""

	const [display, digitInfo] = format.split(" ")

	let unitDisplay: "narrow" | "short" | "long" | undefined
	if (display === "n") unitDisplay = "narrow"
	if (display === "s") unitDisplay = "short"
	if (display === "l") unitDisplay = "long"

	if (!unitDisplay) throw new Error("Invalid display format")

	const [minIntDig, fracDig] = digitInfo.split(".")

	if (!minIntDig || !fracDig) throw new Error("Invalid digit format")

	const [minFracDig, maxFracDig] = fracDig.split("-")

	if (!minFracDig || !maxFracDig) throw new Error("Invalid digit format")

	return new Intl.NumberFormat(locale, {
		notation: "compact",
		style: "unit",
		unit: "byte",
		unitDisplay,
		minimumIntegerDigits: Number(minIntDig),
		minimumFractionDigits: Number(minFracDig),
		maximumFractionDigits: Number(maxFracDig),
	}).format(value)
}
