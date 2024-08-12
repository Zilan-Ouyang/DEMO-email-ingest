import express, { Request, Response } from "express"
import multer from "multer"
import fs from "fs"

const app = express()
const upload = multer()

app.get("/", (rew: Request, res: Response) => {
	res.status(200).send("Hello world")
})

app.post("/upload", upload.any(), (req: Request, res: Response) => {
	// if (!req.file) {
	// 	return res.status(400).send("No file uploaded.")
	// }

	console.log("Email received:", req.body)
	// const files = req.files

	// const results: (string | Buffer)[] = []
	// const readStream = fs.createReadStream(req.file.path)

	// readStream.on("open", () => {
	// 	console.log("PDF file stream opened successfully")
	// })

	// readStream.on("data", (chunk) => {
	// 	console.log("Reading chunk:", chunk)
	// 	results.push(chunk)
	// })

	// readStream.on("end", () => {
	// 	console.log("Finished reading the PDF file")
	// 	console.log(results)

	// 	res.status(200).send("Ok")
	// })

	// readStream.on("error", (err) => {
	// 	console.error("An error occurred while reading the PDF file:", err)

	// 	res.status(500).send(err.message)
	// })

	res.status(200).send()
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
