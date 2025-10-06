import crypto from 'crypto'
import { ENCRYPTION_KEY } from '../config/env.js';

const algorithm = 'aes-256-cbc'

// Use uma chave de 32 bytes (256 bits) — gere com `crypto.randomBytes(32).toString('hex')`
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY inválida ou ausente');
}
const key = Buffer.from(ENCRYPTION_KEY, 'hex');

export const encrypt = (text) => {
	const iv = crypto.randomBytes(16) // 16 bytes = 128 bits
	const cipher = crypto.createCipheriv(algorithm, key, iv)
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
	return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (encryptedText) => {
	const [ivHex, encryptedData] = encryptedText.split(':')
	const iv = Buffer.from(ivHex, 'hex')
	const encrypted = Buffer.from(encryptedData, 'hex')
	const decipher = crypto.createDecipheriv(algorithm, key, iv)
	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
	return decrypted.toString('utf8')
}
