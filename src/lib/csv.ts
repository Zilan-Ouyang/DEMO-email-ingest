export const makeCsv = (report: string[][]) => {
	const rows = report.map((row) => row.join(", "))
	const csv = rows.join("\n")

	return csv
}
