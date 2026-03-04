import diiaConfig from '@diia-inhouse/eslint-config'

/**  @type {import('eslint').Linter.Config}  */
export default [
    ...diiaConfig,
    {
        ignores: ['*.js', '*.mjs', '**/*.js', 'node_modules', 'dist', 'coverage'],
    },

    {
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './tests/tsconfig.json'],
                ecmaVersion: 2022,
                sourceType: `module`,
            },
        },
    },
]
