const path = require('path')

module.exports = {
  coverageDirectory: path.join(__dirname, '../coverage/collective'),
  projects: [
    require.resolve('./test/jest.config.exercises'),
    require.resolve('./test/jest.config.final'),
  ],
  watchPlugins: [
    require.resolve('jest-watch-select-projects'),
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}
