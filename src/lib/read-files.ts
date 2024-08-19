import { PdfReader } from "pdfreader"

/**
 * Reads first file of Multer files input
 * @param files ({ [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined) The files to be read
 * @param callback ((content: string[]) => void) Callback with desired action to be taken with parsed file
 */
export const readFiles = (
	files: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined,
	callback: (content: string[]) => void
) => {
	if (!files) throw new Error("No files found")

	if (!Array.isArray(files)) throw new Error("Files not in array format")

	const contents: string[] = []

	new PdfReader().parseBuffer(files[0].buffer, async (err, item) => {
		if (err) throw new Error(`Error reading PDF: ${err}`)
		if (!item) callback(contents)
		else if (item?.text) contents.push(item.text)
	})
}
