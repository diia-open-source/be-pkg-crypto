export interface IdentifierConfig {
    salt: string
}

export interface IdentifierOps {
    customSalt?: string
    prefix?: string
}
