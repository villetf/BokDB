import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

new FlatCompat({
   baseDirectory: import.meta.url,
});

export default [
   js.configs.recommended,
   {
      files: ['**/*.js', '**/*.cjs'],
      languageOptions: {
         ecmaVersion: 'latest',
         sourceType: 'module',
      },
      environment: {
         commonjs: true,
         es2021: true,
         node: true,
      },
      rules: {
         'no-multiple-empty-lines': ['error', { max: 3, maxBOF: 0 }],
         quotes: ['error', 'single'],
         indent: ['error', 3],
         'no-var': 'error',
         'prefer-const': 'error',
         semi: ['warn', 'always'],
         'space-before-function-paren': ['error', 'never'],
         'block-spacing': ['error', 'never'],
         'no-unused-vars': 'warn',
         'no-trailing-spaces': 'error',
         'brace-style': ['error', '1tbs'],
         'no-self-compare': 'error',
         camelcase: 'error',
         'capitalized-comments': [
            'error',
            'always',
            { ignorePattern: '.*.js$', ignoreConsecutiveComments: true },
         ],
         curly: ['error', 'all'],
         'dot-notation': 'warn',
         'id-length': ['warn', { min: 2, max: 25, exceptions: ['i'] }],
         'max-depth': ['warn', { max: 4 }],
         'multiline-comment-style': ['error', 'separate-lines'],
         'no-else-return': 'error',
         'no-inline-comments': 'warn',
         'no-lone-blocks': 'error',
         'no-lonely-if': 'error',
         'no-mixed-operators': 'error',
         'no-multi-assign': 'error',
         'no-useless-catch': 'error',
         'no-useless-return': 'error',
         'prefer-regex-literals': 'error',
         'spaced-comment': ['error', 'always'],
         'arrow-spacing': ['error', { before: true, after: true }],
         'comma-spacing': 'error',
         'comma-style': 'error',
         'func-call-spacing': 'error',
         'function-call-argument-newline': ['error', 'never'],
         'implicit-arrow-linebreak': 'error',
         'key-spacing': 'error',
         'keyword-spacing': 'error',
         'lines-around-comment': ['error', { beforeLineComment: true }],
         'max-len': [
            'error',
            {
               code: 150,
               ignoreComments: true,
               ignoreUrls: true,
               ignoreStrings: true,
               ignoreTemplateLiterals: true,
            },
         ],
         'no-multi-spaces': 'error',
         'no-whitespace-before-property': 'error',
         'semi-spacing': 'error',
         'space-before-blocks': 'error',
         'wrap-regex': 'error',
      },
   },
   {
      files: ['.eslintrc.js', '.eslintrc.cjs'],
      languageOptions: {
         sourceType: 'script',
      },
   },
];