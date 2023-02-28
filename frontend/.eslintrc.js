module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: ['google', 'eslint:recommended', 'prettier', 'plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'require-jsdoc': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error'
  }
};
