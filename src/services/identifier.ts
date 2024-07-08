// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { createHmac } from 'node:crypto'

import { IdentifierPrefix, SessionType } from '@diia-inhouse/types'

import { IdentifierConfig, IdentifierOps } from '../interfaces/identifier'

export class IdentifierService {
    private readonly salt: string

    constructor(identifierConfig: IdentifierConfig) {
        this.salt = identifierConfig.salt
    }

    createIdentifier(itn: string, ops: IdentifierOps = {}): string {
        const { customSalt, prefix = '' } = ops
        const hmac = createHmac('sha512', customSalt || this.salt)

        hmac.update(itn)

        const hash = hmac.digest('hex')

        return `${prefix}${hash}`
    }

    getSessionTypeFromIdentifier(userIdentifier: string): SessionType {
        if (userIdentifier.startsWith(IdentifierPrefix.EResidentApplicant)) {
            return SessionType.EResidentApplicant
        }

        if (userIdentifier.startsWith(IdentifierPrefix.EResident)) {
            return SessionType.EResident
        }

        return SessionType.User
    }
}
