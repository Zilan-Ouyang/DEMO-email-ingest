/**
 * Creates a CSV for Flowtraders transaction confirmation
 * @param data (string[]) Array of table entries from Flowtraders transaction confirmation
 * @returns (string) String formatted for CSV filetype that mimics table provided by Flowtraders transaction confirmation
 */
export const generateCsv = (data: string[]) => {
	const results = []
	for (let i = 0; i < data.length; i += 2) {
		results.push(data.slice(i, i + 2))
	}

	const csvContent = results.map((e) => e.map((str) => str.replace(",", "")).join(",")).join("\n")

	return csvContent
}
