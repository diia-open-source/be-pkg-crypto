import { createPublicKey } from 'node:crypto'

import { JwtService, JwtToken } from '../../../src'
import { jwtServiceParams } from '../../mocks/config'

describe(`${JwtService.name} service`, () => {
    it('should throw an error if public key is not provided', () => {
        const jwtService = new JwtService({ ...jwtServiceParams, publicKey: undefined })

        expect(() => jwtService.verify('token')).toThrow('Public key is not provided to verify jwt')
    })

    it('should throw an error if private key is not provided', () => {
        const jwtService = new JwtService({ ...jwtServiceParams, privateKey: undefined })

        expect(() => jwtService.sign('data')).toThrow('Private key not provided to sign data')
    })

    it('should verify token', () => {
        const jwtService = new JwtService(jwtServiceParams)
        const data = { field: 10 }
        const token = jwtService.sign(JSON.stringify(data))
        const result = jwtService.verify(token)

        expect(JSON.parse(result.data)).toEqual(data)
    })

    it('should verify token with option', async () => {
        const jwtService = new JwtService(jwtServiceParams)
        const payload = { field: 10 }
        const token = jwtService.sign(JSON.stringify(payload))

        const publicKey = createPublicKey({
            key: jwtServiceParams.publicKey!,
            format: 'pem',
        })
        const result = await (jwtService.verifyWithOptions(token, publicKey, { algorithms: ['RS256'] }) as unknown as JwtToken)

        expect(JSON.parse(result.data)).toEqual(payload)
    })

    it('should decode token', () => {
        const jwtService = new JwtService(jwtServiceParams)
        const data = { field: 10 }
        const token = jwtService.sign(JSON.stringify(data))
        const result = jwtService.decode(token)

        expect(JSON.parse(result.data)).toEqual(data)
    })
})
