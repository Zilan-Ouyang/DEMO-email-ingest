/**
 *	Reads email body and creates array of values ready for CSV formatting
 * @param strippedText (string) Stripped text from email body
 * @returns (string[][]) Array of rows to be formatted into CSV
 */
export const parseWintermuteTransactionReport = (strippedText: string) => {
	if (typeof strippedText !== "string")
		throw new Error("Invalid stripped-text property on request body")

	// TODO if images or other media is attached to email, method will fail
	// TODO confirm structure of transaction report with Wintermute
	const bodyArr: string[] = strippedText.split("\r\n")
	const filteredBodyArr = bodyArr.filter((e) => e !== "")

	const report: string[][] = []

	const rawDate = filteredBodyArr[5].split(" ").slice(1).join(" ")
	const txInfo = filteredBodyArr[8].split(" ")

	const date = String(Math.floor(new Date(rawDate).getTime() / 1000))
	const side = txInfo[0] === "Sells" ? "SELL" : "BUY"
	const coin = txInfo[2]
	const quantity = parseFloat(txInfo[1].replace(/,/g, "")).toString()
	const price = txInfo[7]
	const settlementCurrency = txInfo[8]

	report.push(
		["LP", "Wintermute"],
		["Date", date],
		["Side", side],
		["Coin", coin],
		["Quantity", quantity],
		["Price", price],
		["Settlement Currency", settlementCurrency]
	)

	return report
}
