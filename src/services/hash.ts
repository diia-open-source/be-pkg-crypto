import { BinaryToTextEncoding, createHash, createHmac } from 'node:crypto'

export class HashService {
    hmac(data: string, secret: string, algorithm = 'sha512', encodeTo: BinaryToTextEncoding = 'hex'): string {
        const hash = createHmac(algorithm, secret)

        hash.update(data)

        return hash.digest(encodeTo)
    }

    hash(data: string, algorithm = 'sha512', encodeTo: BinaryToTextEncoding = 'hex'): string {
        const hash = createHash(algorithm)

        hash.update(data)

        return hash.digest(encodeTo)
    }
}
