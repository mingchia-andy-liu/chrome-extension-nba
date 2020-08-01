module.exports = {
  env: {
    browser: true,
    es2020: true,
    webextensions: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  rules: {
    'comma-dangle': 0,
    camelcase: 0,
    eqeqeq: 0,
    'standard/no-callback-literal': 0
  }
}
