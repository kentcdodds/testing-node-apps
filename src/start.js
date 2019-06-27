import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import logger from 'loglevel'
import 'express-async-errors'
import {getLocalStrategy} from './utils/auth'
import errorMiddleware from './utils/error-middleware'
import getRouter from './routes'

function startServer({port = process.env.PORT} = {}) {
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(passport.initialize())
  passport.use(getLocalStrategy())

  const router = getRouter()
  app.use('/api', router)
  app.use(errorMiddleware)

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`)
      const originalClose = server.close.bind(server)
      server.close = () => {
        return new Promise(resolveClose => {
          originalClose(resolveClose)
        })
      }
      resolve(server)
    })
  })
}

export default startServer
