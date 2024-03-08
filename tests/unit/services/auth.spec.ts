import Logger from '@diia-inhouse/diia-logger'
import { UnauthorizedError } from '@diia-inhouse/errors'
import { mockClass } from '@diia-inhouse/test'
import { SessionType } from '@diia-inhouse/types'

import { AuthService } from '../../../src'
import { config } from '../../mocks/config'
import { generateIdentifier, generateUuid } from '../../mocks/randomData'

const MockedLogger = mockClass(Logger)

const jwtMock = {
    decode: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
}
const jweMock = {
    encryptJWE: jest.fn(),
    decryptJWE: jest.fn(),
}

jest.mock('../../../src/services/jwt', () => ({
    JwtService: function (): unknown {
        return jwtMock
    },
}))
jest.mock('../../../src/services/jwe', () => ({
    JweService: function (): unknown {
        return jweMock
    },
}))

describe(`${AuthService.name} service`, () => {
    const logger: Logger = new MockedLogger()

    describe('Method: `validate`', () => {
        const token = generateIdentifier()
        const refreshToken = generateIdentifier()
        const mobileUid = generateUuid()
        const incorrectMobileUid = generateUuid()
        const authService = new AuthService(config, logger)
        const allowedSessionTypes = [SessionType.Acquirer, SessionType.User, SessionType.Partner]

        it.each([
            ['single valid session type provided', SessionType.User],
            ['multiple valid session types provided', allowedSessionTypes],
        ])('should successfully validate token in case %s', async (_msg, sessionTypes) => {
            const expectedTokenData = { sessionType: SessionType.User, mobileUid, refreshToken }
            const encryptedData = { data: 'encrypted-data' }

            jwtMock.verify.mockReturnValue(encryptedData)
            jweMock.decryptJWE.mockResolvedValue(expectedTokenData)

            expect(await authService.validate(token, sessionTypes, mobileUid)).toEqual(expectedTokenData)
            expect(jwtMock.decode).not.toHaveBeenCalledWith(token)
            expect(jwtMock.verify).toHaveBeenCalledWith(token)
            expect(jweMock.decryptJWE).toHaveBeenCalledWith(encryptedData.data)
        })

        it.each([
            ['token is empty', '', mobileUid, SessionType.User, true, {}, {}, new UnauthorizedError(''), new UnauthorizedError()],
            [
                'jwt token data is empty',
                token,
                mobileUid,
                SessionType.User,
                true,
                { data: '' },
                {},
                new UnauthorizedError(''),
                new UnauthorizedError(),
            ],
            [
                'invalid session type',
                token,
                mobileUid,
                SessionType.User,
                true,
                { data: 'encrypted-data' },
                { sessionType: SessionType.Partner, refreshToken },
                new UnauthorizedError(''),
                new UnauthorizedError(`Invalid session type`),
            ],
            [
                'session type does not exists in allowed session types',
                token,
                mobileUid,
                allowedSessionTypes,
                true,
                { data: 'encrypted-data' },
                { sessionType: SessionType.ServiceUser, refreshToken },
                new UnauthorizedError(''),
                new UnauthorizedError(`Invalid session type`),
            ],
            [
                'mobile uid does not match',
                token,
                mobileUid,
                SessionType.User,
                false,
                { data: 'encrypted-data' },
                { sessionType: SessionType.User, mobileUid: incorrectMobileUid, refreshToken },
                new UnauthorizedError(''),
                new UnauthorizedError(`Mobile uid does not match: actual - ${incorrectMobileUid}, expected - ${mobileUid}`),
            ],
            [
                'refreshToken is missed',
                token,
                mobileUid,
                SessionType.User,
                false,
                { data: 'encrypted-data' },
                { sessionType: SessionType.User, mobileUid },
                new UnauthorizedError(''),
                new UnauthorizedError('RefreshToken does not exists'),
            ],
        ])(
            'should fail to validate token in case %s',
            async (
                _msg,
                inputToken,
                inputMobileUid,
                sessionTypes,
                skipJwtVerification,
                encryptedData,
                tokenData,
                expectedError,
                originError,
            ) => {
                jwtMock.decode.mockReturnValue(encryptedData)
                jwtMock.verify.mockReturnValue(encryptedData)
                jweMock.decryptJWE.mockResolvedValue(tokenData)

                await expect(async () => {
                    await authService.validate(inputToken, sessionTypes, inputMobileUid, skipJwtVerification)
                }).rejects.toEqual(expectedError)
                expect(logger.error).toHaveBeenCalledWith('Failed to validate verified JWT', { err: originError })
            },
        )

        it('should fail to validate token in case provided jwt token is malformed', async () => {
            const expectedError = new UnauthorizedError('Invalid token')
            const originError = new Error('jwt malformed')

            jwtMock.decode.mockImplementationOnce(() => {
                throw originError
            })

            await expect(async () => {
                await authService.validate(token, SessionType.User, mobileUid, true)
            }).rejects.toEqual(expectedError)
            expect(logger.error).toHaveBeenCalledWith('Failed to validate verified JWT', { err: originError })
        })
    })

    describe('Method: `decodeToken`', () => {
        it('should successfully decode token', async () => {
            const expectedTokenData = { id: generateUuid() }
            const encodedTokenData = { data: 'encoded-content' }
            const token = generateIdentifier()
            const authService = new AuthService(config, logger).newInstance(config, logger)

            jwtMock.decode.mockReturnValue(encodedTokenData)
            jweMock.decryptJWE.mockReturnValue(expectedTokenData)

            expect(await authService.decodeToken(token)).toEqual(expectedTokenData)
            expect(jwtMock.decode).toHaveBeenCalledWith(token)
            expect(jweMock.decryptJWE).toHaveBeenCalledWith(encodedTokenData.data)
        })

        it('should return null when payload is empty', async () => {
            const token = generateIdentifier()
            const authService = new AuthService(config, logger)

            jwtMock.decode.mockReturnValue(null)

            expect(await authService.decodeToken(token)).toBeNull()
            expect(jwtMock.decode).toHaveBeenCalledWith(token)
        })

        it('should fail to decode token in case configuration for jwt is not present', async () => {
            const token = generateIdentifier()
            const authService = new AuthService({ ...config, ...{ jwt: undefined } }, logger)

            await expect(async () => {
                await authService.decodeToken(token)
            }).rejects.toEqual(new Error('Jwt config is not provided'))
        })
    })
    describe('Method: `getJweInJwt`', () => {
        it('should successfully encode data and put it into jwt', async () => {
            const expectedTokenData = { payload: 'some-encoded-data' }
            const tokenData = { userIdentifier: generateIdentifier() }
            const authService = new AuthService(config, logger)

            jweMock.encryptJWE.mockResolvedValue(expectedTokenData.payload)
            jwtMock.sign.mockReturnValue(expectedTokenData)

            expect(await authService.getJweInJwt(tokenData, '15m')).toEqual(expectedTokenData)
            expect(jweMock.encryptJWE).toHaveBeenCalledWith(tokenData)
            expect(jwtMock.sign).toHaveBeenCalledWith(expectedTokenData.payload, '15m')
        })
    })
})
