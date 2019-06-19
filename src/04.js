import express from 'express'
import 'express-async-errors'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import detectPort from 'detect-port'
import LocalStrategy from 'passport-local'
import * as usersDB from './server/db/users'

function getAuthRouter() {
  const router = express.Router()
  router.post('/register')
  return router
}

function setupRoutes(app) {}

async function startServer({port = process.env.SERVER_PORT} = {}) {
  port = port || (await detectPort(8888))
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(passport.initialize())
  passport.use(getLocalStrategy())

  setupRoutes(app)

  return new Promise(resolve => {
    const server = app.listen(port, () => {
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

// function isPasswordAllowed(password) {
//   return (
//     password.length > 6 &&
//     // non-alphanumeric
//     /\W/.test(password) &&
//     // digit
//     /\d/.test(password) &&
//     // capital letter
//     /[A-Z]/.test(password) &&
//     // lowercase letter
//     /[a-z]/.test(password)
//   )
// }

const iterations = process.env.NODE_ENV === 'production' ? 100000 : 1

function isPasswordValid(password, {salt, hash}) {
  return (
    hash ===
    crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('hex')
  )
}

function getLocalStrategy() {
  return new LocalStrategy(async (username, password, done) => {
    let user
    try {
      user = await usersDB.readByUsername(username)
    } catch (error) {
      return done(error)
    }
    if (!user || !isPasswordValid(password)) {
      return done(null, false, {
        errors: {'username or password': 'is invalid'},
      })
    }
    return done(null, userToJSON(user))
  })
}

function userToJSON(user) {
  const hiddenKeys = ['exp', 'iat', 'hash', 'salt']
  return Object.entries(user).reduce((o, [key, value]) => {
    if (!hiddenKeys.includes(key)) {
      o[key] = value
    }
    return o
  }, {})
}

export default startServer
