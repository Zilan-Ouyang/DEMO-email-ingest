import fs from "fs"
import { google } from "googleapis"

export const authorize = async () => {
	const SCOPE = ["https://www.googleapis.com/auth/drive"]

	const authClient = new google.auth.JWT(
		process.env.GOOGLE_CLIENT_EMAIL,
		undefined,
		process.env.GOOGLE_CLIENT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
		SCOPE
	)

	await authClient.authorize()

	return authClient
}

// TODO Add type to param
export const uploadFile = async (authClient: any, csv: string) => {
	const drive = google.drive({ version: "v3", auth: authClient })

	const fileMetaData = {
		name: "mydrivetest.csv",
		parents: ["1iLA61lSXk9qTy7SxZmBnOKMtmLpVdZHY"] // A folder ID to which file will get uploaded
	}

	const res = await drive.files.create({
		requestBody: fileMetaData,
		media: {
			body: csv,
			mimeType: "text/csv"
		},
		fields: "id"
	})

	if (res.status !== 200) return { success: false, error: res.statusText }

	return { success: true }
}
