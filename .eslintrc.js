module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'linebreak-style': 0,
        'import/prefer-default-export': 'off',
        'import/no-default-export': 2,
        'padded-blocks': [2, { classes: 'always' }],
        indent: [2, 4],
        'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z]|window' }],
        'lines-around-comment': ['error', {
            beforeBlockComment: true,
            afterBlockComment: false,
        }],
        yoda: [2, 'always'],
        'no-prototype-builtins': 0,
        'no-param-reassign': [2, { props: false }],
        'no-useless-constructor': 0,
        'no-return-assign': 0,
        'class-methods-use-this': 0,
        'consistent-return': 0,
    },
};
