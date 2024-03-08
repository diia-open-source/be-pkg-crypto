import { createHmac } from 'crypto'

export class HashService {
    hmac(data: string, secret: string, algorithm = 'sha512'): string {
        const hash = createHmac(algorithm, secret)

        hash.update(data)

        return hash.digest('hex')
    }
}
