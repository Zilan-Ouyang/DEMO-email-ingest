import { generateCsv } from "@/lib/generate-csv"
import express, { type Request, type Response } from "express"
import multer from "multer"
import { authorize, uploadFile } from "./lib/save-to-drive"
import { readFiles } from "./lib/read-files"
import * as crypto from "crypto"

const app = express()
const upload = multer()

app.post("/upload", upload.any(), async (req: Request, res: Response) => {
	console.log("Received message")

	try {
		const body = req.body
		if (!body) throw new Error("No request body")

		const apiKey = process.env.MAILGUN_API_KEY
		if (!apiKey) throw new Error("No Mailgun API key")

		const value = body.timestamp + body.token
		const hash = crypto.createHmac("sha256", apiKey).update(value).digest("hex")

		if (hash !== body.signature) throw new Error("Invalid signature")

		const files = req.files

		readFiles(files, async (content) => {
			if (content.length === 0) throw new Error("No parsed data from PDF")

			const tableContent = content.slice(10)
			const csv = generateCsv(tableContent)

			const driveClient = await authorize()
			const res = await uploadFile(driveClient, csv)

			if (res.success) console.log("Uploaded CSV file to drive")
			else throw new Error("Failed to upload CSV file to drive")
		})
	} catch (err: any) {
		// TODO Log error somewhere or push notification
		console.log(err.message)
	} finally {
		res.status(200).send()
	}
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
