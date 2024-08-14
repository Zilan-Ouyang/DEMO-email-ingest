import express, { Request, Response } from "express"
import multer from "multer"
import { PdfReader } from "pdfreader"

const app = express()
const upload = multer()

app.get("/", (rew: Request, res: Response) => {
	res.status(200).send("Hello world")
})

app.post("/upload", upload.any(), async (req: Request, res: Response) => {
	const files = req.files

	if (files && Array.isArray(files)) {
		try {
			const contents: string[] = []

			new PdfReader().parseBuffer(files[0].buffer, (err, item) => {
				if (err) console.error("Error reading PDF:", err)
				else if (!item) console.log(contents.slice(10))
				else if (item.text) contents.push(item.text)
			})
		} catch (err: any) {
			console.log("Error reading PDF:", err.message)
		}
	} else {
		console.log("--- NO FILE ---")
	}

	res.status(200).send()
})

app.listen(3000, () => {
	console.log("Server is running on port 3000")
})
