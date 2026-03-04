import { defineProject } from 'vitest/config'

const timeout = 60 * 1000

export default defineProject({
    test: {
        env: {
            NODE_ENV: 'test',
        },
        projects: [
            {
                extends: './vitest.config.mts',
                test: {
                    name: 'unit',
                    include: ['tests/unit/**/*.spec.ts'],
                },
            },
            {
                extends: './vitest.config.mts',
                test: {
                    name: 'integration',
                    include: ['tests/integration/**/*.spec.ts'],
                },
            },
        ],
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        globals: true,
        testTimeout: timeout,
        hookTimeout: timeout,
        exclude: ['node_modules', 'dist'],
    },
})
