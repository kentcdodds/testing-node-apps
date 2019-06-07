const http = require('http')

http
  .createServer((req, res) => {
    res.write(
      `You may be reading this if you pull this up on codesandbox. Don't worry about it and focus on the terminal instead.`,
    )
    res.end()
  })
  .listen(8080)
