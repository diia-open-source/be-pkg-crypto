import { JwtServiceParams } from './jwt'

export interface AuthConfig {
    jwk?: string
    jwt?: JwtServiceParams
}
