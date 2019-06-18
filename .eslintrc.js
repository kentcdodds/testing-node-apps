module.exports = {
  extends: ['kentcdodds', 'kentcdodds/jest'],
  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
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
