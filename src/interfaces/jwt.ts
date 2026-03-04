export type { Jwt, JwtPayload, JwtHeader } from 'jsonwebtoken'

export interface JwtServiceParams {
    tokenVerifyOptions: TokenVerifyOptions
    tokenSignOptions?: TokenSignOptions
    privateKey?: string
    publicKey?: string
}

export interface TokenSignOptions {
    algorithm: string
    expiresIn: string
}

export type Algorithm =
    | 'HS256'
    | 'HS384'
    | 'HS512'
    | 'RS256'
    | 'RS384'
    | 'RS512'
    | 'ES256'
    | 'ES384'
    | 'ES512'
    | 'PS256'
    | 'PS384'
    | 'PS512'
    | 'none'

export interface TokenVerifyOptions {
    algorithms: Algorithm[]
    ignoreExpiration: boolean
}

export interface JwtToken {
    data: string
    exp?: number
    iat?: number
}
