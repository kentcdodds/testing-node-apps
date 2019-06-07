module.exports = {
  extends: ['kentcdodds', 'kentcdodds/jest'],
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
