const express = require('express')
const app = express()
const livereload = require('livereload')

app.use(express.static('./'))

const server = livereload.createServer()
server.watch(__dirname)

app.use(require('connect-livereload')())

app.listen(3000, function () {
  console.log('listening on port 3000')
})
