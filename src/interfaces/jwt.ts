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

export interface TokenVerifyOptions {
    algorithms: string[]
    ignoreExpiration: boolean
}

export interface JwtToken {
    data: string
    exp?: number
    iat?: number
}
