import { JwtService } from '../../../src'
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

    it('should decode token', () => {
        const jwtService = new JwtService(jwtServiceParams)
        const data = { field: 10 }
        const token = jwtService.sign(JSON.stringify(data))
        const result = jwtService.decode(token)

        expect(JSON.parse(result.data)).toEqual(data)
    })
})
