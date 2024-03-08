import { DocumentDecryptedData, DocumentEncryptedDataResult } from '../interfaces/crypto'

import { AuthService } from './auth'
import { HashService } from './hash'

export class CryptoService {
    constructor(
        private readonly auth: AuthService,
        private readonly hash: HashService,
    ) {}

    async encryptData(dataToEncrypt: DocumentDecryptedData | string): Promise<DocumentEncryptedDataResult> {
        const hashData = typeof dataToEncrypt === 'object' ? this.generateHashData(dataToEncrypt) : undefined
        const encryptedData = await this.auth.encryptJWE(dataToEncrypt)

        return { hashData, encryptedData }
    }

    generateHashData(dataToEncrypt: DocumentDecryptedData): string {
        return this.hash.hmac(JSON.stringify(dataToEncrypt), dataToEncrypt.id)
    }

    async decryptData<T>(encryptedData: string): Promise<T> {
        return <T>(<unknown>this.auth.decryptJWE(encryptedData))
    }
}
