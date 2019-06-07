const path = require('path')

module.exports = {
  displayName: 'final',
  roots: [path.join(__dirname, '../src')],
  rootDir: path.join(__dirname, '..'),
  testEnvironment: 'node',
  testMatch: ['**/exercises-final/*.test.js'],
  moduleDirectories: ['node_modules', __dirname],
  coverageDirectory: path.join(__dirname, '../coverage/final'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['.*/exercises-?.*/.*'],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}
