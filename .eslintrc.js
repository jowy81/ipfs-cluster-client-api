module.exports = {
    env: {
      node: true,
      es2021: true
    },
    extends: [
      'standard',
      'plugin:prettier/recommended'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'prettier/prettier': 'error'
    }
  };