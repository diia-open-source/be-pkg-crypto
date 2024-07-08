// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { randomBytes, randomUUID } from 'node:crypto'

export function generateIdentifier(length = 12): string {
    return randomBytes(length).toString('hex')
}

export function generateUuid(): string {
    return randomUUID()
}
