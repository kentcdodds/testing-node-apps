import logger from 'loglevel'
import startServer from './start'

const isTest = process.env.NODE_ENV !== 'test'
const isProduction = process.env.NODE_ENV === 'production'
const logLevel = process.env.LOG_LEVEL || (isTest ? 'warn' : 'info')

logger.setLevel(logLevel)

startServer({port: isProduction ? process.env.PORT : undefined})
