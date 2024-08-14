export const generateCsv = (data: string[]) => {
	const results = []
	for (let i = 0; i < data.length; i += 2) {
		results.push(data.slice(i, i + 2))
	}

	const csvContent = "data:text/csv;charset=utf-8," + results.map((e) => e.join(",")).join("\n")

	return csvContent
}
