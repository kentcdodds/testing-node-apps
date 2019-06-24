module.exports = {
  extends: ['kentcdodds', 'kentcdodds/jest'],
  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'babel/new-cap': 'off',
    'require-await': 'warn',
  },
  overrides: [
    {
      files: ['**/__tests__/**'],
      settings: {
        'import/resolver': {
          jest: {
            jestConfigFile: require.resolve('./test/jest.config.projects.js'),
          },
        },
      },
    },
  ],
}
