import { makeCsv } from "@/lib/csv"
import { authorize, uploadCsv } from "@/lib/google-drive"
import { parseFlowdeskTransactionReport } from "@/lps/flowdesk"
import { parseWintermuteTransactionReport } from "@/lps/wintermute"
import bodyParser from "body-parser"
import crypto from "crypto"
import express, { type Request, type Response } from "express"
import multer from "multer"
import { buildSignature } from "./lib/mailgun"

const app = express()
const parser = bodyParser.urlencoded({ extended: true })
const upload = multer()

app.post("/flowdesk", upload.any(), async (req: Request, res: Response) => {
	console.log("Email reveived from Flowdesk")

	try {
		// Extract body
		const body = req.body
		if (!body) throw new Error("No request body")

		// Validate request
		const signature = buildSignature(body)
		if (signature !== body.signature) throw new Error("Invalid signature")

		// Parse input and generate CSV
		const report = await parseFlowdeskTransactionReport(req.files)
		const csv = makeCsv(report)

		// Save CSV to drive
		const driveClient = await authorize()
		const driveRes = await uploadCsv(driveClient, csv, `${Date.now()}_flowdesk`)

		if (driveRes.success) console.log("Uploaded CSV file to drive")
		else throw new Error("Failed to upload CSV file to drive")
	} catch (err: any) {
		// TODO Log error somewhere or push notification
		console.log(err.message)
	} finally {
		res.status(200).send()
	}
})

app.post("/wintermute", parser, async (req: Request, res: Response) => {
	console.log("Email received from Wintermute")

	try {
		// Extract body
		const body = req.body
		if (!body) throw new Error("No request body")

		// Validate request
		const signature = buildSignature(body)
		if (signature !== body.signature) throw new Error("Invalid signature")

		// Parse input and generate CSV
		const report = parseWintermuteTransactionReport(body["stripped-text"])
		const csv = makeCsv(report)

		// Save CSV to drive
		const driveClient = await authorize()
		const driveRes = await uploadCsv(driveClient, csv, `${Date.now()}_wintermute`)

		if (driveRes.success) console.log("Uploaded CSV file to drive")
		else throw new Error("Failed to upload CSV file to drive")
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
