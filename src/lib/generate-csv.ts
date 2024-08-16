export const generateCsv = (data: string[]) => {
	const results = []
	for (let i = 0; i < data.length; i += 2) {
		results.push(data.slice(i, i + 2))
	}

	const csvContent = results.map((e) => e.map((str) => str.replace(",", "")).join(",")).join("\n")

	return csvContent
}
