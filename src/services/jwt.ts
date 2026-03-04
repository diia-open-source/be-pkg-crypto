import { KeyObject } from 'node:crypto'

import * as jwt from 'jsonwebtoken'
import { DecodeOptions, Jwt, JwtPayload, VerifyOptions, decode } from 'jsonwebtoken'

import { JwtServiceParams, JwtToken, TokenSignOptions, TokenVerifyOptions } from '../interfaces/jwt'

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
        return this.signPayload({ data }, expiresIn)
    }

    signPayload(payload: string | Buffer | object, expiresIn?: string): string {
        if (!this.privateKey) {
            throw new Error('Private key not provided to sign data')
        }

        const signOptions = { ...this.tokenSignOptions }
        if (expiresIn) {
            signOptions.expiresIn = expiresIn
        }

        return jwt.sign(payload, this.privateKey, signOptions as jwt.SignOptions)
    }

    verify(jwtToken: string): JwtToken {
        if (!this.publicKey) {
            throw new Error('Public key is not provided to verify jwt')
        }

        return jwt.verify(jwtToken, this.publicKey, this.tokenVerifyOptions) as JwtToken
    }

    verifyWithOptions(jwtToken: string, publicKey: KeyObject, options?: VerifyOptions & { complete?: true }): Jwt
    verifyWithOptions(jwtToken: string, publicKey: KeyObject, options?: VerifyOptions & { complete?: false }): JwtPayload | string
    verifyWithOptions(jwtToken: string, publicKey: KeyObject, options?: VerifyOptions): Jwt | JwtPayload | string {
        return jwt.verify(jwtToken, publicKey, options)
    }

    decode(token: string): JwtToken {
        return decode(token) as JwtToken
    }

    decodeWithOptions(token: string, options?: DecodeOptions & { complete: true }): null | Jwt
    decodeWithOptions(token: string, options?: DecodeOptions & { json: true }): null | JwtPayload
    decodeWithOptions(token: string, options?: DecodeOptions): null | JwtPayload | string {
        return decode(token, options)
    }
}
