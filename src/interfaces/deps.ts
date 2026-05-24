import { AuthService, CryptoService, HashService, IdentifierService } from '../services/index.js'

export type CryptoDeps = {
    auth?: AuthService
    crypto?: CryptoService
    hash?: HashService
    identifier?: IdentifierService
}
