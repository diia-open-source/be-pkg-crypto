import { JwtServiceParams } from './jwt.js'

export interface AuthConfig {
    jwk?: string
    jwt?: JwtServiceParams
}
