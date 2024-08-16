import { generateCsv } from "@/lib/generate-csv"
import express, { Request, Response } from "express"
import multer from "multer"
import { PdfReader } from "pdfreader"
import { authorize, uploadFile } from "./lib/save-to-drive"

const app = express()
const upload = multer()

app.post("/upload", upload.any(), async (req: Request, res: Response) => {
	const files = req.files

	if (files && Array.isArray(files)) {
		try {
			const contents: string[] = []

			new PdfReader().parseBuffer(files[0].buffer, async (err, item) => {
				if (err) console.error("Error reading PDF:", err)
				else if (!item) {
					const csv = generateCsv(contents.slice(10))
					const driveClient = await authorize()
					const res = await uploadFile(driveClient, csv)
					if (res.success) console.log("Uploaded CSV file to drive")
					else console.log("Failed to upload CSV file to drive")
				} else if (item.text) contents.push(item.text)
			})
		} catch (err: any) {
			console.log("Error reading PDF:", err.message)
		}
	} else console.log("--- NO FILE ---")

	res.status(200).send()
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
