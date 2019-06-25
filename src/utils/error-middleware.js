function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error)
  } else {
    res.status(500)
    res.json({error})
  }
}

export default errorMiddleware
