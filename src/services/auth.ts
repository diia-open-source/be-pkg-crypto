import { UnauthorizedError } from '@diia-inhouse/errors'
import {
    AcquirerTokenData,
    CabinetUserTokenData,
    EResidentApplicantTokenData,
    EResidentTokenData,
    Logger,
    OnInit,
    PartnerTokenData,
    PortalUserTokenData,
    ServiceEntranceTokenData,
    ServiceUserTokenData,
    SessionType,
    TemporaryTokenData,
    TokenData,
    UserTokenData,
    VerifiedBaseTokenData,
} from '@diia-inhouse/types'
import { asserts } from '@diia-inhouse/utils'

import { AuthConfig } from '../interfaces'

import { JweService } from './jwe'
import { JwtService } from './jwt'

export class AuthService implements OnInit {
    private jwe: JweService | null = null

    private jwt: JwtService | null = null

    constructor(
        private readonly authConfig: AuthConfig,
        private readonly logger: Logger,
    ) {
        const { jwk, jwt } = this.authConfig
        if (jwk) {
            this.jwe = new JweService(jwk, logger)
        }

        if (jwt) {
            this.jwt = new JwtService(jwt)
        }
    }

    async onInit(): Promise<void> {
        await this.jwe?.onInit()
    }

    newInstance(authConfig: AuthConfig, logger: Logger): AuthService {
        return new AuthService(authConfig, logger)
    }

    async decodeToken(token: string): Promise<TokenData | null> {
        const payload = this.getJwtService().decode(token)
        if (payload) {
            return await this.decryptJWE(payload.data)
        }

        return null
    }

    async getJweInJwt(data: unknown, expiresIn?: string): Promise<string> {
        const enc: string = await this.encryptJWE(data)

        return await this.getJWT(enc, expiresIn)
    }

    async getJWT(enc: string, expiresIn?: string): Promise<string> {
        return this.getJwtService().sign(enc, expiresIn)
    }

    async encryptJWE(data: unknown): Promise<string> {
        return await this.getJweService().encryptJWE(data)
    }

    async decryptJWE<T = TokenData>(data: string): Promise<T> {
        return await this.getJweService().decryptJWE(data)
    }

    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.Acquirer,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<AcquirerTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.ServiceUser,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<ServiceUserTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.ServiceEntrance,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<ServiceEntranceTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.CabinetUser,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<CabinetUserTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.Temporary,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<TemporaryTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.EResident,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<EResidentTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.EResidentApplicant,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<EResidentApplicantTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.PortalUser,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<PortalUserTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.Partner,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<PartnerTokenData>>
    async validate(
        authToken: string | null,
        tokenSessionType: SessionType.User,
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<UserTokenData>>
    async validate<T extends TokenData = TokenData>(
        authToken: string | null,
        allowedSessionTypes: SessionType | SessionType[],
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<T>>
    async validate<T extends TokenData = TokenData>(
        authToken: string | null,
        allowedSessionTypes: SessionType | SessionType[],
        mobileUid?: string,
        skipJwtVerification?: boolean,
    ): Promise<VerifiedBaseTokenData<T>> {
        try {
            if (!authToken) {
                throw new UnauthorizedError()
            }

            const { data, exp, iat } = skipJwtVerification ? this.getJwtService().decode(authToken) : this.getJwtService().verify(authToken)

            if (!data) {
                throw new UnauthorizedError()
            }

            const tokenData = await this.decryptJWE<T>(data)
            const { sessionType: tokenSessionType } = tokenData
            const sessionTypes = Array.isArray(allowedSessionTypes) ? allowedSessionTypes : [allowedSessionTypes]

            if (!sessionTypes.includes(tokenSessionType)) {
                this.logger.log(`Invalid session type: actual - ${tokenSessionType}, expected - ${JSON.stringify(sessionTypes)}`)

                throw new UnauthorizedError(`Invalid session type`)
            }

            if (mobileUid && 'mobileUid' in tokenData && tokenData.mobileUid !== mobileUid) {
                throw new UnauthorizedError(`Mobile uid does not match: actual - ${tokenData.mobileUid}, expected - ${mobileUid}`)
            }

            asserts.isRefreshTokenExists(tokenData)

            return { ...tokenData, exp, iat }
        } catch (err) {
            this.logger.error('Failed to validate verified JWT', { err })
            let errMessage = ''

            if (err instanceof Error) {
                if (err.message === 'jwt malformed') {
                    errMessage = 'Invalid token'
                }
            }

            throw new UnauthorizedError(errMessage)
        }
    }

    private getJwtService(): JwtService {
        if (!this.jwt) {
            throw new Error('Jwt config is not provided')
        }

        return this.jwt
    }

    private getJweService(): JweService {
        if (!this.jwe) {
            throw new Error('JWK is not provided')
        }

        return this.jwe
    }
}
