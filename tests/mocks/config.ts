import { AuthConfig, JwtServiceParams } from '../../src/interfaces'

import { generateIdentifier } from './randomData'

export const config: AuthConfig = {
    jwk: generateIdentifier(),
    jwt: {
        privateKey: generateIdentifier(),
        publicKey: generateIdentifier(),
        tokenSignOptions: {
            algorithm: 'SHA256',
            expiresIn: '30m',
        },
        tokenVerifyOptions: {
            algorithms: ['SHA256'],
            ignoreExpiration: false,
        },
    },
}

export const jwtServiceParams: JwtServiceParams = {
    tokenVerifyOptions: {
        algorithms: ['RS256'],
        ignoreExpiration: true,
    },
    tokenSignOptions: {
        algorithm: 'RS256',
        expiresIn: '2h',
    },
    privateKey:
        '-----BEGIN RSA PRIVATE KEY-----\nMIIG4wIBAAKCAYEAtfwcuRGWz8YlGo4yRZLWg6mnVbEgLqshgXOyK/tn5JPUnlqW\nay4NWEkYEnKwZeXYykLRR5ThIE6FJwoJ5KjItTCdDrqXdFnGU+A+1QKbCZpHT3UW\no9W2jN2vsCzUfEF3xOTgb4tJzHHOOrv8OI6TKR2OxO3HO2hlSoLA64GM7qyScX7f\nLTxL3KWggQjKtsLs5smwPOu8NPZ+VpAUKy2qmV/bOq+yubc2OVLyzMLgUPA12A+m\n+XgCgC+YUS2ym21Ezw0X9YqtNwB3jXwdtnfWtNK9zHmSFtfNKomi4UlWfK84Qnem\nmJOqLyGl9ESUEeYuLrXUqL8vEypkh0bc40l2pE8BkYh3+43hXpLasREqR854DJTY\nfUZhB21W1mto7BXksBu8qLMmSXZDwKqnnnAdfZzlbevy44L92okMAwexDwhu1rHJ\naFXjadgbg2U4y+amCOfXpxO5nWq0HuJ7Ls3BN4yOWjZOO3l/dnTkuXsx/B5Q6PrH\nZ/fkIQ9Pwtla60NRAgMBAAECggGBAIsuzZzxieFQzxHXTTWOz0eVWmicdlubAJ4s\nKUmgFt5n/cY6zC4e44/xH1sEokrclohiwAK6J8/4nbe04soiGJcTHhuks68F9jwy\nFnv9aSvX9dAcYftduSdVaUgZkU2TGJHa5pgI9KFLLQoYuhdbW8unUojkvmp+NnHd\nPMUhqPLlw37QJMpJAlA30GC/o6JRxLPh70s4lBIBr7Busy4u1/pDqLzioZOOPwdq\nnE3kgYEFpnifx/mmQmtde2YiyCY9U4WKtkuYj0b5y9pDP3chbMm2d7n7s6AOCZ08\n23p5Frt0uUtK3EW1SsAZD3dP6cHjr23p4nTC1CbmO88FAGKZp4y5JeECjDR5MWah\nFXcFsgijlT1ZivIzlD8/W+SBKBZQPRU4cgLKd+C1RGKKPaVZ8Dt06cNRrsy9eaiP\nmHvdr4VYb8mXXQ1t4inyAADQo+txpPgcfDK4QQQ9Wc/7dCsvlCEHr3wCnoaRc8mF\nT4IoC9wvr0d6+cLC72SPPLez+PmXvQKBwQDyjbkDUzDP4ndKX7wNSs8WCLcVLupP\nsaHrWdd1fPEUQbKs6cFW7GJRhbbf0OEA9stquA7jPTDkU7YK2D6sSrG8zbbQRvQu\ngRxfvJjjQrwqsd4SBy9UbcWQRClC3nPvAKgfsK8ni7aP+1ZHqJUcIqChynqM0Xkt\nqSB9Naarcz5aVaCT7xEj0ZR6pYD5D2XZbV1iDYBCMMjT+Mh640h3bScsiDYqkmxq\n7Yk+/8hlabRfxeUC/TLTWA4lQBJ4v7zFqRMCgcEAwBLO3SObw8vdNvHG0mdXfqgv\n7kFy3Gxcs2Iw7f/Xn2rQ7yH/gXpqJ62Y/0zU348rmNzNWk5tva++dfjfznn3AFA7\nZWLkDjvquZka8N+KLWgJ9vbFMhFFoXuq4gVgiJIKM9U+0Mq2blQhjd+2sImNpRHK\nGJacbbUEg0sLg+lbcklkhXpw8YA6xWXHyw75mtuhZlqXtgK8V1ptDmTDiM3OrAuP\nBBap8tP0Umit055b2CKnMzLHON2f9bKkNv1YOnKLAoHAY3fzM4XeMqJwwTNZbyoK\nmsKgMjO3K09xU47YaPn/84qtt3N1MixmdYAcatTCMR8EdJNep5nkfv5FXVUo/obz\nNLY4DlnKsXeJJ0m0eR5ZBDlFFKeVpU4PAwaw1Rdc+9qNF9HhQpptF8a+r0xXOd6J\neVALycvtoegFxtNFsnHkVC9hVslnggTkmxdcOMczwWK0NQ3MV1iiQyt3K84hXbiJ\npB2H+RVrGL6o1gkXKV+b9Nq2++7R9RHbWzNXX+VhiL25AoHASfg0UHfBKhNd2yYb\nkrYXvQBajSAJcxgMT00WWOH5kTxawG1Qb/XL4gH59QAKzxndCV6newrPOojvCZHR\n5zuTQzyi0zXVbCHpEJcFCBSeq0Pw6no4kUKTlVACDE9T0OSlJzcNnO0kerLNxUyN\nl8kxkouaUAPYtGtNFJ8XDTMWc5oOK1VvH6Jpf9Hlsq7Os7O3oapr2L2O+PkrHKrz\nnsDbweglqMZtpsW3xvDnWKMY7dDSoWYB0UWQr9efZEoG62NnAoHABclcsfOzfkkc\nLdvFnPaz0nFROMOBbWsEck57lvA1wefIHz+bs7hpk6he81NAgwLhqyOBA1Z/LEKk\njo60+hfQ7Rz26J3sevjUoYhR1DVy9H4EIP8WhqOBU6LN63i1BT2GIkCvmN0QIWhA\noiXEqyEqw+/Svuca3czxEkCsyyWTM9mI1ucAzBR4TB6BpdsjN4s6m+qLuT8imBfA\nsKEq3nf3K3fus0G5W/tacqwk3rdRnGrZuG1ajRzGpK/CS43Oju9e\n-----END RSA PRIVATE KEY-----\n',
    publicKey:
        '-----BEGIN RSA PUBLIC KEY-----\nMIIBigKCAYEAtfwcuRGWz8YlGo4yRZLWg6mnVbEgLqshgXOyK/tn5JPUnlqWay4N\nWEkYEnKwZeXYykLRR5ThIE6FJwoJ5KjItTCdDrqXdFnGU+A+1QKbCZpHT3UWo9W2\njN2vsCzUfEF3xOTgb4tJzHHOOrv8OI6TKR2OxO3HO2hlSoLA64GM7qyScX7fLTxL\n3KWggQjKtsLs5smwPOu8NPZ+VpAUKy2qmV/bOq+yubc2OVLyzMLgUPA12A+m+XgC\ngC+YUS2ym21Ezw0X9YqtNwB3jXwdtnfWtNK9zHmSFtfNKomi4UlWfK84QnemmJOq\nLyGl9ESUEeYuLrXUqL8vEypkh0bc40l2pE8BkYh3+43hXpLasREqR854DJTYfUZh\nB21W1mto7BXksBu8qLMmSXZDwKqnnnAdfZzlbevy44L92okMAwexDwhu1rHJaFXj\nadgbg2U4y+amCOfXpxO5nWq0HuJ7Ls3BN4yOWjZOO3l/dnTkuXsx/B5Q6PrHZ/fk\nIQ9Pwtla60NRAgMBAAE=\n-----END RSA PUBLIC KEY-----\n',
}
