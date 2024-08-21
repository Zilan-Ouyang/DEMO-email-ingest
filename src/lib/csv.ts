/**
 * Creates a string ready to save as CSV
 * @param report (string[][]) Array of rows to be formatted into CSV
 * @returns CSV formatted string
 */
export const makeCsv = (report: string[][]) => {
	const rows = report.map((row) => row.join(", "))
	const csv = rows.join("\n")

	return csv
}
