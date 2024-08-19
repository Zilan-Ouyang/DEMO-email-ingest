import { JWT } from "google-auth-library"
import { google } from "googleapis"

/**
 * Created a Google auth client approved for Google Drive API access
 * @returns (google.auth.JWT) JWT auth client
 */
export const authorize = async () => {
	const EMAIL = process.env.GOOGLE_CLIENT_EMAIL
	const KEY = process.env.GOOGLE_CLIENT_PRIVATE_KEY
	if (!EMAIL || !KEY) throw new Error("Missing required environment variables")
	const SCOPE = ["https://www.googleapis.com/auth/drive"]

	const authClient = new google.auth.JWT(EMAIL, undefined, KEY.replace(/\\n/g, "\n"), SCOPE)

	await authClient.authorize()

	return authClient
}

/**
 * Saves a file to Google Drive
 * @param authClient (google.auth.JWT) JWT auth client
 * @param csv (string) CSV formatted string to be saved to Google Drive
 * @returns (Promise<{ success: boolean, error?: string }>) Success status from API request
 */
export const uploadFile = async (authClient: JWT, csv: string) => {
	const drive = google.drive({ version: "v3", auth: authClient })

	const res = await drive.files.create({
		requestBody: {
			name: `${Date.now()}.csv`,
			parents: ["1iLA61lSXk9qTy7SxZmBnOKMtmLpVdZHY"]
		},
		media: {
			body: csv,
			mimeType: "text/csv"
		},
		fields: "id"
	})

	if (res.status !== 200) return { success: false, error: res.statusText }

	return { success: true }
}
