import { HashService } from '../../../src'

describe('HashService', () => {
    describe('method: `hmac`', () => {
        it('should successfully generate hash', () => {
            const hashService = new HashService()

            expect(hashService.hmac('data-to-hash', 'secret')).toBe(
                'a1019fa5941fe3ff726ff74feb7a954545c06623993e1a830622f1c8e0ea0a0f445f331df18c3d6509acaa547efa37d07aae61e75f18cbc178debd2c5a0015e2',
            )
        })
    })

    describe('method: `hash`', () => {
        const hashService = new HashService()

        it('should successfully generate hash from string', () => {
            expect(hashService.hash('data-to-hash')).toBe(
                '3f0094e7a69a362b8dda785bd7e6fd50161acb49b2e6b535bdf9d5410d0a085a2f18f2af97d52f144c5becefbea6894704a247e10d615904874f4dea71533896',
            )
        })

        it('should successfully generate hash from buffer', () => {
            const data = Buffer.from('data-to-hash')

            expect(hashService.hash(data)).toBe(hashService.hash('data-to-hash'))
        })

        it('should support custom algorithm for buffer', () => {
            const data = Buffer.from('data-to-hash')

            expect(hashService.hash(data, 'sha256')).toBe('a092ee67312ce839f157caebba6a011321ba13ecb9b6e8a6f4220590b4c2fd62')
        })
    })
})
