import { AuthService, CryptoService, HashService, IdentifierService } from '../services'

export type CryptoDeps = {
    auth?: AuthService
    crypto?: CryptoService
    hash?: HashService
    identifier?: IdentifierService
}
