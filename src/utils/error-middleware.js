function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error)
  } else {
    res.status(500)
    res.json({
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    })
  }
}

export default errorMiddleware
