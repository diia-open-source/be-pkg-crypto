export type DocumentDecryptedData = Record<string, unknown> & { id: string }

export interface DocumentEncryptedDataResult {
    hashData?: string
    encryptedData: string
}
