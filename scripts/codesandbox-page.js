const http = require('http')

const message = 'Go ahead and ignore this. Open the terminal and run "npm test"'

console.log(message)

http
  .createServer((req, res) => {
    res.write(message)
    res.end()
  })
  .listen(8080)
