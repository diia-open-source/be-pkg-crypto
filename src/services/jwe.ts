import { JWE, JWK } from 'node-jose'

import { Logger, OnInit, TokenData } from '@diia-inhouse/types'

import { JwtToken } from '../interfaces'

export class JweService implements OnInit {
    private key?: JWK.Key

    constructor(
        private jwkSecretData: string,
        private logger: Logger,
    ) {}

    async onInit(): Promise<void> {
        this.key = await JWK.asKey(this.jwkSecretData, 'json')
    }

    async encryptJWE(tokenData: unknown): Promise<string> {
        const dataToEncrypt = this.handleUriData(tokenData, encodeURIComponent)
        const enc = await JWE.createEncrypt({ format: 'compact' }, this.getKey()).update(JSON.stringify(dataToEncrypt)).final()

        return enc
    }

    async decryptJWE<T = TokenData>(data: JwtToken['data']): Promise<T> {
        const dec = await JWE.createDecrypt(this.getKey()).decrypt(data)
        const plainTokenData = JSON.parse(dec.plaintext.toString())
        const decodedTokenData = this.handleUriData(plainTokenData, decodeURIComponent)

        this.logger.debug('Token successfully decrypted', decodedTokenData)

        return decodedTokenData
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleUriData(data: any, uriHandler: (str: string) => string): any {
        switch (true) {
            case Array.isArray(data): {
                return data.map((item: unknown) => this.handleUriData(item, uriHandler))
            }
            case typeof data === 'boolean': {
                return data
            }
            case typeof data === 'object' && data !== null: {
                for (const [key, value] of Object.entries(data)) {
                    data[key] = this.handleUriData(value, uriHandler)
                }

                return data
            }
            case data === undefined: {
                return
            }
            default: {
                return uriHandler(data)
            }
        }
    }

    private getKey(): JWK.Key | never {
        if (!this.key) {
            throw new Error('JWK key is not defined!')
        }

        return this.key
    }
}
