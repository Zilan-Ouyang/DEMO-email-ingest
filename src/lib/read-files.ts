import { PdfReader } from "pdfreader"

export const readFiles = (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined
) => {
	if (!files) throw new Error("No files found")

	if (!Array.isArray(files)) throw new Error("Files not in array format")

	const contents: string[] = []

	new PdfReader().parseBuffer(files[0].buffer, async (err, item) => {
		if (err) throw new Error(`Error reading PDF: ${err}`)
		else if (item?.text) contents.push(item.text)
	})

	return contents
}
