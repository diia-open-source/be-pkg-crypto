import Logger from '@diia-inhouse/diia-logger'
import { mockClass } from '@diia-inhouse/test'

import { AuthService, CryptoService, HashService } from '../../../src'
import { config } from '../../mocks/config'
import { generateUuid } from '../../mocks/randomData'

describe('CryptoService', () => {
    const MockedLogger = mockClass(Logger)
    const logger: Logger = new MockedLogger()

    const authService = new AuthService(config, logger)
    const hashService = new HashService()
    const cryptoService = new CryptoService(authService, hashService)

    describe('method: `encryptData`', () => {
        it('should successfully encrypt data in case input data is string', async () => {
            const expectedEncryptedData = 'encrypted-data'

            jest.spyOn(authService, 'encryptJWE').mockResolvedValue(expectedEncryptedData)

            expect(await cryptoService.encryptData('data-to-encrypt')).toEqual({
                hashData: undefined,
                encryptedData: expectedEncryptedData,
            })
            expect(authService.encryptJWE).toHaveBeenCalledWith('data-to-encrypt')
        })

        it('should successfully encrypt data in case input data is object', async () => {
            const dataToEncrypt = { id: generateUuid(), data: 'data-to-encrypt' }
            const expectedEncryptedData = 'encrypted-data'
            const expectedHashData = 'hash-data'

            jest.spyOn(authService, 'encryptJWE').mockResolvedValue(expectedEncryptedData)
            jest.spyOn(hashService, 'hmac').mockReturnValue(expectedHashData)

            expect(await cryptoService.encryptData(dataToEncrypt)).toEqual({
                hashData: expectedHashData,
                encryptedData: expectedEncryptedData,
            })
            expect(authService.encryptJWE).toHaveBeenCalledWith(dataToEncrypt)
            expect(hashService.hmac).toHaveBeenCalledWith(JSON.stringify(dataToEncrypt), dataToEncrypt.id)
        })
    })

    describe('method: `decryptData`', () => {
        it('should successfully decrypt data', async () => {
            const encryptedData = 'encrypted-data'
            const expectedData = { data: 'data', id: generateUuid() }

            jest.spyOn(authService, 'decryptJWE').mockResolvedValue(expectedData)

            expect(await cryptoService.decryptData(encryptedData)).toEqual(expectedData)
            expect(authService.decryptJWE).toHaveBeenCalledWith(encryptedData)
        })
    })
})
