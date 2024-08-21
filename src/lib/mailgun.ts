import crypto from "crypto"

export const buildSignature = (body: any) => {
	const apiKey = process.env.MAILGUN_API_KEY
	if (!apiKey) throw new Error("No Mailgun API key")

	const value = body.timestamp + body.token
	const signature = crypto.createHmac("sha256", apiKey).update(value).digest("hex")

	return signature
}
