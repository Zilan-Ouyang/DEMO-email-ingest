import { readPdf } from "@/lib/pdf"

export const parseFlowdeskTransactionReport = async (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
) => {
	if (!files) throw new Error("No files found")
	if (!Array.isArray(files)) throw new Error("Files not in array format")

	const fileArr = await readPdf(files[0])

	// TODO month and day may need to be switched - example is 7/09/2024
	// TODO date is set to "Receipt date" on transaction report - is this accurate enough?
	const [m, d, y] = fileArr[3].split("/")

	const date = String(
		Math.floor(new Date(parseFloat(y), parseFloat(m), parseFloat(d)).getTime() / 1000)
	)
	const coin = fileArr[13]
	const side = fileArr[15]
	const quantity = parseFloat(fileArr[17].replace(/,/g, "")).toString()
	const price = parseFloat(fileArr[19].replace(/,/g, "")).toString()
	const settlementCurrency = fileArr[21]
	const notional = parseFloat(fileArr[23].replace(/,/g, "")).toString()

	const report: string[][] = []
	report.push(
		["LP", "Flowdesk"],
		["Date", date],
		["Coin", coin],
		["Side", side],
		["Quantity", quantity],
		["Price", price],
		["Settlement Currency", settlementCurrency],
		["Notional", notional]
	)

	return report
}
