import { randomBytes, randomUUID } from 'crypto'

export function generateIdentifier(length = 12): string {
    return randomBytes(length).toString('hex')
}

export function generateUuid(): string {
    return randomUUID()
}
