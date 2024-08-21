import { readPdf } from "@/lib/pdf"

export const parseFlowdeskTransactionReport = async (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
) => {
	if (!files) throw new Error("No files found")
	if (!Array.isArray(files)) throw new Error("Files not in array format")

	const fileArr = await readPdf(files[0])

	const [m, d, y] = fileArr[3].split("/")

	const date = String(Math.floor(new Date(`${y}-${m}-${d}T00:00:00Z`).getTime() / 1000))
	const coin = fileArr[13]
	const side = fileArr[15]
	const quantity = fileArr[17]
	const price = fileArr[19]
	const settlementCurrency = fileArr[21]
	const notional = fileArr[23]

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
