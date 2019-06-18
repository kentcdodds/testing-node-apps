import jwt from 'jsonwebtoken'
import log from './app/logging-service'
import * as usersDB from './app/db/users'

async function setUser(req, res) {
  const auth = req.get('Authorization') || ''
  const [, token] = auth.split('Bearer ')
  if (!token) {
    res.status(401)
    res.end()
    return
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
      // this happens all the time. Safe to ignore
    } else {
      // another error type is "JsonWebTokenError" and in that case someone sent
      // an invalid token. Seems fishy, so we log.
      // Otherwise it's some unknown error and we should log that as well...
      log({token, error})
    }
  }

  if (decodedToken) {
    req.decodedToken = decodedToken
    req.user = await usersDB.readById(decodedToken.userId)
  } else {
    res.status(401)
    res.end()
  }
}

export {setUser}
