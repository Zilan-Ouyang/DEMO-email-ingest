import { generateCsv } from "@/lib/generate-csv"
import { readFiles } from "@/lib/read-files"
import { authorize, uploadFile } from "@/lib/save-to-drive"
import bodyParser from "body-parser"
import crypto from "crypto"
import express, { type Request, type Response } from "express"
import multer from "multer"

const app = express()
const parser = bodyParser.urlencoded({ extended: true })
const upload = multer()

app.post("/flowdesk", upload.any(), async (req: Request, res: Response) => {
	console.log("Email reveived")

	try {
		// Validate request
		const body = req.body
		if (!body) throw new Error("No request body")

		const apiKey = process.env.MAILGUN_API_KEY
		if (!apiKey) throw new Error("No Mailgun API key")

		const value = body.timestamp + body.token
		const hash = crypto.createHmac("sha256", apiKey).update(value).digest("hex")

		if (hash !== body.signature) throw new Error("Invalid signature")

		const files = req.files

		// Read in files from Mailgun
		readFiles(files, async (content) => {
			if (content.length === 0) throw new Error("No parsed data from PDF")

			// Extract table data from PDF text
			// Flowdesk table starton on text entry 10 and ends on final text entry
			const tableContent = content.slice(10)
			const csv = generateCsv(tableContent)

			// Create Google Drive client and save CSV string
			const driveClient = await authorize()
			const res = await uploadFile(driveClient, csv)

			if (res.success) console.log("Uploaded CSV file to drive")
			else throw new Error("Failed to upload CSV file to drive")
		})
	} catch (err: any) {
		// TODO Log error somewhere or push notification
		console.log(err.message)
	} finally {
		// Send 200 response regardless of outcome
		// This is done so Mailgun webhook doesn't retry endpoint
		res.status(200).send()
	}
})

app.post("/wintermute", parser, async (req: Request, res: Response) => {
	console.log("Email received")

	const body = req.body
	const bodyArr: string[] = body["stripped-text"].split("\r\n")
	const filteredBodyArr = bodyArr.filter((e) => e !== "")

	const csvArr: string[][] = []

	const dateStr = filteredBodyArr[5].split(" ").slice(1).join(" ")
	const date = Math.floor(new Date(dateStr).getTime() / 1000)

	csvArr.push(["Date", String(date)])

	const txInfo = filteredBodyArr[8].split(" ")
	const side = txInfo[0] === "Sells" ? "SELL" : "BUY"
	const coin = txInfo[2]
	const quantity = txInfo[1]
	const price = txInfo[7]
	const settlementCurrency = txInfo[8]
	csvArr.push(
		["Side", side],
		["Coin", coin],
		["Quantity", quantity],
		["Price", price],
		["Settlement Currency", settlementCurrency]
	)

	console.log(csvArr)

	res.status(200).send()
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
