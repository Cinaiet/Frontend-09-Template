const http = require('http')

http.createServer((req, res) => {
  let body = []
  req.on('error', (err) => {
    console.log('err', err)
  }).on('data', (chunk) => {
    body.push(chunk.toString())
  }).on('end', () => {
    body =  (Buffer.concat([ Buffer.from(body.toString()) ])).toString()
    console.log("body", body)
    res.writeHead(200, { 'Content-Type': 'text/html'})
    res.end('hello world\n')
  })
}).listen(8088)

console.log('server started')