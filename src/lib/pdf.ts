import { PdfReader } from "pdfreader"

/**
 * Reads file from Multer
 * @param files (Express.Multer.File) The file to be read
 * @returns (string[]) Array of file text
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
