import { mock } from 'vitest-mock-extended'

import Logger from '@diia-inhouse/diia-logger'
import { UnauthorizedError } from '@diia-inhouse/errors'
import { SessionType } from '@diia-inhouse/types'

import { AuthService, JwtToken } from '../../../src'
import { JweService } from '../../../src/services/jwe'
import { JwtService } from '../../../src/services/jwt'
import { config } from '../../mocks/config'
import { generateIdentifier, generateUuid } from '../../mocks/randomData'

vi.mock('../../../src/services/jwt', () => ({
    JwtService: class JwtServiceMock {
        decode(): unknown {
            return vi.fn()
        }

        decodeWithOptions(): unknown {
            return vi.fn()
        }

        sign(): unknown {
            return vi.fn()
        }

        verify(): unknown {
            return vi.fn()
        }
    },
}))

vi.mock('../../../src/services/jwe', () => ({
    JweService: class JweServiceMock {
        encryptJWE(): unknown {
            return vi.fn()
        }

        decryptJWE(): unknown {
            return vi.fn()
        }
    },
}))

describe(`${AuthService.name} service`, () => {
    const logger = mock<Logger>()

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

            vi.spyOn(JwtService.prototype, 'verify').mockReturnValue(encryptedData as unknown as JwtToken)
            vi.spyOn(JweService.prototype, 'decryptJWE').mockResolvedValue(expectedTokenData)
            vi.spyOn(JwtService.prototype, 'decode')

            const response = await authService.validate(token, sessionTypes, mobileUid)

            expect(response).toEqual(expectedTokenData)
            expect(JwtService.prototype.verify).toHaveBeenCalledWith(token)
            expect(JweService.prototype.decryptJWE).toHaveBeenCalledWith(encryptedData.data)
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
                vi.spyOn(JwtService.prototype, 'decode').mockReturnValue(encryptedData as unknown as JwtToken)
                vi.spyOn(JwtService.prototype, 'verify').mockReturnValue(encryptedData as unknown as JwtToken)
                vi.spyOn(JweService.prototype, 'decryptJWE').mockResolvedValue(tokenData)

                await expect(authService.validate(inputToken, sessionTypes, inputMobileUid, skipJwtVerification)).rejects.toEqual(
                    expectedError,
                )
                expect(logger.error).toHaveBeenCalledWith('Failed to validate verified JWT', { err: originError })
            },
        )

        it('should fail to validate token in case provided jwt token is malformed', async () => {
            const expectedError = new UnauthorizedError('Invalid token')
            const originError = new Error('jwt malformed')

            vi.spyOn(JwtService.prototype, 'decode').mockImplementationOnce(() => {
                throw originError
            })

            await expect(authService.validate(token, SessionType.User, mobileUid, true)).rejects.toEqual(expectedError)
            expect(logger.error).toHaveBeenCalledWith('Failed to validate verified JWT', { err: originError })
        })
    })

    describe('Method: `decodeToken`', () => {
        it('should successfully decode token', async () => {
            const expectedTokenData = { id: generateUuid() }
            const encodedTokenData = { data: 'encoded-content' }
            const token = generateIdentifier()
            const authService = new AuthService(config, logger).newInstance(config, logger)

            vi.spyOn(JwtService.prototype, 'decode').mockReturnValue(encodedTokenData as unknown as JwtToken)
            vi.spyOn(JweService.prototype, 'decryptJWE').mockResolvedValue(expectedTokenData)

            expect(await authService.decodeToken(token)).toEqual(expectedTokenData)
            expect(JwtService.prototype.decode).toHaveBeenCalledWith(token)
            expect(JweService.prototype.decryptJWE).toHaveBeenCalledWith(encodedTokenData.data)
        })

        it('should return null when payload is empty', async () => {
            const token = generateIdentifier()
            const authService = new AuthService(config, logger)

            vi.spyOn(JwtService.prototype, 'decode').mockReturnValue(null as unknown as JwtToken)

            expect(await authService.decodeToken(token)).toBeNull()
            expect(JwtService.prototype.decode).toHaveBeenCalledWith(token)
        })

        it('should fail to decode token in case configuration for jwt is not present', async () => {
            const token = generateIdentifier()
            const authService = new AuthService({ ...config, jwt: undefined }, logger)

            await expect(authService.decodeToken(token)).rejects.toEqual(new Error('Jwt config is not provided'))
        })
    })
    describe('Method: `getJweInJwt`', () => {
        it('should successfully encode data and put it into jwt', async () => {
            const expectedTokenData = 'some-encoded-data'
            const tokenData = { userIdentifier: generateIdentifier() }
            const authService = new AuthService(config, logger)

            vi.spyOn(JweService.prototype, 'encryptJWE').mockResolvedValue(expectedTokenData)
            vi.spyOn(JwtService.prototype, 'sign').mockReturnValue(expectedTokenData)

            expect(await authService.getJweInJwt(tokenData, '15m')).toEqual(expectedTokenData)
            expect(JweService.prototype.encryptJWE).toHaveBeenCalledWith(tokenData)
            expect(JwtService.prototype.sign).toHaveBeenCalledWith(expectedTokenData, '15m')
        })
    })

    describe('Method: `decodeTokenWithOptions`', () => {
        it('should successfully decode token', async () => {
            const expectedTokenData = {
                exp: 1728303679,
                jti: 'f2e52b7d-dca5-49a0-9809-e91a3230c7df',
            }
            const encodedTokenData = {
                exp: 1728303679,
                jti: 'f2e52b7d-dca5-49a0-9809-e91a3230c7df',
            }
            const token = generateIdentifier()
            const authService = new AuthService(config, logger)

            vi.spyOn(JwtService.prototype, 'decodeWithOptions').mockResolvedValue(encodedTokenData)
            const response = await authService.decodeTokenComplete(token)

            expect(response).toEqual(expectedTokenData)
            expect(JwtService.prototype.decodeWithOptions).toHaveBeenCalledWith(token, { complete: true })
        })

        it('should return null when payload is empty', async () => {
            const token = generateIdentifier()
            const authService = new AuthService(config, logger)

            vi.spyOn(JwtService.prototype, 'decodeWithOptions').mockReturnValueOnce(null)

            const response = authService.decodeTokenComplete(token)

            expect(response).toBeNull()
            expect(JwtService.prototype.decodeWithOptions).toHaveBeenCalledWith(token, { complete: true })
        })
    })
})
