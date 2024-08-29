module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'prettier/prettier': 'error'
        // Add your custom rules here
        //   'no-console': 'warn',
        //   'no-unused-vars': 'warn'
    }
};
