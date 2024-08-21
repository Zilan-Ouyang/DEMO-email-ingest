import crypto from "crypto"

/**
 * Creates decrypted signature to be compared with request signature for security
 * @param body (any) Request body
 * @returns (string) Value that should equal signature included in request body
 */
export const buildSignature = (body: any) => {
	const apiKey = process.env.MAILGUN_API_KEY
	if (!apiKey) throw new Error("No Mailgun API key")

	const value = body.timestamp + body.token
	const signature = crypto.createHmac("sha256", apiKey).update(value).digest("hex")

	return signature
}
