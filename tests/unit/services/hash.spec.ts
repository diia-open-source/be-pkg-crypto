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
})
