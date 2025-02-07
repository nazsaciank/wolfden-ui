export type DisplayCurrency = "s" | "sn" | "c" | "n"

export function formatCurrency(value: string | number, currency: string, locale: string | string[] = "en-US", format: `${DisplayCurrency} ${number}.${number}-${number}` = "c 1.0-2") {
	if (value == undefined || value == null || !currency) return ""
	if (typeof value === "string") value = Number(value)
	if (isNaN(value)) return ""
	let [display, digitInfo] = format.split(" ")

	let currencyDisplay: "symbol" | "narrowSymbol" | "code" | "name" | undefined
	if (display === "s") currencyDisplay = "symbol"
	if (display === "sn") currencyDisplay = "narrowSymbol"
	if (display === "c") currencyDisplay = "code"
	if (display === "n") currencyDisplay = "name"

	if (!currencyDisplay) throw new Error("Invalid display format")

	const [minIntDig, fracDig] = digitInfo.split(".")

	if (!minIntDig || !fracDig) throw new Error("Invalid digit format")

	const [minFracDig, maxFracDig] = fracDig.split("-")

	if (!minFracDig || !maxFracDig) throw new Error("Invalid digit format")

	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		currencyDisplay,
		useGrouping: true,
		minimumIntegerDigits: Number(minIntDig),
		minimumFractionDigits: Number(minFracDig),
		maximumFractionDigits: Number(maxFracDig),
	}).format(value)
}

export function getCurrencySymbol(locale: string | string[] = "en-US", currency: string, narrow: boolean = false) {
	const number = Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		currencyDisplay: narrow ? "narrowSymbol" : "symbol",
	}).formatToParts(1)

	return number.find((part) => part.type === "currency")?.value || ""
}

export function getCurrencyCode(locale: string | string[] = "en-US", currency: string) {
	const number = Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		currencyDisplay: "code",
	}).formatToParts(1)

	return number.find((part) => part.type === "currency")?.value || ""
}

export function getCurrencyName(locale: string = "en-US", currency: string) {
	return new Intl.DisplayNames(locale, { type: "currency" }).of(currency)
}
