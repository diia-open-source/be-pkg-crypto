// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { createHmac } from 'node:crypto'

export class HashService {
    hmac(data: string, secret: string, algorithm = 'sha512'): string {
        const hash = createHmac(algorithm, secret)

        hash.update(data)

        return hash.digest('hex')
    }
}
