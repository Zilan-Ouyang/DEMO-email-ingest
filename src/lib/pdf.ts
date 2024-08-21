import { PdfReader } from "pdfreader"

/**
 * Reads first file of Multer files input
 * @param files ({ [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[] | undefined) The files to be read
 * @param callback ((content: string[]) => void) Callback with desired action to be taken with parsed file
 */
export const readPdf = (file: Express.Multer.File) => {
	return new Promise<string[]>((resolve, reject) => {
		const contents: string[] = []

		new PdfReader().parseBuffer(file.buffer, async (err, item) => {
			if (err) reject(`Error reading PDF: ${err}`)
			if (!item) resolve(contents)
			else if (item?.text) contents.push(item.text)
		})
	})
}
