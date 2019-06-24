import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import logger from 'loglevel'
import 'express-async-errors'
import detectPort from 'detect-port'
import {getLocalStrategy} from './utils/auth'
import getRouter from './routes'

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error)
  } else {
    res.status(500)
    res.json({error})
  }
}

async function startServer({port = process.env.SERVER_PORT} = {}) {
  port = port || (await detectPort(8888))
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(passport.initialize())
  passport.use(getLocalStrategy())

  const router = getRouter()
  app.use('/api', router)
  app.use(errorHandler)

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
