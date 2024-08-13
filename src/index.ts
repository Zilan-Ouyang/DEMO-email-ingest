import express, { Request, Response } from "express"
import multer from "multer"
import { PdfReader } from "pdfreader"

const app = express()
const upload = multer()

app.get("/", (rew: Request, res: Response) => {
	res.status(200).send("Hello world")
})

app.post("/upload", upload.any(), async (req: Request, res: Response) => {
	console.log("EMAIL RECEIVED")

	const files = req.files
	console.log("Files:", files)

	if (files && Array.isArray(files)) {
		try {
			console.log("test")
			new PdfReader().parseBuffer(files[0].buffer, (err, item) => {
				if (err) console.error("Error reading PDF:", err)
				else if (!item) console.warn("end of buffer")
				else if (item.text) console.log(item.text)
			})
		} catch (err: any) {
			console.log("ERROR: ", err.message)
		}
	} else {
		console.log("No file")
	}

	// if (file && file.buffer) {
	// 	const results: (string | Buffer)[] = []
	// 	const readStream = fs.createReadStream(file.buffer)

	// 	readStream.on("open", () => {
	// 		console.log("PDF file stream opened successfully")
	// 	})

	// 	readStream.on("data", (chunk) => {
	// 		console.log("Reading chunk:", chunk)
	// 		results.push(chunk)
	// 	})

	// 	readStream.on("end", () => {
	// 		console.log("Finished reading the PDF file")
	// 		console.log(results)

	// 	})

	// 	readStream.on("error", (err) => {
	// 		console.error("An error occurred while reading the PDF file:", err)

	// 		res.status(500).send(err.message)
	// 	})
	// }

	res.status(200).send()
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
