;(async () => {
  require('@babel/register')
  const dbUtils = require('./test/utils/db-utils')
  await dbUtils.initDb()
  await dbUtils.insertTestUser()
  require('./src')
})()
