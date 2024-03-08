import DiiaLogger from '@diia-inhouse/diia-logger'

import { JweService } from '../../../src'

describe(`${JweService.name} service`, () => {
    const jwk =
        '{"p":"4N6E2rW-RDMjGu3yyyYFQCMU2YRBp7GMIvr7zHk-rNPttWuSj63qpmBPyihGBzwnZrKO1sZOXKskuPIqp2pR-1GrgwhVV03CIFrmLixbWE6MmQR8Yec0tyJN4Ltu501SXdVoR6a6VTw5s671uJH6lS24guRN9Gqf3IRyGJKSY88","kty":"RSA","q":"3ncjDTwnLfKV2hf7QyFFdP-kuhkaMqhSjJ0xEptEyA0nWVsnsP7vleZzZ7r6b8ZPi3pbXfMuW5rXMiiQSy2zI075c4M2aGy-pwBuTtnVc9NEYhnLIAJLfOsSyJojfUU7ZaDzYN7vVTKw8ZxM6CpVQ0DO_Ovlc-2HQxMVpPnwOzc","d":"WvB0ruIjp6E6_qhTtHcrqYtCd7nUrtclIbYfOhygc0-hfKt7YWXksNJTHyFa4zCICd8DIbJkafhSMwrJyJ_zwStyXlbw2ar6tl9XatbsdyU1eMKRiKoCAQyOqShR5qcXRgbM8sOfokp4-HZuvJezibKWmVT0ex9LYr44AhPFWquQUNzis-Daytq5uPGAe92_PwrX0TNWucwEXtksO_lF53eJWK65Xz4iIKSTNbb8KxnoR3nqvTpYkFQdsT6KvnCzQu2F3el1hwm25bYpFVHL4AcBdYE3XDAHPV-j-ffXmvV80O4odQlQwWYOUx6Uqlhb-1L9igfWCl0g9mST6k9w3Q","e":"AQAB","use":"enc","qi":"okTUd98XdKN2PZ93vGsXLcsV_anakdF2K4lxg-_WJ1x34fhXxvyHsBtfJ0M74bWQUJEWXQnB8Hkg-6iRDmVtqK94l0xCGDRzYSE-_dSe4FZEg0QWGQFo1QrjVjml6TUMLEeuJORbEImwG_o4DC8AvoG4FcHXnsYsVTGb2aV5swE","dp":"UIsjZvtGBUOTxWeJWX5qzwhBxY97vMb5fOYNHrYm3tyh_iNjwZb3v1QsACrgumKvcjdutjsdgk_CvYPwBzsr1irwleR8POMbL1-fptY4ea7Y6U4UBzU7SoU9A8ve83ZclEOGMHPltfX2bQez98JB0QEpX6jKy0sNq3y9KVQGnz0","dq":"rtuFuYlmYj8ieeIPpJwqM-QcXgoNBXQ4Lj3_rFhOn8929k0nzX8UYgZY_1eAMQr2yvLJjfbuoSH7s3kesXiiLUaN27VutnWDBVDZYzDlDb0pKtKLTgV_wBglE3fUHUqlfSQdKC8Sfyzw13e7G2Dq04nFKBdiqtQwVRBTGvE5WdE","n":"w2mdb3eSse_9cobOX-WtqeNgpShEofa3YFhgfwMz5diKGJFyXy289PzRfF-r93eULXxpZcDHidsvw2fYejojWNLycT4DrnqReXdIByvNDPt7II8_6WZ3vKMA6Zr7arNsagv-kcUlhxBv5WdYWjxz4O1xqJ4eiXhtzpMQch5_fM3OlMdAv5sVSymuYyK4t0yuV-ZdRAaY6i5PZJVqdYP7_Z_lii8rUBssIAGVilSVaZLd38_TiPBKiiFFRdNZGyzyAN4_m5BYD9gQgNEd1-xmC9UKB6FelhqklxehcwP29Q4I0JLREL6oHTxZCd0wH_Zat2UZxWJr4TlBruT9I4QmeQ"}'
    const jweService = new JweService(jwk, new DiiaLogger())

    it('should throw an error if key is not provided', async () => {
        await expect(jweService.encryptJWE({ field: 10 })).rejects.toThrow('JWK key is not defined!')
    })

    it('should encrypt/decrypt 10 times in a row', async () => {
        await jweService.onInit()

        for (let i = 0; i < 10; i++) {
            const data = { field: i }
            const encrypted = await jweService.encryptJWE(data)
            const decrypted = await jweService.decryptJWE<typeof data>(encrypted)

            expect(decrypted).toEqual(data)
        }
    })
})
