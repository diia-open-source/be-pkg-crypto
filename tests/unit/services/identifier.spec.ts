import { IdentifierPrefix, SessionType } from '@diia-inhouse/types'

import { IdentifierService } from '../../../src'

describe('IdentifierService', () => {
    const saltFromConfig = 'salt-from-config'
    const identifierService = new IdentifierService({ salt: saltFromConfig })

    describe('method: `createIdentifier`', () => {
        it.each([
            [
                'no ops',
                'data',
                undefined,
                'a4b0a8208fbed353252fbcd33338b3d5abf74838a294542fc810879bf0eaff90e5397ff528eb2f632dd90c5cc7fc81b5f5da2c8f3c839f82153e69c643f78f7a',
            ],
            [
                'custom salt is provided',
                'data',
                { customSalt: 'custom-salt' },
                '99c105ab70132cc8fc3c599e7420ed24db7c12aca84197a4e31ce6f73d54de29fed1ad2836538981462c4e545f0d6b22164984f0f84dd1c3e6f4fb5043abd360',
            ],
            [
                'prefix is provided',
                'data',
                { prefix: 'user:' },
                'user:a4b0a8208fbed353252fbcd33338b3d5abf74838a294542fc810879bf0eaff90e5397ff528eb2f632dd90c5cc7fc81b5f5da2c8f3c839f82153e69c643f78f7a',
            ],
            [
                'custom salt and prefix is provided',
                'data',
                { prefix: 'user:', customSalt: 'custom-salt' },
                'user:99c105ab70132cc8fc3c599e7420ed24db7c12aca84197a4e31ce6f73d54de29fed1ad2836538981462c4e545f0d6b22164984f0f84dd1c3e6f4fb5043abd360',
            ],
        ])('should create identifier in case %s', (_msg, data, ops, expected) => {
            expect(identifierService.createIdentifier(data, ops)).toEqual(expected)
        })
    })

    describe('method: `getSessionTypeFromIdentifier`', () => {
        it('should return SessionType.EResidentApplicant for user identifier starting with IdentifierPrefix.EResidentApplicant', () => {
            const userIdentifier = IdentifierPrefix.EResidentApplicant + 'someIdentifier'
            const sessionType = identifierService.getSessionTypeFromIdentifier(userIdentifier)

            expect(sessionType).toBe(SessionType.EResidentApplicant)
        })

        it('should return SessionType.EResident for user identifier starting with IdentifierPrefix.EResident', () => {
            const userIdentifier = IdentifierPrefix.EResident + 'someIdentifier'
            const sessionType = identifierService.getSessionTypeFromIdentifier(userIdentifier)

            expect(sessionType).toBe(SessionType.EResident)
        })

        it('should return SessionType.User for any other user identifier', () => {
            const userIdentifier = 'someIdentifier'
            const sessionType = identifierService.getSessionTypeFromIdentifier(userIdentifier)

            expect(sessionType).toBe(SessionType.User)
        })
    })
})
