import * as jwt from 'jsonwebtoken'
import { decode } from 'jsonwebtoken'

import { JwtServiceParams, JwtToken, TokenSignOptions, TokenVerifyOptions } from '../interfaces'

export class JwtService {
    private readonly privateKey: string | undefined

    private readonly publicKey: string | undefined

    private readonly tokenSignOptions: TokenSignOptions | undefined

    private readonly tokenVerifyOptions: TokenVerifyOptions

    constructor(jwtServiceConfig: JwtServiceParams) {
        const { privateKey, publicKey, tokenSignOptions, tokenVerifyOptions } = jwtServiceConfig

        this.privateKey = privateKey
        this.publicKey = publicKey
        this.tokenSignOptions = tokenSignOptions
        this.tokenVerifyOptions = tokenVerifyOptions
    }

    sign(data: string, expiresIn?: string): string {
        if (!this.privateKey) {
            throw new Error('Private key not provided to sign data')
        }

        const signOptions = { ...this.tokenSignOptions }
        if (expiresIn) {
            signOptions.expiresIn = expiresIn
        }

        return jwt.sign({ data }, this.privateKey, <jwt.SignOptions>signOptions)
    }

    verify(jwtToken: string): JwtToken {
        if (!this.publicKey) {
            throw new Error('Public key is not provided to verify jwt')
        }

        return <JwtToken>jwt.verify(jwtToken, this.publicKey, <jwt.VerifyOptions>this.tokenVerifyOptions)
    }

    decode(token: string): JwtToken {
        return <JwtToken>decode(token)
    }
}
